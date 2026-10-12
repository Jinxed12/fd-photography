'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LookDetail() {
  const params = useParams();
  const [look, setLook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLook = async () => {
      try {
        const response = await fetch(`/api/looks/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch look');
        const data = await response.json();
        setLook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLook();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !look) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error || 'Look not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-pink-600 hover:text-pink-700 mb-8 inline-block">
        ← Back to Gallery
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {look.title}
          </h1>
          
          {look.theme && (
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                {look.theme}
              </span>
            </div>
          )}

          {look.description && (
            <p className="text-lg text-gray-700 mb-8">
              {look.description}
            </p>
          )}
        </div>

        {look.cover_image_url && (
          <div className="h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={look.cover_image_url}
              alt={look.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {look.images && look.images.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {look.images.map((image) => (
              <div key={image.id} className="rounded-lg overflow-hidden">
                <div className="h-64 bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.caption || look.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {image.caption && (
                  <p className="mt-2 text-sm text-gray-600 p-2">{image.caption}</p>
                )}
                <p className="text-xs text-gray-500 px-2 pb-2">{image.image_type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
