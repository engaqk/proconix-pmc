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
  const badgeEmoji = isHighPriority ? '🔥' : '📩';

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
          <div style="padding: 0 40px 40px; text-align: left;">
            <div style="display: inline-block; padding: 6px 14px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 25px; background: rgba(201,168,76,0.12); color: #C9A84C; border: 1px solid rgba(201,168,76,0.2);">${badgeEmoji} ${type}</div>
            <h2 style="font-family: 'Cormorant Garamond', serif; margin: 0 0 15px; font-size: 26px; font-weight: 600; color: #FFFFFF; line-height: 1.2;">New Intent <em style="font-style: italic; color: #C9A84C;">Captured</em></h2>
            <p style="color: #C2D4E4; font-weight: 300; font-size: 15px;">A potential project sponsor has engaged with the platform. Immediate follow-up is recommended.</p>
            
            <div style="background: #0B1D35; border-left: 2px solid #C9A84C; padding: 25px; margin: 30px 0;">
              <div style="margin-bottom: 15px;">
                <div style="font-size: 10.5px; font-weight: 600; color: #8EA8C3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Sponsor Name</div>
                <div style="color: #FFFFFF; font-size: 16px; font-weight: 500;">${name || 'Not provided'}</div>
              </div>
              <div style="margin-bottom: 15px;">
                <div style="font-size: 10.5px; font-weight: 600; color: #8EA8C3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Contact Email</div>
                <div style="color: #FFFFFF; font-size: 16px; font-weight: 500;"><a href="mailto:${email}" style="color: #C9A84C; text-decoration: none; border-bottom: 1px solid #C9A84C;">${email || 'Not provided'}</a></div>
              </div>
              <div style="margin-bottom: 15px;">
                <div style="font-size: 10.5px; font-weight: 600; color: #8EA8C3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Market / Country</div>
                <div style="color: #FFFFFF; font-size: 16px; font-weight: 500;">${country || 'Not provided'}</div>
              </div>
              <div style="margin-bottom: 0;">
                <div style="font-size: 10.5px; font-weight: 600; color: #8EA8C3; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Sector & Capital Scope</div>
                <div style="color: #FFFFFF; font-size: 16px; font-weight: 500;">${sector || budget || 'Not provided'}</div>
              </div>
            </div>

            ${details ? `
              <div style="font-size: 11px; font-weight: 600; color: #C9A84C; text-transform: uppercase; letter-spacing: 1px; margin-top: 25px;">Additional Context / Leakage:</div>
              <div style="background: rgba(11,29,53,0.5); border: 1px solid rgba(201,168,76,0.1); padding: 20px; margin-top: 10px; font-style: italic; color: #C2D4E4; font-size: 14px; line-height: 1.8;">
                ${details.replace(/\n/g, '<br>')}
              </div>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <a href="mailto:${email}" style="display: inline-block; padding: 16px 36px; background: #C9A84C; color: #0B1D35; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Reply to Sponsor</a>
              <p style="color: #8EA8C3; font-size: 12px; font-weight: 300; margin-top: 20px;">Intent detected via Proconix Project Management Consultancy v2.0</p>
            </div>
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

function getUserEmailTemplate(name: string) {
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
            <div style="font-family: 'Cormorant Garamond', serif; color: #FFFFFF; font-size: 28px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">PROCONIX <span style="color: #C9A84C;">PMC</span></div>
            <div style="color: #C9A84C; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Project Management Consultancy</div>
          </div>
          <div style="padding: 0 40px 40px; text-align: left;">
            <h2 style="font-family: 'Cormorant Garamond', serif; margin: 0 0 15px; font-size: 24px; font-weight: 600; color: #FFFFFF; line-height: 1.2;">Governance Starts <em style="font-style: italic; color: #C9A84C;">Now.</em></h2>
            <p style="color: #C2D4E4; font-weight: 300; font-size: 15px; margin-bottom: 20px;">Dear ${name || 'Project Sponsor'},</p>
            <p style="color: #C2D4E4; font-weight: 300; font-size: 15px; margin-bottom: 20px;">Thank you for downloading the <strong style="color: #FFFFFF;">Before You Break Ground: Pre-Construction Governance Checklist</strong>.</p>
            <p style="color: #C2D4E4; font-weight: 300; font-size: 15px; margin-bottom: 20px;">70% of construction project problems in Africa are created before ground is broken. This checklist is your first step in ensuring a structured governance command is in place to protect your capital from day one.</p>
            <p style="color: #C2D4E4; font-weight: 300; font-size: 15px; margin-bottom: 20px;">You can access your checklist at any time using the link below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://proconixpmc.com/proconix-checklist.pdf" style="display: inline-block; padding: 16px 36px; background: #C9A84C; color: #0B1D35; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">View Your Checklist</a>
            </div>
            <p style="color: #C2D4E4; font-weight: 300; font-size: 15px; margin-bottom: 20px;">If you are ready to discuss the specific governance architecture for your project, you can reply directly to this email or book a discovery call on our website.</p>
            <p style="color: #C2D4E4; font-weight: 300; font-size: 15px; margin-bottom: 20px;">Regards,<br><strong style="color: #FFFFFF;">Talibbhai Khanji</strong><br>Founder & Principal Consultant<br>Proconix PMC</p>
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
        details: incomingDetails || 'Not provided',
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

    // 4. Send email to User if they downloaded the checklist or submitted a form
    if (email && email.includes('@')) {
      try {
        const userEmailHtml = getUserEmailTemplate(name || '');
        await sendEmailViaNodemailer({
          to: email,
          subject: 'Your Pre-Construction Governance Checklist - Proconix PMC',
          html: userEmailHtml,
        });
        console.log('SMTP: HTML Email sent successfully to user');
      } catch (smtpUserError: any) {
        console.error('SMTP Email Error (User):', smtpUserError.message);
      }
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


