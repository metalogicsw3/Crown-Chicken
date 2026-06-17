// src/components/_client/auth/SignupForm.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signupUser } from '@/lib/firebase/auth';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { closeAuthModal, setAuthView } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signupUser(email, password);
      closeAuthModal(); // Account banne ke baad modal band
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ye email already registered hai!');
      } else if (err.code === 'auth/weak-password') {
        setError('Password kam se kam 6 characters ka ho!');
      } else {
        setError('Kuch error aaya, dobara try karo!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-800">Create Account</h2>
      </div>

      {error && (
        <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
          type="email"
          name="signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="new-email"
          className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full px-4 py-2.5 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>

      <button
        type="button"
        onClick={() => setAuthView('login')}
        className="w-full text-sm text-gray-600 hover:underline text-center mt-2"
      >
        Already have an account? Login
      </button>
    </form>
  );
}