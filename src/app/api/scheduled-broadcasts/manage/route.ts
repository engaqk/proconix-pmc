import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Handles both PATCH (edit) and DELETE via POST with { action, id, ...fields }
// This avoids dynamic [id] segments which are incompatible with output: export
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== 'Bearer admin53') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, id, subject, message, scheduledAt } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing broadcast id' }, { status: 400 });
    }

    const ref = doc(db, 'scheduledBroadcasts', id);

    if (action === 'delete') {
      await deleteDoc(ref);
      return NextResponse.json({ success: true });
    }

    if (action === 'update') {
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
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
