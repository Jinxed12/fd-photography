import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const doc = await getAdminDb().collection('looks').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Look not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
  } catch (error) {
    console.error('Firebase error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch look' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = requireAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    const updateData = await request.json();
    const allowedFields = ['title', 'theme', 'description', 'cover_image_url', 'images'];
    const updates = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date();
    const docRef = getAdminDb().collection('looks').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json(
        { error: 'Look not found' },
        { status: 404 }
      );
    }

    await docRef.update(updates);
    return NextResponse.json({ id, ...existing.data(), ...updates }, { status: 200 });
  } catch (error) {
    console.error('Firebase error:', error);
    return NextResponse.json(
      { error: 'Failed to update look' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = requireAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;

    const docRef = getAdminDb().collection('looks').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      return NextResponse.json(
        { error: 'Look not found' },
        { status: 404 }
      );
    }

    await docRef.delete();
    return NextResponse.json({ message: 'Look deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Firebase error:', error);
    return NextResponse.json(
      { error: 'Failed to delete look' },
      { status: 500 }
    );
  }
}
