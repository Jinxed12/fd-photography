'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [looks, setLooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [signups, setSignups] = useState([]);
  const [selectedLook, setSelectedLook] = useState(null);
  const [newLookTitle, setNewLookTitle] = useState('');
  const [newLookTheme, setNewLookTheme] = useState('');
  const [newLookDescription, setNewLookDescription] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!response.ok) throw new Error('Invalid password');

      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setPassword('');
      
      // Fetch looks after login
      fetchLooks(data.token);
      fetchAdminData(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch looks
  const fetchLooks = async (authToken) => {
    try {
      const response = await fetch('/api/looks');
      if (!response.ok) throw new Error('Failed to fetch looks');
      const data = await response.json();
      setLooks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAdminData = async (authToken) => {
    try {
      const response = await fetch('/api/admin/data', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!response.ok) throw new Error('Failed to fetch admin data');
      const data = await response.json();
      setUsers(data.users || []);
      setSignups(data.signups || []);
      setLooks(data.looks || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Create new look
  const handleCreateLook = async (e) => {
    e.preventDefault();
    if (!newLookTitle) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/looks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newLookTitle,
          theme: newLookTheme,
          description: newLookDescription
        })
      });

      if (!response.ok) throw new Error('Failed to create look');

      const newLook = await response.json();
      setLooks([...looks, newLook]);
      setNewLookTitle('');
      setNewLookTheme('');
      setNewLookDescription('');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedLook) return;

    setUploadingImage(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('look_id', selectedLook.id);
      formData.append('image_type', 'full-body');

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const uploadedImage = await response.json();
      
      // Update selected look with new image
      const updatedLook = {
        ...selectedLook,
        images: [...(selectedLook.images || []), uploadedImage.image]
      };
      setSelectedLook(updatedLook);
      
      // Update looks list
      const updatedLooks = looks.map(l => l.id === selectedLook.id ? updatedLook : l);
      setLooks(updatedLooks);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove an uploaded image from a look
  const handleDeleteImage = async (image) => {
    if (!selectedLook || !image) return;

    const confirmed = window.confirm('Remove this image from the look?');
    if (!confirmed) return;

    setError(null);

    try {
      const response = await fetch(`/api/images/${image.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to remove image');
      }

      const updatedImages = (selectedLook.images || []).filter((img) => img.id !== image.id);
      const updatedLook = {
        ...selectedLook,
        images: updatedImages,
        cover_image_url: updatedImages.length > 0 ? updatedImages[0].url : ''
      };

      setSelectedLook(updatedLook);
      setLooks((currentLooks) =>
        currentLooks.map((look) =>
          look.id === selectedLook.id ? updatedLook : look
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    setToken(null);
    setPassword('');
    setLooks([]);
    setUsers([]);
    setSignups([]);
    setSelectedLook(null);
    localStorage.removeItem('token');
  };

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchLooks(storedToken);
      fetchAdminData(storedToken);
    }
  }, []);

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Login</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter admin password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-pink-600 hover:text-pink-700">
              ← Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Look Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Look</h2>
            
            <form onSubmit={handleCreateLook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newLookTitle}
                  onChange={(e) => setNewLookTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Look title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <input
                  type="text"
                  value={newLookTheme}
                  onChange={(e) => setNewLookTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g. Modern, Classic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newLookDescription}
                  onChange={(e) => setNewLookDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Description"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 text-sm font-medium"
              >
                {loading ? 'Creating...' : 'Create Look'}
              </button>
            </form>
          </div>
        </div>

        {/* Looks List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Looks</h2>

            {looks.length === 0 ? (
              <p className="text-gray-500">No looks yet. Create one to get started!</p>
            ) : (
              <div className="space-y-4">
                {looks.map((look) => (
                  <div
                    key={look.id}
                    onClick={() => setSelectedLook(look)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLook?.id === look.id
                        ? 'bg-pink-50 border-pink-300'
                        : 'bg-white border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{look.title}</h3>
                    <p className="text-sm text-gray-600">{look.theme}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {look.images?.length || 0} images
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedLook && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Upload Image to "{selectedLook.title}"
                </h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <label className="cursor-pointer">
                    <span className="text-pink-600 hover:text-pink-700 font-medium">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG up to 10MB</p>
                </div>

                {uploadingImage && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}

                {selectedLook.images && selectedLook.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Images:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedLook.images.map((img) => (
                        <div key={img.id} className="relative h-20 bg-gray-100 rounded overflow-hidden group">
                          <img
                            src={img.url}
                            alt="uploaded"
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(img);
                            }}
                            className="absolute top-1 right-1 rounded-full bg-red-600 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Registered Users</h2>
            <span className="text-sm text-gray-500">{users.length} total</span>
          </div>
          {users.length === 0 ? (
            <p className="text-gray-500">No user data available yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-3 pr-4 font-medium text-gray-900">{user.name || 'Unnamed'}</td>
                      <td className="py-3 text-gray-600">{user.email || 'No email'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Projects / Looks</h2>
            <span className="text-sm text-gray-500">{looks.length} total</span>
          </div>
          {looks.length === 0 ? (
            <p className="text-gray-500">No project data available yet.</p>
          ) : (
            <div className="space-y-3">
              {looks.map((look) => (
                <div key={look.id} className="rounded-lg border border-gray-200 p-3">
                  <p className="font-medium text-gray-900">{look.title || 'Untitled project'}</p>
                  <p className="text-sm text-gray-600">{look.theme || 'No theme specified'}</p>
                </div>
              ))}
            </div>
          )}
          {signups.length > 0 && (
            <p className="mt-4 text-xs text-gray-500">{signups.length} signup records</p>
          )}
        </div>
      </div>
    </div>
  );
}
