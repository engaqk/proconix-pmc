import { NextResponse } from 'next/server';
import tls from 'tls';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

// Minimal Raw SMTP Client using Node TLS 
async function sendRawSmtpEmail(options: { 
  to: string; 
  subject: string; 
  text: string; 
}) {
  const user = process.env.GMAIL_USER || 'talibkhanjipmp@gmail.com';
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
      else if (step === 5 && data.startsWith('250')) { socket.write(`RCPT TO:<${options.to}>\r\n`); step++; }
      else if (step === 6 && data.startsWith('250')) { socket.write('DATA\r\n'); step++; }
      else if (step === 7 && data.startsWith('354')) {
        const message = `To: ${options.to}\r\nSubject: ${options.subject}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${options.text}\r\n.\r\n`;
        socket.write(message);
        step++;
      }
      else if (step === 8 && data.startsWith('250')) { socket.write('QUIT\r\n'); resolve(true); }
      else if (data.startsWith('5')) { reject(new Error('SMTP Error: ' + data)); socket.end(); }
    });
    socket.on('error', (err) => reject(err));
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, country, sector } = body;

    // Save to Firestore First
    await addDoc(collection(db, 'formSubmissions'), {
      name: name || '',
      email: email || '',
      country: country || 'Not provided',
      sector: sector || 'Not provided',
      createdAt: serverTimestamp(),
      type: country ? 'Lead Form Form' : 'Capture Form'
    }).catch(e => console.error("Firestore Save Error:", e));

    // Then trigger email to Admin
    let textContent = `New Form Submission:\nName: ${name}\nEmail: ${email}`;
    if (country) textContent += `\nCountry: ${country}`;
    if (sector) textContent += `\nSector: ${sector}`;

    await sendRawSmtpEmail({
      to: 'talibkhanjipmp@gmail.com',
      subject: 'New Website Inquiry - Proconix',
      text: textContent,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
