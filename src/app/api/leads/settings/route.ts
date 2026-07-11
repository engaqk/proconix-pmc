import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, limit, serverTimestamp } from 'firebase/firestore';

const SECRET = 'admin53';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { dripEnabled, dripHour, slackEnabled } = body;

    // Use a fixed doc ID so it's always one settings document
    await setDoc(doc(db, 'leadSettings', 'global'), {
      key: 'global',
      dripEnabled: dripEnabled ?? true,
      dripHour: dripHour ?? -1,
      slackEnabled: slackEnabled ?? false,
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snap = await getDocs(
      query(collection(db, 'leadSettings'), where('key', '==', 'global'), limit(1))
    );

    if (snap.empty) {
      return NextResponse.json({ dripEnabled: true, dripHour: -1, slackEnabled: false });
    }

    const data = snap.docs[0].data();
    return NextResponse.json({
      dripEnabled: data.dripEnabled ?? true,
      dripHour: data.dripHour ?? -1,
      slackEnabled: data.slackEnabled ?? false,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
