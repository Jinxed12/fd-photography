import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const lookId = formData.get('look_id');
    const imageType = formData.get('image_type') || 'full-body';
    const caption = formData.get('caption') || '';

    if (!file || !lookId) {
      return NextResponse.json(
        { error: 'File and look_id required' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `fd-lookbook/${lookId}`,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    const image = {
      look_id: lookId,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      image_type: imageType,
      caption,
      sequence: 0,
      createdAt: new Date(),
    };
    const imageRef = await getAdminDb().collection('images').add(image);

    const lookRef = getAdminDb().collection('looks').doc(lookId);
    const lookSnapshot = await lookRef.get();
    if (lookSnapshot.exists) {
      const currentImages = Array.isArray(lookSnapshot.data().images)
        ? lookSnapshot.data().images
        : [];
      await lookRef.update({
        images: [...currentImages, { id: imageRef.id, ...image }],
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(
      {
        success: true,
        image: { id: imageRef.id, ...image },
        message: 'Image uploaded successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
