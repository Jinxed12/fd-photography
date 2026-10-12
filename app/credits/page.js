'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Credits() {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch('/api/credits');
        if (!response.ok) throw new Error('Failed to fetch credits');
        const data = await response.json();
        setCredits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const groupByRole = (credits) => {
    return credits.reduce((acc, credit) => {
      if (!acc[credit.role]) {
        acc[credit.role] = [];
      }
      acc[credit.role].push(credit);
      return acc;
    }, {});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading credits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const groupedCredits = groupByRole(credits);
  const roleLabels = {
    photographer: '📷 Photographers',
    designer: '👗 Designers',
    mua: '💄 Makeup Artists',
    model: '🎬 Models',
    stylist: '✨ Stylists'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Credits
        </h1>
        <p className="text-xl text-gray-600">
          Meet the talented team behind this portfolio
        </p>
      </div>

      {Object.entries(groupedCredits).length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No credits available yet.</p>
          <Link href="/" className="text-pink-600 hover:text-pink-700 mt-4 inline-block">
            ← Back to Gallery
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedCredits).map(([role, people]) => (
            <div key={role}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {roleLabels[role] || role}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {people.map((person) => (
                  <div key={person.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {person.name}
                    </h3>
                    
                    {person.bio && (
                      <p className="text-sm text-gray-600 mt-2">
                        {person.bio}
                      </p>
                    )}

                    <div className="mt-4 space-y-2">
                      {person.instagram_handle && (
                        <a
                          href={`https://instagram.com/${person.instagram_handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-pink-600 hover:text-pink-700"
                        >
                          📱 {person.instagram_handle}
                        </a>
                      )}
                      
                      {person.contact_email && (
                        <a
                          href={`mailto:${person.contact_email}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          ✉️ {person.contact_email}
                        </a>
                      )}
                      
                      {person.portfolio_url && (
                        <a
                          href={person.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          🌐 Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <Link href="/" className="text-pink-600 hover:text-pink-700">
          ← Back to Gallery
        </Link>
      </div>
    </div>
  );
}
