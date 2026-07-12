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
        await updateDoc(docRef, {
          linkClickedAt: new Date().toISOString(),
          linkClicks: currentClicks + 1,
        });
        console.log(`Track Click: doc=${id} slug=${slug} totalClicks=${currentClicks + 1}`);
      }
    } catch (e: any) {
      console.warn('Track Click: failed (non-fatal):', e.message);
    }
  }

  // 2. Locate and serve the PDF
  try {
    const filename = `${slug}.pdf`;
    let filePath = path.join(process.cwd(), 'public', 'assets', 'lead-magnets', filename);
    let outputFilename = filename;

    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'public', 'proconix-checklist.pdf');
      outputFilename = 'proconix-checklist.pdf';
    }
    
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new Response(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${outputFilename}"`,
        },
      });
    } else {
      // Fallback redirect if file is not found
      return NextResponse.redirect(new URL('/proconix-checklist.pdf', req.url));
    }
  } catch (error: any) {
    console.error('Download serve error:', error.message);
    return NextResponse.json({ error: 'Failed to download file.' }, { status: 500 });
  }
}
