// src/components/_client/auth/AuthModal.jsx
'use client';

import { useAuth } from '@/context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthModal() {
  const { showAuthModal, authView, closeAuthModal } = useAuth();

  if (!showAuthModal) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4"
      onClick={closeAuthModal} // Bahar click karne se band ho jaye
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()} // Box ke andar click se band na ho
      >
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {authView === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}