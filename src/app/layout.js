// src/app/layout.js
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/_client/Navbar';
import AuthModal from '@/components/_client/auth/AuthModal';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <AuthModal /> {/* 🆕 Modal yahan render hoga, jab bhi trigger ho */}
        </AuthProvider>
      </body>
    </html>
  );
}