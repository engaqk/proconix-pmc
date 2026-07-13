import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const slug = searchParams.get('slug') || 'pre-construction-checklist';

  // 1. Log click event in Firestore
  if (id) {
    try {
      const docRef = doc(db, 'leadSubmissions', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const currentClicks = snap.data().linkClicks || 0;
        const currentHistory = snap.data().linkClickHistory || [];
        const nowISO = new Date().toISOString();
        await updateDoc(docRef, {
          linkClickedAt: nowISO,
          linkClicks: currentClicks + 1,
          linkClickHistory: [...currentHistory, nowISO]
        });
      }
    } catch (e: any) {
      console.warn('Track Click: failed (non-fatal):', e.message);
    }
  }

  // 2. Try Firestore base64 first (uploaded via admin panel)
  try {
    const pdfSnap = await getDoc(doc(db, 'leadPdfs', slug));
    if (pdfSnap.exists()) {
      const data = pdfSnap.data();
      const buffer = Buffer.from(data.base64, 'base64');
      const filename = data.filename || `${slug}.pdf`;
      console.log(`Download: Serving ${slug} from Firestore (${Math.round(buffer.length/1024)}KB)`);
      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (e: any) {
    console.warn('Firestore PDF fetch failed (non-fatal):', e.message);
  }

  // 3. Fall back to local static file (committed to repo)
  try {
    const filename = `${slug}.pdf`;
    let filePath = path.join(process.cwd(), 'public', 'assets', 'lead-magnets', filename);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', 'proconix-checklist.pdf');
    }

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      console.log(`Download: Serving ${slug} from local file`);
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${slug}.pdf"`,
        },
      });
    }
  } catch (e: any) {
    console.warn('Local file fallback failed:', e.message);
  }

  return NextResponse.json({ error: 'PDF not found. Please upload it in the admin panel.' }, { status: 404 });
}
