import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { sendBroadcastEmail, formatBroadcastHtml } from '../../broadcast/route';

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

    const sentBroadcasts: string[] = [];

    for (const document of snapshot.docs) {
      const data = document.data();
      const scheduledAt = new Date(data.scheduledAt);

      logs.push(`Broadcast ${document.id}: scheduledAt=${data.scheduledAt}, subject="${data.subject}", recipients=${data.emails?.length ?? 0}`);

      // Only send if the scheduled time has passed
      if (scheduledAt <= now) {
        logs.push(`→ Sending now (scheduled time has passed)`);
        try {
          const htmlMessage = formatBroadcastHtml(data.message);
          const count = await sendBroadcastEmail(data.emails, data.subject, htmlMessage);
          logs.push(`→ Successfully sent to ${count}/${data.emails.length} recipient(s)`);

          await updateDoc(doc(db, 'scheduledBroadcasts', document.id), {
            status: 'sent',
            sentAt: nowISO,
          });

          sentBroadcasts.push(document.id);
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
        logs.push(`→ Skipping: scheduled in ${diffMins} minute(s)`);
      }
    }

    return NextResponse.json({ success: true, processed: sentBroadcasts.length, logs });
  } catch (err: any) {
    logs.push(`FATAL ERROR: ${err.message}`);
    console.error('Scheduled Broadcast Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process scheduled broadcasts', logs }, { status: 500 });
  }
}
