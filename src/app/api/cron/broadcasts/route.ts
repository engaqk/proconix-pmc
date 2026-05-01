import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { sendBroadcastEmail, formatBroadcastHtml, getDailyEmailsSent, logEmailsSent, DAILY_EMAIL_LIMIT } from '../../broadcast/route';

export async function POST(req: Request) {
  const logs: string[] = [];

  try {
    // Authorization check
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET || 'admin53';
    if (authHeader !== `Bearer ${expectedSecret}`) {
      logs.push('ERROR: Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized', logs }, { status: 401 });
    }

    // Check SMTP config upfront
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpPass) {
      logs.push('ERROR: SMTP_PASS environment variable is not set on this server');
      return NextResponse.json({ error: 'SMTP not configured', logs }, { status: 500 });
    }

    const now = new Date();
    const nowISO = now.toISOString();
    logs.push(`Running at: ${nowISO}`);

    // Fetch current daily usage
    let dailyUsed = await getDailyEmailsSent();
    logs.push(`Daily quota status: ${dailyUsed}/${DAILY_EMAIL_LIMIT} used`);

    // Query all pending broadcasts
    const q = query(
      collection(db, 'scheduledBroadcasts'),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(q);
    logs.push(`Found ${snapshot.docs.length} pending broadcast(s) in Firestore`);

    if (snapshot.docs.length === 0) {
      return NextResponse.json({ success: true, processed: 0, logs });
    }

    const sentBroadcastIds: string[] = [];

    for (const document of snapshot.docs) {
      const data = document.data();
      const scheduledAt = new Date(data.scheduledAt);

      // Only send if the scheduled time has passed
      if (scheduledAt <= now) {
        const remaining = DAILY_EMAIL_LIMIT - dailyUsed;
        
        if (remaining <= 0) {
          logs.push(`Broadcast ${document.id}: → SKIPPED (Daily quota reached)`);
          continue; // Try next one (maybe a smaller one? No, they are all blocked if remaining is 0)
        }

        logs.push(`Broadcast ${document.id}: scheduledAt=${data.scheduledAt}, subject="${data.subject}", recipients=${data.emails?.length ?? 0}`);
        logs.push(`→ Sending now (remaining quota: ${remaining})`);

        try {
          const emailsToSend = data.emails.slice(0, remaining);
          const skippedCount = data.emails.length - emailsToSend.length;

          const htmlMessage = formatBroadcastHtml(data.message);
          const count = await sendBroadcastEmail(emailsToSend, data.subject, htmlMessage);
          
          dailyUsed += count;
          if (count > 0) await logEmailsSent(count, data.subject);

          logs.push(`→ Successfully sent to ${count}/${emailsToSend.length} recipient(s)`);
          if (skippedCount > 0) {
            logs.push(`→ WARN: ${skippedCount} recipients were skipped due to quota limits`);
          }

          await updateDoc(doc(db, 'scheduledBroadcasts', document.id), {
            status: skippedCount > 0 ? 'sent_partial' : 'sent',
            sentCount: count,
            skippedCount: skippedCount,
            sentAt: nowISO,
          });

          sentBroadcastIds.push(document.id);
        } catch (err: any) {
          logs.push(`→ FAILED: ${err.message}`);
          await updateDoc(doc(db, 'scheduledBroadcasts', document.id), {
            status: 'failed',
            error: err.message,
            failedAt: nowISO,
          });
        }
      } else {
        const diffMs = scheduledAt.getTime() - now.getTime();
        const diffMins = Math.ceil(diffMs / 60000);
        logs.push(`Broadcast ${document.id}: → Skipping (scheduled in ${diffMins} minute(s))`);
      }
    }

    return NextResponse.json({ success: true, processed: sentBroadcastIds.length, logs });
  } catch (err: any) {
    logs.push(`FATAL ERROR: ${err.message}`);
    console.error('Scheduled Broadcast Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process scheduled broadcasts', logs }, { status: 500 });
  }
}
