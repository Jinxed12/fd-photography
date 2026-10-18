'use client';

import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

function getLoginErrorMessage(error) {
  switch (error.code) {
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not configured for this project. Please contact support.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    default:
      return 'Unable to log in. Please try again.';
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    !auth ? 'Account services are not configured for this environment.' : ''
  );
  const [created, setCreated] = useState(false);

  useEffect(() => {
    setCreated(new URLSearchParams(window.location.search).get('created') === '1');
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!auth) {
      setError('Account services are not configured for this environment.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      router.push('/');
    } catch (loginError) {
      console.error('Login error:', loginError);
      setError(getLoginErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 px-4 py-16">
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-xl shadow-pink-100/50">
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">FD Lookbook</p>
        <h1 className="text-center text-3xl font-bold text-gray-900">Welcome back</h1>
        {created && <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">Account created. You can log in now.</div>}
        {error && <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-pink-600 px-4 py-3 font-semibold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">Need an account? <Link href="/signup" className="font-semibold text-pink-600 hover:text-pink-700">Sign up</Link></p>
      </div>
    </div>
  );
}