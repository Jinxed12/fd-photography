import QRCode from 'qrcode';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const directSnapshot = await getAdminDb().collection('exhibition').doc(slug).get();
    let exhibitionSnapshot = directSnapshot;

    if (!exhibitionSnapshot.exists) {
      const querySnapshot = await getAdminDb()
        .collection('exhibition')
        .where('qr_slug', '==', slug)
        .limit(1)
        .get();
      exhibitionSnapshot = querySnapshot.docs[0] || null;
    }

    if (!exhibitionSnapshot || !exhibitionSnapshot.exists) {
      return NextResponse.json(
        { error: 'Exhibition not found' },
        { status: 404 }
      );
    }

    const exhibition = exhibitionSnapshot.data();

    // Generate QR code URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const qrUrl = `${siteUrl}/exhibition/${slug}`;

    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    await exhibitionSnapshot.ref.update({
      view_count: (exhibition.view_count || 0) + 1,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        qrCode: qrCode,
        url: qrUrl,
        exhibition: {
          name: exhibition.name || exhibition.exhibition_name || '',
          venue: exhibition.venue || exhibition.exhibition_venue || '',
          date: exhibition.date || exhibition.launch_date || ''
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('QR code error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
