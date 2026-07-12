import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, addDoc, query, where, getDocs, limit, serverTimestamp } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import { leadRegistry } from '../../../../lib/leadConfig';
import { sendSlackNotification } from '../../../../lib/slack';

// ── Helpers ────────────────────────────────────────────────────────────────
export function serializeLeadDetails(data: {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  referrer?: string | null;
}) {
  const lines = [];
  if (data.utmSource)   lines.push(`UTM Source: ${data.utmSource}`);
  if (data.utmMedium)   lines.push(`UTM Medium: ${data.utmMedium}`);
  if (data.utmCampaign) lines.push(`UTM Campaign: ${data.utmCampaign}`);
  if (data.utmContent)  lines.push(`UTM Content: ${data.utmContent}`);
  if (data.utmTerm)     lines.push(`UTM Term: ${data.utmTerm}`);
  if (data.referrer)    lines.push(`Referrer: ${data.referrer}`);
  return lines.join('\n') || 'Direct';
}

async function getLeadSettings() {
  try {
    const snap = await getDocs(
      query(collection(db, 'leadSettings'), where('key', '==', 'global'), limit(1))
    );
    if (!snap.empty) {
      return snap.docs[0].data() as any;
    }
  } catch {}
  return { dripEnabled: true, dripHour: -1, slackEnabled: false };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, slug, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referrer } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }

    const asset = leadRegistry[slug];
    if (!asset) {
      return NextResponse.json({ error: 'Asset configuration not found.' }, { status: 404 });
    }

    // ── 1. Duplicate check (per email per slug) in leadSubmissions ──
    let hasActiveDrip = false;
    try {
      const existing = await getDocs(
        query(collection(db, 'leadSubmissions'),
          where('email', '==', email),
          where('slug', '==', slug),
          limit(5))
      );
      existing.forEach(d => {
        const s = d.data().dripStatus;
        if (s === 'active' || s === 'completed') hasActiveDrip = true;
      });
    } catch (e: any) {
      console.warn('Lead submit: duplicate check failed (non-fatal):', e.message);
    }

    // ── 2. Schedule first drip email ──
    const settings = await getLeadSettings();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (settings.dripHour >= 0 && settings.dripHour <= 23) {
      tomorrow.setHours(settings.dripHour, 0, 0, 0);
    }

    // ── 3. Write to dedicated leadSubmissions collection ──
    let docId: string | null = null;
    try {
      const docRef = await addDoc(collection(db, 'leadSubmissions'), {
        name: name || 'Lead Magnet User',
        email,
        slug,
        assetTitle: asset.title,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        utmTerm: utmTerm || null,
        referrer: referrer || null,
        dripStatus: hasActiveDrip ? 'duplicate' : (settings.dripEnabled ? 'active' : 'paused'),
        dripDay: hasActiveDrip ? 0 : 1,
        dripScheduledFor: hasActiveDrip ? null : (settings.dripEnabled ? tomorrow.toISOString() : null),
        dripSentHistory: [],
        emailOpens: [],
        capturedAt: serverTimestamp(),
      });
      docId = docRef.id;
    } catch (e: any) {
      console.error('Lead submit: write to leadSubmissions failed:', e.message);
      // Fallback: write to formSubmissions so capture is never lost
      try {
        await addDoc(collection(db, 'formSubmissions'), {
          name: name || 'Lead Magnet User',
          email,
          country: 'Not provided',
          sector: 'Not provided',
          budget: 'Not provided',
          details: serializeLeadDetails({ utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referrer }),
          type: `Lead Magnet: ${slug}`,
          createdAt: serverTimestamp(),
        });
      } catch {}
    }

    // ── 4. Send Day 0 asset delivery email ──
    const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const smtpUser = process.env.SMTP_USER || 'info@proconixpmc.com';
    const smtpPass = process.env.SMTP_PASS || '';

    if (!smtpPass) {
      console.warn('Lead submit: SMTP_PASS not set — lead captured, email skipped');
      return NextResponse.json({
        success: true,
        message: 'Lead registered. Email delivery requires SMTP configuration on server.',
        dripQueued: !hasActiveDrip,
      });
    }

    const transporter = nodemailer.createTransport({
      host, port, secure: port === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    let bodyHtml = asset.immediateBody;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://proconixpmc.com';
    if (docId) {
      // Point to branded landing page — opens page first, then auto-downloads the PDF
      const downloadUrl = `${baseUrl}/leads/${slug}?id=${docId}`;
      bodyHtml = bodyHtml.replace(
        /href="https:\/\/proconixpmc\.com\/assets\/lead-magnets\/[a-zA-Z0-9_-]+\.pdf"/g,
        `href="${downloadUrl}"`
      );
      bodyHtml = bodyHtml.replace(
        /href="\/assets\/lead-magnets\/[a-zA-Z0-9_-]+\.pdf"/g,
        `href="${downloadUrl}"`
      );
      // Also replace any existing direct API download links
      bodyHtml = bodyHtml.replace(
        /href="https?:\/\/[^"]*\/api\/leads\/download[^"]*"/g,
        `href="${downloadUrl}"`
      );
    }

    let emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="font-family:'DM Sans','Helvetica Neue',Arial,sans-serif;line-height:1.7;color:#FFFFFF;background-color:#0B1D35;margin:0;padding:0;">
  <div style="background-color:#07142A;padding:40px 20px;">
    <div style="max-width:600px;margin:0 auto;background:#122647;border:1px solid rgba(201,168,76,0.18);border-radius:4px;overflow:hidden;">
      <div style="height:3px;background-color:#C9A84C;"></div>
      <div style="padding:32px 40px 16px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.08);">
        <div style="font-family:'Cormorant Garamond',serif;color:#FFFFFF;font-size:26px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">PROCONIX</div>
        <div style="color:#C9A84C;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Project Management Consultancy</div>
      </div>
      <div style="padding:32px 40px 40px;text-align:left;">
        ${bodyHtml}
      </div>
      <div style="padding:24px 40px;text-align:center;font-size:11px;color:#8EA8C3;border-top:1px solid rgba(201,168,76,0.08);background:#07142A;letter-spacing:0.5px;">
        &copy; 2026 Proconix Project Management Consultancy &middot; Africa &middot; GCC
      </div>
    </div>
  </div>
</body>
</html>`;

    if (docId) {
      const trackingPixel = `<img src="${baseUrl}/api/track/open?id=${docId}&day=0" width="1" height="1" alt="" style="display:none;border:0;" />`;
      emailHtml = emailHtml.replace('</body>', `${trackingPixel}</body>`);
    }

    try {
      await transporter.sendMail({
        from: `"Proconix PMC" <${smtpUser}>`,
        to: email,
        subject: asset.immediateSubject,
        html: emailHtml,
      });
    } catch (mailErr: any) {
      console.error('Lead submit: Day 0 email failed:', mailErr.message);
    }

    // ── 5. Conditional Slack ──
    if (settings.slackEnabled) {
      try {
        await sendSlackNotification({
          type: `Lead Magnet: ${slug}`,
          name: name || 'Lead Magnet User',
          email,
          details: `Source: ${utmSource || 'N/A'} | Medium: ${utmMedium || 'N/A'} | Campaign: ${utmCampaign || 'N/A'}`,
          priority: 'low',
        });
      } catch {}
    }

    return NextResponse.json({ success: true, dripQueued: !hasActiveDrip });
  } catch (error: any) {
    console.error('Lead Submit Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
