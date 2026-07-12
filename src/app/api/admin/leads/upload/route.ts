import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const AUTH = "Bearer admin53";
const MAX_SIZE_BYTES = 900 * 1024; // 900KB limit (Firestore doc is 1MB max)

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== AUTH) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const slug = formData.get('slug') as string | null;

    if (!file || !slug) {
      return NextResponse.json({ error: 'File and slug are required.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: `PDF too large (${Math.round(file.size/1024)}KB). Max is 900KB.` }, { status: 400 });
    }

    // Convert to base64 and store in Firestore (free, works on Vercel)
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    await setDoc(doc(db, 'leadPdfs', slug), {
      slug,
      filename: file.name,
      base64,
      sizeBytes: file.size,
      uploadedAt: serverTimestamp(),
    });

    console.log(`Admin Upload: Stored PDF for slug=${slug} in Firestore (${Math.round(file.size/1024)}KB)`);
    return NextResponse.json({ success: true, sizeKb: Math.round(file.size / 1024) });
  } catch (error: any) {
    console.error('Admin PDF Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
