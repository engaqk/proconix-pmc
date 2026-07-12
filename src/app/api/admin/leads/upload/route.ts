import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const AUTH = "Bearer admin53";

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const dirPath = path.join(process.cwd(), 'public', 'assets', 'lead-magnets');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, `${slug}.pdf`);
    fs.writeFileSync(filePath, buffer);

    console.log(`Admin Upload: Saved PDF for slug=${slug} at ${filePath}`);
    return NextResponse.json({ success: true, path: `/assets/lead-magnets/${slug}.pdf` });
  } catch (error: any) {
    console.error('Admin PDF Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
