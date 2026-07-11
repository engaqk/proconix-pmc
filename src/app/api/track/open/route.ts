import { db } from '../../../../lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// 1x1 transparent GIF
const PIXEL_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const day = parseInt(searchParams.get('day') || '0');

  // Return pixel immediately — tracking is best-effort, non-blocking
  const pixel = new Response(PIXEL_GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-cache, no-store, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });

  if (id && day > 0) {
    try {
      const docRef = doc(db, 'leadSubmissions', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const opens: any[] = snap.data().emailOpens || [];
        // Only record first open per day
        if (!opens.find((o: any) => o.day === day)) {
          await updateDoc(docRef, {
            emailOpens: arrayUnion({ day, openedAt: new Date().toISOString() }),
          });
          console.log(`Track Open: doc=${id} day=${day}`);
        }
      }
    } catch (e: any) {
      console.warn('Track Open: failed (non-fatal):', e.message);
    }
  }

  return pixel;
}
