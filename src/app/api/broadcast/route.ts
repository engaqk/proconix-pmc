import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      <style>
        body { font-family: 'DM Sans', 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #FFFFFF; background-color: #0B1D35; margin: 0; padding: 0; }
        .wrapper { background-color: #07142A; padding: 60px 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #122647; border: 1px solid rgba(201,168,76,0.18); border-radius: 4px; overflow: hidden; position: relative; }
        .top-gradient { height: 3px; background: linear-gradient(90deg, #9A7A35, #C9A84C, #9A7A35); }
        .header { padding: 40px 40px 20px; text-align: center; }
        .logo { font-family: 'Cormorant Garamond', serif; color: #FFFFFF; font-size: 28px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }
        .logo span { color: #C9A84C; }
        .tagline { color: #C9A84C; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px; }
        .content { padding: 0 40px 40px; text-align: left; color: #FFFFFF; font-size: 16px; line-height: 1.8; }
        p { color: #FFFFFF; font-weight: 300; font-size: 16px; margin-bottom: 20px; }
        .footer { padding: 40px; text-align: center; font-size: 11px; color: #8EA8C3; border-top: 1px solid rgba(201,168,76,0.1); background: #07142A; letter-spacing: 0.5px; }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="top-gradient"></div>
          <div class="header">
            <div class="logo">PROCONIX</div>
            <div class="tagline">Project Management Consultancy</div>
          </div>
          <div class="content" style="color: #FFFFFF; font-size: 16px; line-height: 1.8;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <div class="footer">
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
    const { emails, subject, message, secret, scheduledAt } = body;

    // Simple security check to ensure this is only triggered from the admin dashboard
    if (secret !== 'admin53') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!emails || emails.length === 0) {
      return NextResponse.json({ error: 'No recipients provided' }, { status: 400 });
    }

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Handle scheduling
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate > new Date()) {
        await addDoc(collection(db, "scheduledBroadcasts"), {
          emails,
          subject,
          message,
          scheduledAt: scheduledDate.toISOString(),
          status: "pending",
          createdAt: new Date().toISOString()
        });
        return NextResponse.json({ success: true, count: emails.length, scheduled: true });
      }
    }

    const htmlMessage = formatBroadcastHtml(message);
    
    await sendBroadcastEmail(emails, subject, htmlMessage);

    return NextResponse.json({ success: true, count: emails.length });
  } catch (err: any) {
    console.error('Broadcast Email Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send broadcast' }, { status: 500 });
  }
}
