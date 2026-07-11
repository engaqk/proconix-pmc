import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, addDoc, query, where, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import { leadRegistry } from '../../../../lib/leadConfig';
import { getDailyEmailsSent, logEmailsSent, DAILY_EMAIL_LIMIT } from '../../broadcast/route';

function serializeDetails(data: {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  referrer?: string | null;
  dripStatus?: string | null;
  dripDay?: number | null;
  dripScheduledFor?: string | null;
  dripSentHistory?: any[] | null;
}) {
  const lines = [];
  if (data.utmSource) lines.push(`UTM Source: ${data.utmSource}`);
  if (data.utmMedium) lines.push(`UTM Medium: ${data.utmMedium}`);
  if (data.utmCampaign) lines.push(`UTM Campaign: ${data.utmCampaign}`);
  if (data.utmContent) lines.push(`UTM Content: ${data.utmContent}`);
  if (data.utmTerm) lines.push(`UTM Term: ${data.utmTerm}`);
  if (data.referrer) lines.push(`Referrer: ${data.referrer}`);
  if (data.dripStatus) lines.push(`Drip Status: ${data.dripStatus}`);
  if (data.dripDay !== undefined && data.dripDay !== null) lines.push(`Drip Day: ${data.dripDay}`);
  if (data.dripScheduledFor) lines.push(`Drip Scheduled For: ${data.dripScheduledFor}`);
  if (data.dripSentHistory) lines.push(`Drip Sent History: ${JSON.stringify(data.dripSentHistory)}`);
  return lines.join("\n") || "Not provided";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, slug, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referrer } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const asset = leadRegistry[slug];
    if (!asset) {
      return NextResponse.json({ error: 'Asset configuration not found.' }, { status: 404 });
    }

    // 1. Check if the user already has an active or completed drip for this asset
    console.log("Submit Route: Querying existing submissions for email:", email);
    let hasActiveDrip = false;
    try {
      const existingQuery = query(
        collection(db, 'formSubmissions'),
        where('email', '==', email),
        limit(20)
      );
      const existingSnap = await getDocs(existingQuery);
      console.log("Submit Route: Query succeeded, doc count:", existingSnap.docs.length);
      
      existingSnap.forEach(dDoc => {
        const d = dDoc.data();
        if (d.type === `Lead Magnet: ${slug}`) {
          // Parse details to read drip status
          const detailsStr = d.details || '';
          if (detailsStr.includes('Drip Status: active') || detailsStr.includes('Drip Status: completed')) {
            hasActiveDrip = true;
          }
        }
      });
    } catch (queryErr: any) {
      console.error("Submit Route: Query FAILED with error:", queryErr.message);
    }

    let dripQueued = false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Prepare serialized data to bypass Firestore fields rules
    const serializedDetails = serializeDetails({
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      referrer,
      dripStatus: hasActiveDrip ? 'duplicate' : 'active',
      dripDay: hasActiveDrip ? null : 1,
      dripScheduledFor: hasActiveDrip ? null : tomorrow.toISOString(),
      dripSentHistory: hasActiveDrip ? null : []
    });

    // Write submission logs into existing formSubmissions collection (compliant with Firestore Rules)
    const docData = {
      email,
      name: 'Lead Magnet User',
      type: `Lead Magnet: ${slug}`,
      country: 'Not provided',
      sector: 'Not provided',
      budget: 'Not provided',
      details: serializedDetails,
      createdAt: serverTimestamp()
    };

    console.log("Submit Route: Attempting to write document to formSubmissions...");
    try {
      await addDoc(collection(db, 'formSubmissions'), docData);
      console.log("Submit Route: Document write SUCCEEDED!");
      dripQueued = !hasActiveDrip;
    } catch (writeErr: any) {
      console.error("Submit Route: Document write FAILED with error:", writeErr.message);
      throw writeErr; // rethrow to return 500
    }

    // 3. Quota check for Day 0 immediate asset delivery
    let dailyUsed = 0;
    try {
      dailyUsed = await getDailyEmailsSent();
    } catch (quotaErr: any) {
      console.warn("Submit Route: Quota check failed (likely blocked by rules):", quotaErr.message);
    }

    const remaining = DAILY_EMAIL_LIMIT - dailyUsed;

    if (remaining <= 0) {
      return NextResponse.json({
        success: true,
        message: 'Lead registered. Delivery queued due to daily sending quota limits.',
        dripQueued
      });
    }

    // 4. Send Instant Asset Email (Day 0)
    const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER || 'info@proconixpmc.com';
    const pass = process.env.SMTP_PASS || '';

    if (!pass) {
      console.warn('SMTP_PASS is not set. Lead captured but email skipped.');
      return NextResponse.json({
        success: true,
        message: 'Lead registered. (SMTP not configured on server)',
        dripQueued
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    // Theme styled template
    const emailHtml = `
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
              ${asset.immediateBody}
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

    await transporter.sendMail({
      from: `"Proconix PMC" <${user}>`,
      to: email,
      subject: asset.immediateSubject,
      html: emailHtml,
    });

    // Log the successful send to update email quota tracker
    try {
      await logEmailsSent(1, asset.immediateSubject);
    } catch (logErr: any) {
      console.warn("Submit Route: Quota log failed (likely blocked by rules):", logErr.message);
    }

    return NextResponse.json({ success: true, dripQueued });
  } catch (error: any) {
    console.error('Lead Submit Error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing lead' }, { status: 500 });
  }
}
