// src/components/_client/auth/LoginForm.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/lib/firebase/auth';

export default function LoginForm() {
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
      await loginUser(email, password);
      closeAuthModal(); // Login hote hi modal band ho jaye
    } catch (err) {
      setError('Write correct email & password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-800">Login</h2>
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
          name="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="new-email"
          className="w-full px-4 py-2.5 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full px-4 py-2.5 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={() => setAuthView('signup')}
        className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Create Account
      </button>

      <button
        type="button"
        className="w-full text-sm text-gray-500 hover:underline text-center"
      >
        Forgot your password? Click here to reset
      </button>
    </form>
  );
}