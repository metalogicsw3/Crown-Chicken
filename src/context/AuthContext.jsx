// src/context/AuthContext.jsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🆕 Modal control
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = (view = 'login') => {
    setAuthView(view);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => setShowAuthModal(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        showAuthModal,
        authView,
        openAuthModal,
        closeAuthModal,
        setAuthView,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);