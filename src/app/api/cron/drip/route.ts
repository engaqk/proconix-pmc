import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import nodemailer from 'nodemailer';
import { leadRegistry } from '../../../../lib/leadConfig';
import { getDailyEmailsSent, logEmailsSent, DAILY_EMAIL_LIMIT } from '../../broadcast/route';

export async function POST(req: Request) {
  const logs: string[] = [];
  try {
    // 1. Authorization validation check
    const authHeader = req.headers.get('authorization');
    const secret = process.env.CRON_SECRET || 'admin53';
    if (authHeader !== `Bearer ${secret}`) {
      logs.push('ERROR: Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized', logs }, { status: 401 });
    }

    // Check SMTP config
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpPass) {
      logs.push('ERROR: SMTP_PASS environment variable is not set on this server');
      return NextResponse.json({ error: 'SMTP not configured', logs }, { status: 500 });
    }

    const now = new Date();
    const nowISO = now.toISOString();
    logs.push(`Cron Drip processor running at: ${nowISO}`);

    // 2. Fetch current daily usage to ensure we respect Hostinger limit
    let dailyUsed = await getDailyEmailsSent();
    logs.push(`Daily quota status: ${dailyUsed}/${DAILY_EMAIL_LIMIT} used`);

    // 3. Query active drips that are scheduled for execution
    const dripQuery = query(
      collection(db, 'leadDripStates'),
      where('status', '==', 'active'),
      where('scheduledFor', '<=', nowISO)
    );
    const snap = await getDocs(dripQuery);
    logs.push(`Found ${snap.docs.length} active drip state(s) scheduled to execute`);

    if (snap.empty) {
      return NextResponse.json({ success: true, processed: 0, logs });
    }

    const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER || 'info@proconixpmc.com';

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: smtpPass },
    });

    let processedCount = 0;

    for (const dDoc of snap.docs) {
      const stateObj = dDoc.data();
      const { email, slug, currentDay } = stateObj;

      const remaining = DAILY_EMAIL_LIMIT - dailyUsed;
      if (remaining <= 0) {
        logs.push(`Drip ${dDoc.id} (${email}): → SKIPPED (Daily quota reached)`);
        continue;
      }

      // Resolve asset mapping config
      const asset = leadRegistry[slug];
      if (!asset) {
        logs.push(`Drip ${dDoc.id} (${email}): → FAILED (Asset config registry mapping missing for slug: ${slug})`);
        await updateDoc(doc(db, 'leadDripStates', dDoc.id), {
          status: 'failed',
          error: `Asset configuration missing for slug: ${slug}`
        });
        continue;
      }

      // 4. Resolve templates (Check Firestore for custom templates, fall back to registry default)
      const templateQuery = query(
        collection(db, 'leadDripTemplates'),
        where('slug', '==', slug),
        where('day', '==', currentDay)
      );
      const tSnap = await getDocs(templateQuery);
      
      let subject = '';
      let body = '';

      // Get templates based on day number
      const dayKey = `day${currentDay}` as 'day1' | 'day2' | 'day3' | 'day4';
      const defaultTemplate = asset.dripTemplates[dayKey];

      if (!tSnap.empty) {
        const customTemplate = tSnap.docs[0].data();
        subject = customTemplate.subject || defaultTemplate?.subject;
        body = customTemplate.body || defaultTemplate?.body;
      } else if (defaultTemplate) {
        subject = defaultTemplate.subject;
        body = defaultTemplate.body;
      } else {
        logs.push(`Drip ${dDoc.id} (${email}): → FAILED (No template found for Day ${currentDay})`);
        continue;
      }

      // Styled wrapper matching Proconix theme
      const styledHtml = `
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
                ${body}
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

      try {
        const info = await transporter.sendMail({
          from: `"Proconix PMC" <${user}>`,
          to: email,
          subject,
          html: styledHtml,
        });

        // 5. Update drip sequence progression state
        const isComplete = currentDay >= 4;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await updateDoc(doc(db, 'leadDripStates', dDoc.id), {
          currentDay: currentDay + 1,
          status: isComplete ? 'completed' : 'active',
          scheduledFor: isComplete ? null : tomorrow.toISOString(),
          sentHistory: [...(stateObj.sentHistory || []), {
            day: currentDay,
            sentAt: nowISO,
            messageId: info.messageId
          }]
        });

        dailyUsed += 1;
        await logEmailsSent(1, subject);
        processedCount++;
        logs.push(`Drip ${dDoc.id} (${email}): → Successfully sent Day ${currentDay}`);
      } catch (err: any) {
        logs.push(`Drip ${dDoc.id} (${email}): → Failed sending Day ${currentDay}: ${err.message}`);
      }
    }

    return NextResponse.json({ success: true, processed: processedCount, logs });
  } catch (error: any) {
    logs.push(`FATAL ERROR: ${error.message}`);
    console.error('Drip Cron Error:', error);
    return NextResponse.json({ error: error.message || 'Cron execution failed', logs }, { status: 500 });
  }
}
