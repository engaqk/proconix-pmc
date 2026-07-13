import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, limit, getDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import { leadRegistry } from '../../../../lib/leadConfig';

// ── Helpers ─────────────────────────────────────────────────────────────────
async function getSettings() {
  try {
    const snap = await getDocs(
      query(collection(db, 'leadSettings'), where('key', '==', 'global'), limit(1))
    );
    if (!snap.empty) return snap.docs[0].data() as any;
  } catch {}
  return { dripEnabled: true, dripHour: -1 };
}

async function runDrip(authHeader: string | null) {
  const logs: string[] = [];
  try {
    const secret = process.env.CRON_SECRET || 'admin53';
    if (authHeader !== `Bearer ${secret}`) {
      logs.push('ERROR: Unauthorized request');
      return { success: false, error: 'Unauthorized', logs, status: 401 };
    }

    const smtpPass = process.env.SMTP_PASS;
    if (!smtpPass) {
      logs.push('ERROR: SMTP_PASS not configured');
      return { success: false, error: 'SMTP not configured', logs, status: 500 };
    }

    const now = new Date();
    const nowISO = now.toISOString();
    logs.push(`Drip cron running at: ${nowISO}`);

    const settings = await getSettings();
    if (!settings.dripEnabled) {
      logs.push('INFO: Drip disabled in admin settings');
      return { success: true, processed: 0, logs, status: 200 };
    }
    logs.push(`Drip Hour: ${settings.dripHour === -1 ? 'any' : settings.dripHour}`);

    // Query active drips due for sending
    const snap = await getDocs(
      query(collection(db, 'leadSubmissions'), where('dripStatus', '==', 'active'))
    );

    const due = snap.docs.filter(d => {
      const s = d.data().dripScheduledFor;
      return s && s <= nowISO;
    });

    logs.push(`Found ${due.length} drip(s) due`);
    if (due.length === 0) return { success: true, processed: 0, logs, status: 200 };

    const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const smtpUser = process.env.SMTP_USER || 'info@proconixpmc.com';
    const transporter = nodemailer.createTransport({
      host, port, secure: port === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://proconixpmc.com';
    let processed = 0;

    for (const dDoc of due) {
      const d = dDoc.data();
      const { email, slug, dripDay = 1, dripSentHistory = [], emailOpens = [] } = d;

      const asset = leadRegistry[slug];
      if (!asset) {
        logs.push(`${dDoc.id}: FAILED — unknown slug: ${slug}`);
        await updateDoc(doc(db, 'leadSubmissions', dDoc.id), { dripStatus: 'failed' });
        continue;
      }

      const dayKey = `day${dripDay}` as 'day1' | 'day2' | 'day3' | 'day4';
      let template = asset.dripTemplates[dayKey];

      // Load custom template from Firestore if it exists
      try {
        const customSnap = await getDoc(doc(db, 'leadEmailTemplates', slug));
        if (customSnap.exists()) {
          const customData = customSnap.data();
          const customDay = customData[dayKey];
          if (customDay && (customDay.subject || customDay.body)) {
            template = {
              subject: customDay.subject || template.subject,
              body: customDay.body || template.body
            };
          }
        }
      } catch (fsErr: any) {
        logs.push(`INFO: Failed to check custom templates for ${slug} Day ${dripDay} — ${fsErr.message}`);
      }

      if (!template) {
        logs.push(`${dDoc.id}: FAILED — no template for Day ${dripDay}`);
        continue;
      }

      // Tracking pixel
      const trackingPixel = `<img src="${BASE_URL}/api/track/open?id=${dDoc.id}&day=${dripDay}" width="1" height="1" alt="" style="display:none;border:0;" />`;

      const html = `<!DOCTYPE html>
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
        <div style="margin-top:10px;display:inline-block;padding:3px 12px;border:1px solid rgba(201,168,76,0.3);border-radius:12px;font-size:11px;color:#C9A84C;letter-spacing:1px;">Day ${dripDay} of 4 — ${asset.title}</div>
      </div>
      <div style="padding:32px 40px 40px;text-align:left;">
        ${template.body}
      </div>
      <div style="padding:24px 40px;text-align:center;font-size:11px;color:#8EA8C3;border-top:1px solid rgba(201,168,76,0.08);background:#07142A;letter-spacing:0.5px;">
        &copy; 2026 Proconix Project Management Consultancy &middot; Africa &middot; GCC<br>
        <span style="font-size:10px;color:#4a6a8a;">You received this because you downloaded a resource from proconixpmc.com</span>
      </div>
    </div>
  </div>
  ${trackingPixel}
</body>
</html>`;

      try {
        const info = await transporter.sendMail({
          from: `"Proconix PMC" <${smtpUser}>`,
          to: email,
          subject: template.subject,
          html,
        });

        const isComplete = dripDay >= 4;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        if (settings.dripHour >= 0 && settings.dripHour <= 23) {
          nextDate.setHours(settings.dripHour, 0, 0, 0);
        }

        await updateDoc(doc(db, 'leadSubmissions', dDoc.id), {
          dripDay: dripDay + 1,
          dripStatus: isComplete ? 'completed' : 'active',
          dripScheduledFor: isComplete ? null : nextDate.toISOString(),
          dripSentHistory: [...dripSentHistory, { day: dripDay, sentAt: nowISO, messageId: info.messageId }],
          emailOpens,
        });

        processed++;
        logs.push(`${dDoc.id} (${email}): ✓ Day ${dripDay} sent${isComplete ? ' — COMPLETED' : `, next: ${nextDate.toISOString()}`}`);
      } catch (err: any) {
        logs.push(`${dDoc.id} (${email}): ✗ Day ${dripDay} FAILED — ${err.message}`);
      }
    }

    return { success: true, processed, logs, status: 200 };
  } catch (err: any) {
    logs.push(`FATAL: ${err.message}`);
    return { success: false, error: err.message, logs, status: 500 };
  }
}

// POST — from admin "Run Now" button
export async function POST(req: Request) {
  const result = await runDrip(req.headers.get('authorization'));
  return NextResponse.json(
    result.error ? { error: result.error, logs: result.logs } : { success: true, processed: result.processed, logs: result.logs },
    { status: result.status }
  );
}

// GET — from Vercel Cron (sends Authorization: Bearer CRON_SECRET)
export async function GET(req: Request) {
  const result = await runDrip(req.headers.get('authorization'));
  return NextResponse.json(
    result.error ? { error: result.error, logs: result.logs } : { success: true, processed: result.processed, logs: result.logs },
    { status: result.status }
  );
}
