import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const db = getAdminDb();
    const [usersSnapshot, signupsSnapshot, looksSnapshot] = await Promise.all([
      db.collection('users').get(),
      db.collection('signups').get(),
      db.collection('looks').get(),
    ]);

    return NextResponse.json({
      users: usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      signups: signupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      looks: looksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    });
  } catch (error) {
    console.error('Admin data error:', error);
    return NextResponse.json({ error: 'Unable to load admin data' }, { status: 500 });
  }
}