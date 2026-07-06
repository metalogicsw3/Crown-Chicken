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
import { toast } from 'react-hot-toast'; // ✅ Added
import { showToast } from "@/lib/toast"; // ✅ Added

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false); // ✅ Added

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      
      // ✅ Show loading toast
      const toastId = showToast.loading("Logging out...");
      
      await logoutUser();
      
      // ✅ Dismiss loading and show success
      toast.dismiss(toastId);
      showToast.success("Logged out successfully! 👋");
      
    } catch (err) {
      console.error("Logout error:", err);
      
      // ✅ Show error toast
      showToast.error(`Logout failed: ${err.message || "Please try again"}`);
      
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="min-w-auto w-auto mx-auto px-2 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold flex items-center gap-1 whitespace-nowrap"
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
                disabled={logoutLoading} // ✅ Added disabled
                className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logoutLoading ? "Logging out..." : "Logout"} {/* ✅ Changed text */}
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