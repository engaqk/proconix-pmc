import { NextResponse } from 'next/server';
import tls from 'tls';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { sendSlackNotification } from '../../../lib/slack';

// Robust Raw SMTP Client using Node TLS 
async function sendRawSmtpEmail(options: { 
  to: string;
  bcc?: string;
  subject: string; 
  text: string; 
}) {
  const user = process.env.GMAIL_USER || 'talibkhanjipmp@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD || '';
  
  if (!pass || pass === 'your_app_password_here') {
    console.error('SMTP ERROR: GMAIL_APP_PASSWORD is not set or is placeholder.');
    return;
  }

  return new Promise((resolve, reject) => {
    let resolved = false;
    let step = 0;
    let dataBuffer = '';

    const socket = tls.connect({ 
      port: 465, 
      host: 'smtp.gmail.com',
      servername: 'smtp.gmail.com'
    }, () => {});
    
    socket.setEncoding('utf-8');

    const cleanup = (success: boolean, error?: any) => {
      if (resolved) return;
      resolved = true;
      socket.end();
      if (success) resolve(true);
      else reject(error);
    };

    const sendLine = (line: string) => {
      if (socket.writable) socket.write(line + '\r\n');
    };

    socket.on('data', (data: string) => {
      dataBuffer += data;
      
      // Process only when we have complete lines
      while (dataBuffer.includes('\r\n')) {
        const lineEnd = dataBuffer.indexOf('\r\n');
        const line = dataBuffer.substring(0, lineEnd);
        dataBuffer = dataBuffer.substring(lineEnd + 2);

        // SMTP Multi-line status codes: 
        // "250-Something" means more lines coming.
        // "250 Something" (space at pos 3) means last line of this response.
        const isLastLine = line.length >= 4 && line[3] === ' ';
        
        if (line.startsWith('5') || line.startsWith('4')) {
          const errorMsg = `SMTP ${line}`;
          console.error(errorMsg);
          cleanup(false, new Error(errorMsg));
          return;
        }

        switch (step) {
          case 0: // Greeting
            if (line.startsWith('220')) {
              sendLine('EHLO localhost');
              step = 1;
            }
            break;
          case 1: // EHLO Status
            if (line.startsWith('250') && isLastLine) {
              sendLine('AUTH LOGIN');
              step = 2;
            }
            break;
          case 2: // Auth User Prompt
            if (line.startsWith('334')) {
              sendLine(Buffer.from(user).toString('base64'));
              step = 3;
            }
            break;
          case 3: // Auth Pass Prompt
            if (line.startsWith('334')) {
              sendLine(Buffer.from(pass).toString('base64'));
              step = 4;
            }
            break;
          case 4: // Auth Success
            if (line.startsWith('235')) {
              sendLine(`MAIL FROM:<${user}>`);
              step = 5;
            }
            break;
          case 5: // Mail From OK
            if (line.startsWith('250')) {
              sendLine(`RCPT TO:<${options.to}>`);
              step = options.bcc ? 6 : 7;
            }
            break;
          case 6: // RCPT TO OK (for BCC)
            if (line.startsWith('250')) {
              sendLine(`RCPT TO:<${options.bcc}>`);
              step = 7;
            }
            break;
          case 7: // RCPT TO OK, Start Data
            if (line.startsWith('250')) {
              sendLine('DATA');
              step = 8;
            }
            break;
          case 8: // Data Prompt
            if (line.startsWith('354')) {
              const escapedText = options.text
                .split('\r\n')
                .map(l => l.startsWith('.') ? '.' + l : l)
                .join('\r\n');

              const message = [
                `From: Proconix Governance <${user}>`,
                `To: ${options.to}`,
                `Subject: ${options.subject}`,
                `Content-Type: text/plain; charset="UTF-8"`,
                `Date: ${new Date().toUTCString()}`,
                '',
                escapedText,
                '.',
                ''
              ].join('\r\n');
              socket.write(message);
              step = 9;
            }
            break;
          case 9: // Data Sent OK
            if (line.startsWith('250')) {
              sendLine('QUIT');
              cleanup(true);
            }
            break;
        }
      }
    });

    socket.on('error', (err) => cleanup(false, err));
    setTimeout(() => cleanup(false, new Error('SMTP Timeout')), 15000);
  });
}





export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, country, sector, budget, type } = body;
    
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
      // We continue even if DB fails, to try and get notifications out, but log it
    }

    // 2. Notify Slack (High Reliability)
    try {
      await sendSlackNotification({
        type: displayType,
        name: name || 'Anonymous',
        email: email || 'N/A',
        country: country,
        sector: sector || budget,
        details: budget ? `Budget: ${budget}` : undefined,
        priority: displayType.includes('Call') || displayType.includes('Audit') ? 'high' : displayType.includes('WhatsApp') ? 'medium' : 'low'
      });
    } catch (slackError) {
      console.error('Slack Notification Error:', slackError);
    }

    // 3. Trigger email to Admin (Legacy/Secondary)
    try {
      let textContent = `New Form Submission:\nName: ${name}\nEmail: ${email}`;
      if (country) textContent += `\nCountry: ${country}`;
      if (sector) textContent += `\nSector: ${sector}`;
      if (budget) textContent += `\nBudget: ${budget}`;
      textContent += `\nType: ${displayType}`;

      await sendRawSmtpEmail({
        to: 'talibkhanjipmp@gmail.com',
        subject: `New Lead - ${displayType}`,
        text: textContent,
      });
    } catch (smtpError: any) {
      console.error('SMTP Email Error (Non-Fatal):', smtpError.message);
      // We don't fail the whole request if email fails, as long as Slack/DB worked
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

