import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await getAdminDb().collection('credits').get();
    const credits = snapshot.docs.map((doc) => {
      const { contact_email: _contactEmail, ...publicData } = doc.data();
      return { id: doc.id, ...publicData };
    });

    return NextResponse.json(credits, { status: 200 });
  } catch (error) {
    console.error('Firebase error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { role, name, instagram_handle, contact_email, portfolio_url, bio } = await request.json();

    if (!role || !name) {
      return NextResponse.json(
        { error: 'Role and name are required' },
        { status: 400 }
      );
    }

    const credit = Object.fromEntries(Object.entries({
      role,
      name,
      instagram_handle,
      contact_email,
      portfolio_url,
      bio,
      image: '',
      createdAt: new Date(),
    }).filter(([, value]) => value !== undefined));
    const docRef = await getAdminDb().collection('credits').add(credit);

    return NextResponse.json({ id: docRef.id, ...credit }, { status: 201 });
  } catch (error) {
    console.error('Firebase error:', error);
    return NextResponse.json(
      { error: 'Failed to create credit' },
      { status: 500 }
    );
  }
}
