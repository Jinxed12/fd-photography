'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, serverTimestamp, setDoc, addDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';

function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is not configured for this project. Please contact support.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/weak-password':
      return 'Choose a stronger password with at least 6 characters.';
    default:
      return 'Unable to create your account. Please try again.';
  }
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(
    !auth || !db ? 'Account services are not configured for this environment.' : ''
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name || !email || !formData.password || !formData.confirmPassword) {
      setError('Complete all fields to create your account.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!auth || !db) {
      setError('Account services are not configured for this environment.');
      return;
    }

    setLoading(true);

    let user;
    try {
      ({ user } = await createUserWithEmailAndPassword(auth, email, formData.password));
    } catch (authError) {
      console.error('Unable to create Firebase account:', authError);
      setError(getAuthErrorMessage(authError));
      setLoading(false);
      return;
    }

    setAccountCreated(true);
    try {
      const userData = {
        uid: user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
        role: 'user',
        status: 'active',
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      await addDoc(collection(db, 'signups'), {
        uid: user.uid,
        name,
        email,
        signupTime: serverTimestamp(),
      });
    } catch (profileError) {
      console.error('Account created, but profile data could not be saved:', profileError);
      setSuccess('Your account was created, but we could not save all profile details. You are signed in and can continue to the portfolio.');
      setLoading(false);
      return;
    }

    try {
      await signOut(auth);
      router.push('/login?created=1');
    } catch (signOutError) {
      console.error('Account created, but sign-out failed:', signOutError);
      setSuccess('Your account and profile were created, but we could not sign you out. Continue to the portfolio while signed in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 px-4 py-16">
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-xl shadow-pink-100/50">
        <p className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">FD Lookbook</p>
        <h1 className="text-center text-3xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-2 text-center text-sm text-gray-600">Save your place in the lookbook community.</p>

        {error && <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {success && <div role="status" className="mt-6 rounded-lg border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-800">{success}<Link href="/" className="mt-3 block font-semibold underline">Continue to the portfolio</Link></div>}

        {!accountCreated && <form onSubmit={handleSignup} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">Full name</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} autoComplete="name" required disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} autoComplete="email" required disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} autoComplete="new-password" minLength="6" required disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">Confirm password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" minLength="6" required disabled={loading} className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-pink-600 px-4 py-3 font-semibold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>}

        <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="font-semibold text-pink-600 hover:text-pink-700">Log in</Link></p>
      </div>
    </div>
  );
}