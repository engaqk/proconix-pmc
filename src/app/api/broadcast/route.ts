import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '../../../lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Hostinger limits: 100 emails per 24 hours
export const DAILY_EMAIL_LIMIT = 100;

export async function getDailyEmailsSent(): Promise<number> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const q = query(
    collection(db, 'emailQuotaLogs'),
    where('sentAt', '>=', since)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((sum, doc) => sum + (doc.data().count || 0), 0);
}

export async function logEmailsSent(count: number, subject: string) {
  await addDoc(collection(db, 'emailQuotaLogs'), {
    count,
    subject,
    sentAt: new Date().toISOString()
  });
}

export async function sendBroadcastEmail(emails: string[], subject: string, messageHtml: string) {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER || 'info@proconixpmc.com';
  const pass = process.env.SMTP_PASS || '';

  if (!pass) {
    throw new Error('SMTP_PASS is not set');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  // Send emails individually with a delay to avoid triggering Hostinger spam filters
  let successCount = 0;
  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    try {
      await transporter.sendMail({
        from: `"Proconix PMC" <${user}>`,
        to: email,
        subject: subject,
        html: messageHtml,
      });
      successCount++;
    } catch (e) {
      console.error(`Failed to send broadcast to ${email}:`, e);
    }
    // Wait 1 second between each email to avoid Hostinger rate-limit / spam flags
    if (i < emails.length - 1) {
      await sleep(1000);
    }
  }
  return successCount;
}

export function formatBroadcastHtml(message: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    </head>
    <body style="font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #FFFFFF; background-color: #0B1D35; margin: 0; padding: 0;">
      <div style="background-color: #07142A; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #122647; border: 1px solid rgba(201,168,76,0.18); border-radius: 4px; overflow: hidden;">
          <div style="height: 3px; background-color: #C9A84C;"></div>
          <div style="padding: 40px 40px 20px; text-align: center;">
            <div style="font-family: 'Cormorant Garamond', serif; color: #FFFFFF; font-size: 28px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">PROCONIX</div>
            <div style="color: #C9A84C; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Project Management Consultancy</div>
          </div>
          <div style="padding: 0 40px 40px; text-align: left; color: #FFFFFF; font-size: 16px; line-height: 1.8;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <div style="padding: 30px; text-align: center; font-size: 11px; color: #8EA8C3; border-top: 1px solid rgba(201,168,76,0.1); background: #07142A; letter-spacing: 0.5px;">
            &copy; 2026 Proconix Project Management Consultancy<br>
            Project Management Consultancy &middot; Africa &middot; GCC
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emails, subject, message, secret, scheduledAt, action } = body;

    // Security check
    if (secret !== 'admin53') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // New action to just get current quota status
    if (action === 'getQuota') {
      const alreadySent = await getDailyEmailsSent();
      return NextResponse.json({
        quota: { limit: DAILY_EMAIL_LIMIT, used: alreadySent, remaining: Math.max(0, DAILY_EMAIL_LIMIT - alreadySent) }
      });
    }

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: 'No recipients provided' }, { status: 400 });
    }

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Handle scheduling — no quota check needed now, it will be checked at send time
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate > new Date()) {
        await addDoc(collection(db, 'scheduledBroadcasts'), {
          emails,
          subject,
          message,
          scheduledAt: scheduledDate.toISOString(),
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        return NextResponse.json({ success: true, count: emails.length, scheduled: true });
      }
    }

    // Check daily quota before sending
    const alreadySent = await getDailyEmailsSent();
    const remaining = DAILY_EMAIL_LIMIT - alreadySent;

    if (remaining <= 0) {
      return NextResponse.json({
        error: `Daily email limit reached (${DAILY_EMAIL_LIMIT}/day). Quota resets in 24 hours.`,
        quota: { limit: DAILY_EMAIL_LIMIT, used: alreadySent, remaining: 0 }
      }, { status: 429 });
    }

    // Cap to remaining quota
    const emailsToSend = emails.slice(0, remaining);
    const skipped = emails.length - emailsToSend.length;

    const htmlMessage = formatBroadcastHtml(message);
    const sentCount = await sendBroadcastEmail(emailsToSend, subject, htmlMessage);

    // Log the sends for quota tracking
    if (sentCount > 0) {
      await logEmailsSent(sentCount, subject);
    }

    return NextResponse.json({
      success: true,
      count: sentCount,
      skipped,
      quota: { limit: DAILY_EMAIL_LIMIT, used: alreadySent + sentCount, remaining: remaining - sentCount }
    });
  } catch (err: any) {
    console.error('Broadcast Email Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send broadcast' }, { status: 500 });
  }
}

