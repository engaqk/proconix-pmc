import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { sendSlackNotification } from '../../../lib/slack';


// Modern SMTP Client using Nodemailer (Hostinger Optimized)
async function sendEmailViaNodemailer(options: { 
  to: string;
  subject: string; 
  html: string; 
}) {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER || 'info@proconixpmc.com';
  const pass = process.env.SMTP_PASS || '';

  if (!pass) {
    console.error('SMTP ERROR: SMTP_PASS is not set.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return await transporter.sendMail({
    from: `"Proconix Admin" <${user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}


function getEmailTemplate(data: {
  name: string;
  email: string;
  type: string;
  country?: string;
  sector?: string;
  budget?: string;
  details?: string;
}) {
  const { name, email, type, country, sector, budget, details } = data;
  
  const isHighPriority = type.includes('Call') || type.includes('Audit') || type.includes('Simulator') || type.includes('Lead Page');
  const accentColor = isHighPriority ? '#C9A84C' : '#25D366';
  const badgeEmoji = isHighPriority ? '🔥' : '📩';

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
        .content { padding: 0 40px 40px; }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 25px; background: rgba(201,168,76,0.12); color: #C9A84C; border: 1px solid rgba(201,168,76,0.2); }
        h2 { font-family: 'Cormorant Garamond', serif; margin: 0 0 15px; font-size: 26px; font-weight: 600; color: #FFFFFF; line-height: 1.2; }
        h2 em { font-style: italic; color: #C9A84C; }
        .lead-info { background: #0B1D35; border-left: 2px solid #C9A84C; padding: 25px; margin: 30px 0; border-radius: 0; }
        .info-row { margin-bottom: 15px; }
        .info-label { font-size: 10.5px; font-weight: 600; color: #8EA8C3; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px; }
        .info-value { display: block; color: #FFFFFF; font-size: 16px; font-weight: 500; }
        .details-label { font-size: 11px; font-weight: 600; color: #C9A84C; text-transform: uppercase; letter-spacing: 1px; margin-top: 25px; display: block; }
        .details-box { background: rgba(11,29,53,0.5); border: 1px solid rgba(201,168,76,0.1); padding: 20px; border-radius: 0; margin-top: 10px; font-style: italic; color: #C2D4E4; font-size: 14px; line-height: 1.8; }
        .footer { padding: 40px; text-align: center; font-size: 11px; color: #8EA8C3; border-top: 1px solid rgba(201,168,76,0.1); background: #07142A; letter-spacing: 0.5px; }
        .btn { display: inline-block; padding: 16px 36px; background: #C9A84C; color: #0B1D35; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; border-radius: 0; margin: 30px 0 10px; transition: background 0.3s; }
        .secondary { color: #8EA8C3; font-size: 12px; font-weight: 300; margin-top: 20px; }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="top-gradient"></div>
          <div class="header">
            <div class="logo">PROCONIX <span>PMC</span></div>
            <div class="tagline">Project Management Consultancy</div>
          </div>
          <div class="content" style="text-align: left;">
            <div class="badge">${badgeEmoji} ${type}</div>
            <h2>New Intent <em>Captured</em></h2>
            <p style="color: #C2D4E4; font-weight: 300; font-size: 15px;">A potential project sponsor has engaged with the platform. Immediate follow-up is recommended.</p>
            
            <div class="lead-info">
              <div class="info-row">
                <span class="info-label">Sponsor Name</span>
                <span class="info-value">${name || 'Anonymous Submission'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Contact Email</span>
                <span class="info-value"><a href="mailto:${email}" style="color: #FFFFFF; text-decoration: none; border-bottom: 1px solid #C9A84C;">${email}</a></span>
              </div>
              ${country ? `<div class="info-row"><span class="info-label">Market / Country</span><span class="info-value">${country}</span></div>` : ''}
              ${sector || budget ? `<div class="info-row"><span class="info-label">Sector & Capital Scope</span><span class="info-value">${sector || budget}</span></div>` : ''}
            </div>

            ${details ? `
              <span class="details-label">Additional Context / Leakage:</span>
              <div class="details-box">
                ${details.replace(/\n/g, '<br>')}
              </div>
            ` : ''}

            <center>
              <a href="mailto:${email}" class="btn">Reply to Sponsor</a>
              <p class="secondary">Intent detected via Proconix Project Management Consultancy v2.0</p>
            </center>
          </div>
          <div class="footer">
            &copy; 2026 Proconix Project Management Consultancy<br>
            Project Management Consultancy · Africa · GCC · UK · UK-Europe
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
    const { name, email, country, sector, budget, type, details: incomingDetails } = body;
    
    console.log('API Contact Route: Processing submission for', email);

    // Determine type if not provided
    const displayType = type || (country ? 'Checklist Download' : 'Lead Capture');

    // 1. Save to Firestore (Primary Record)
    try {
      await addDoc(collection(db, 'formSubmissions'), {
        name: name || '',
        email: email || '',
        country: country || 'Not provided',
        sector: sector || budget || 'Not provided',
        budget: budget || 'Not provided',
        createdAt: serverTimestamp(),
        type: displayType
      });
    } catch (dbError: any) {
      console.error("CRITICAL: Firestore Save Error:", dbError);
    }

    // 2. Notify Slack (High Reliability)
    try {
      await sendSlackNotification({
        type: displayType,
        name: name || 'Anonymous',
        email: email || 'N/A',
        country: country,
        sector: sector || budget,
        details: incomingDetails || (budget ? `Budget: ${budget}` : undefined),
        priority: displayType.includes('Call') || displayType.includes('Audit') || displayType.includes('Simulator') ? 'high' : displayType.includes('WhatsApp') ? 'medium' : 'low'
      });
    } catch (slackError) {
      console.error('Slack Notification Error:', slackError);
    }

    // 3. Trigger email to Admin (Premium HTML Template)
    try {
      const emailHtml = getEmailTemplate({
        name: name || 'Anonymous',
        email: email || 'N/A',
        type: displayType,
        country,
        sector,
        budget,
        details: incomingDetails
      });

      await sendEmailViaNodemailer({
        to: process.env.SMTP_TO || 'info@proconixpmc.com',
        subject: `NEW LEAD: ${displayType} - ${name || 'Anonymous'}`,
        html: emailHtml,
      });
      console.log('SMTP: HTML Email sent successfully');
    } catch (smtpError: any) {
      console.error('SMTP Email Error (Non-Fatal):', smtpError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('API Contact Global Error:', err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}


