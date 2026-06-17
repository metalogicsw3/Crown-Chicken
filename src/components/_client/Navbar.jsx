// src/components/_client/Navbar.jsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { logoutUser } from '@/lib/firebase/auth';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user, loading, openAuthModal } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        <Link href="/" className="text-xl font-bold flex items-center gap-2 whitespace-nowrap">
          🍗 Crown Chicken
        </Link>

        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3 whitespace-nowrap">
          {loading ? (
            <div className="w-24 h-9 bg-blue-800 rounded-lg animate-pulse" />
          ) : user ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}