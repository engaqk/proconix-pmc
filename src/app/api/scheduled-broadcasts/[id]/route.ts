import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== 'Bearer admin53') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { subject, message, scheduledAt } = body;

    const ref = doc(db, 'scheduledBroadcasts', id);
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (existing.data().status !== 'pending') {
      return NextResponse.json({ error: 'Only pending broadcasts can be edited' }, { status: 400 });
    }

    const updates: any = { updatedAt: new Date().toISOString() };
    if (subject) updates.subject = subject;
    if (message) updates.message = message;
    if (scheduledAt) updates.scheduledAt = new Date(scheduledAt).toISOString();

    await updateDoc(ref, updates);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== 'Bearer admin53') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteDoc(doc(db, 'scheduledBroadcasts', id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
