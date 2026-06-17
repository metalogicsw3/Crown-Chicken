// src/components/_client/checkout/CreateAccountPrompt.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signupUser } from '@/lib/firebase/auth';

export default function CreateAccountPrompt({ email, name }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signupUser(email, password);
      router.push('/');
    } catch (err) {
      setError('Account banane mein error aaya. Email already registered ho sakta hai.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/'); // Account nahi banana — seedha home
  };

  return (
    <div className="text-center max-w-md">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Order Confirmed!</h2>
      <p className="text-gray-500 mb-6">
        {name}, kya aap account banana chahte hain agli baar fast order ke liye?
      </p>

      <form onSubmit={handleCreateAccount} className="space-y-4 text-left">
        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Set Karo
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Min 6 characters"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Creating...' : 'Yes, Account Banao'}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="w-full border border-gray-300 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Nahi, Skip Karo
        </button>
      </form>
    </div>
  );
}