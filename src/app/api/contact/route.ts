import { NextResponse } from 'next/server';
import tls from 'tls';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { sendSlackNotification } from '../../../lib/slack';

// Minimal Raw SMTP Client using Node TLS 
async function sendRawSmtpEmail(options: { 
  to: string;
  bcc?: string;
  subject: string; 
  text: string; 
}) {
  const user = process.env.GMAIL_USER || 'talibkhanjipmp@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD || '';
  
  if (!pass) {
    console.error('SMTP ERROR: GMAIL_APP_PASSWORD is not set.');
    return;
  }

  return new Promise((resolve, reject) => {
    let resolved = false;
    const socket = tls.connect({ 
      port: 465, 
      host: 'smtp.gmail.com',
      servername: 'smtp.gmail.com' // Explicit servername for SNI
    }, () => {});
    
    socket.setEncoding('utf-8');
    
    let step = 0;
    let buffer = '';

    const cleanup = (success: boolean, error?: any) => {
      if (resolved) return;
      resolved = true;
      socket.end();
      if (success) resolve(true);
      else reject(error);
    };

    socket.on('data', (data: string) => {
      buffer += data;
      if (!buffer.endsWith('\r\n')) return;
      
      const response = buffer;
      buffer = '';

      try {
        if (step === 0 && response.startsWith('220')) {
          socket.write('EHLO localhost\r\n');
          step++;
        } 
        else if (step === 1 && response.includes('250 ')) {
          socket.write('AUTH LOGIN\r\n');
          step++;
        }
        else if (step === 2 && response.startsWith('334')) {
          socket.write(Buffer.from(user).toString('base64') + '\r\n');
          step++;
        }
        else if (step === 3 && response.startsWith('334')) {
          socket.write(Buffer.from(pass).toString('base64') + '\r\n');
          step++;
        }
        else if (step === 4 && response.startsWith('235')) {
          socket.write(`MAIL FROM:<${user}>\r\n`);
          step++;
        }
        else if (step === 5 && response.startsWith('250')) {
          socket.write(`RCPT TO:<${options.to}>\r\n`);
          step = options.bcc ? 6 : 7;
        }
        else if (step === 6 && response.startsWith('250')) {
          socket.write(`RCPT TO:<${options.bcc}>\r\n`);
          step++;
        }
        else if (step === 7 && response.startsWith('250')) {
          socket.write('DATA\r\n');
          step++;
        }
        else if (step === 8 && response.startsWith('354')) {
          // Dot-stuffing: If any line starts with a dot, prefix it with another dot
          const escapedText = options.text
            .split('\r\n')
            .map(line => line.startsWith('.') ? '.' + line : line)
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
          step++;
        }
        else if (step === 9 && response.startsWith('250')) {
          socket.write('QUIT\r\n');
          cleanup(true);
        }
        
        if (response.startsWith('5') || response.startsWith('4')) {
          const errorMsg = response.trim();
          console.error('SMTP Transmission Error:', errorMsg);
          cleanup(false, new Error('SMTP Error: ' + errorMsg));
        }
      } catch (err) {
        cleanup(false, err);
      }
    });

    socket.on('error', (err) => {
      console.error('SMTP Connection Error:', err.message);
      cleanup(false, err);
    });
    
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

