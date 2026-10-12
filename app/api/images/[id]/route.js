import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getPublicIdFromUrl(url) {
  if (!url) return null;

  try {
    const trimmed = url.split('/upload/')[1];
    if (!trimmed) return null;

    const withoutVersion = trimmed.replace(/^v\d+\//, '');
    const withoutExtension = withoutVersion.replace(/\.[^/.]+$/, '');
    return withoutExtension;
  } catch {
    return null;
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = requireAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = params;
    const db = getAdminDb();
    const imageRef = db.collection('images').doc(id);
    const imageSnapshot = await imageRef.get();

    if (!imageSnapshot.exists) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const imageData = imageSnapshot.data();
    const lookId = imageData.look_id;
    const publicId = imageData.public_id || imageData.cloudinary_public_id || getPublicIdFromUrl(imageData.url);

    if (lookId) {
      const lookRef = db.collection('looks').doc(lookId);
      const lookSnapshot = await lookRef.get();

      if (lookSnapshot.exists) {
        const lookData = lookSnapshot.data();
        const currentImages = Array.isArray(lookData.images) ? lookData.images : [];
        const updatedImages = currentImages.filter((image) => {
          const imageId = image?.id || image?.image_id;
          return imageId !== id && image?.url !== imageData.url;
        });

        const updates = {
          images: updatedImages,
          updatedAt: new Date(),
        };

        if ((lookData.cover_image_url || '') === (imageData.url || '')) {
          updates.cover_image_url = updatedImages[0]?.url || '';
        }

        await lookRef.update(updates);
      }
    }

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { invalidate: true });
      } catch (cloudinaryError) {
        console.error('Failed to remove Cloudinary asset:', cloudinaryError);
      }
    }

    await imageRef.delete();

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}
