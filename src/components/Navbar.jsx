// src/components/Navbar.jsx
'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logoutUser } from "@/lib/auth";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold flex items-center gap-2 whitespace-nowrap"
          >
            <Image
              src="/favicon2.png"
              alt="Crown Chicken Logo"
              width={40}
              height={40}
              className="object-contain rounded-md"
            />
             Crown Chicken
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl">
            <SearchBar />
          </div>

          {/* Account / Logout Button */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            {authLoading ? (
              <div className="w-20 h-9 bg-blue-800 rounded-lg animate-pulse" />
            ) : user ? (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* Auth Modal OUTSIDE NAV (important) */}
      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}