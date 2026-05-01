import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { sendBroadcastEmail, formatBroadcastHtml } from '../../broadcast/route';

export async function POST(req: Request) {
  try {
    // Basic authorization to prevent arbitrary triggers
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'admin53'}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date().toISOString();

    const q = query(
      collection(db, "scheduledBroadcasts"),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(q);
    const sentBroadcasts = [];

    for (const document of snapshot.docs) {
      const data = document.data();
      
      // Only process if scheduled time has passed
      if (data.scheduledAt <= now) {
        try {
          const htmlMessage = formatBroadcastHtml(data.message);
          await sendBroadcastEmail(data.emails, data.subject, htmlMessage);

          // Update status to sent
          await updateDoc(doc(db, "scheduledBroadcasts", document.id), {
            status: "sent",
            sentAt: now
          });

          sentBroadcasts.push(document.id);
        } catch (err) {
          console.error(`Failed to send scheduled broadcast ${document.id}:`, err);
          await updateDoc(doc(db, "scheduledBroadcasts", document.id), {
            status: "failed",
            error: String(err),
            failedAt: now
          });
        }
      }
    }

    return NextResponse.json({ success: true, processed: sentBroadcasts.length });
  } catch (err: any) {
    console.error('Scheduled Broadcast Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to process scheduled broadcasts' }, { status: 500 });
  }
}
