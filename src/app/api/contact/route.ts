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
  const user = process.env.GMAIL_USER || 'info@proconixpmc.com';
  const pass = process.env.GMAIL_APP_PASSWORD || '';
  
  if (!pass) {
    throw new Error('GMAIL_APP_PASSWORD is not set in environment variables.');
  }

  return new Promise((resolve, reject) => {
    const socket = tls.connect({ port: 465, host: 'smtp.gmail.com' }, () => {});
    socket.setEncoding('utf-8');
    
    let step = 0;
    socket.on('data', (data: string) => {
      if (step === 0 && data.startsWith('220')) { socket.write('EHLO localhost\r\n'); step++; }
      else if (step === 1 && data.includes('250')) { socket.write('AUTH LOGIN\r\n'); step++; }
      else if (step === 2 && data.startsWith('334')) { socket.write(Buffer.from(user).toString('base64') + '\r\n'); step++; }
      else if (step === 3 && data.startsWith('334')) { socket.write(Buffer.from(pass).toString('base64') + '\r\n'); step++; }
      else if (step === 4 && data.startsWith('235')) { socket.write(`MAIL FROM:<${user}>\r\n`); step++; }
      
      // Send TO
      else if (step === 5 && data.startsWith('250')) { 
        socket.write(`RCPT TO:<${options.to}>\r\n`); 
        step = options.bcc ? 6 : 7; // If BCC exists, go to 6, else skip to DATA (7)
      }
      // Send BCC
      else if (step === 6 && data.startsWith('250')) {
        socket.write(`RCPT TO:<${options.bcc}>\r\n`);
        step++;
      }
      // Issue DATA
      else if (step === 7 && data.startsWith('250')) { socket.write('DATA\r\n'); step++; }
      // Write Payload
      else if (step === 8 && data.startsWith('354')) {
        const message = `To: ${options.to}\r\nSubject: ${options.subject}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${options.text}\r\n.\r\n`;
        socket.write(message);
        step++;
      }
      // Quit
      else if (step === 9 && data.startsWith('250')) { socket.write('QUIT\r\n'); resolve(true); }
      else if (data.startsWith('5')) { reject(new Error('SMTP Error: ' + data)); socket.end(); }
    });
    socket.on('error', (err) => reject(err));
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, country, sector, type } = body;
    
    // Determine type if not provided
    const displayType = type || (country ? 'Checklist Download' : 'Lead Capture');

    // Save to Firestore First
    try {
      await addDoc(collection(db, 'formSubmissions'), {
        name: name || '',
        email: email || '',
        country: country || 'Not provided',
        sector: sector || 'Not provided',
        createdAt: serverTimestamp(),
        type: displayType
      });
    } catch (dbError: any) {
      console.error("CRITICAL: Firestore Save Error:", dbError);
      // Return 500 if database save fails, so we know why
      return NextResponse.json({ 
        error: "Failed to save submission to database. Ensure Firebase rules allow writing to 'formSubmissions'.",
        debug: dbError.message 
      }, { status: 500 });
    }

    // Then trigger email to Admin
    let textContent = `New Form Submission:\nName: ${name}\nEmail: ${email}`;
    if (country) textContent += `\nCountry: ${country}`;
    if (sector) textContent += `\nSector: ${sector}`;

    await sendRawSmtpEmail({
      to: 'info@proconixpmc.com',
      bcc: 'talibkhanjipmp@gmail.com',
      subject: 'New Website Inquiry - Proconix',
      text: textContent,
    });

    // Notify Slack
    await sendSlackNotification({
      type: displayType,
      name: name || 'Anonymous',
      email: email || 'N/A',
      country: country,
      sector: sector,
      priority: displayType.includes('Call') || displayType.includes('Audit') ? 'high' : displayType.includes('WhatsApp') ? 'medium' : 'low'
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
