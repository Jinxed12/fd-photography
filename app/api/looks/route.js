import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const snapshot = await getAdminDb().collection('looks').get();
    const looks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(looks, { status: 200 });
  } catch (error) {
    console.error('Firebase error:', error);
    if (
      error instanceof Error
      && error.message.startsWith('Firebase Admin credentials are missing.')
    ) {
      return NextResponse.json([]);
    }
    return NextResponse.json(
      { error: 'Failed to fetch looks' },
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

    const { title, theme, description, cover_image_url, images } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const look = Object.fromEntries(Object.entries({
      title,
      theme,
      description,
      cover_image_url: cover_image_url || '',
      images: Array.isArray(images) ? images : [],
      createdAt: new Date(),
    }).filter(([, value]) => value !== undefined));
    const docRef = await getAdminDb().collection('looks').add(look);

    return NextResponse.json({ id: docRef.id, ...look }, { status: 201 });
  } catch (error) {
    console.error('Firebase error:', error);
    return NextResponse.json(
      { error: 'Failed to create look' },
      { status: 500 }
    );
  }
}
