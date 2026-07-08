// src/components/Navbar.jsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { logoutUser } from "@/lib/auth";
import SearchBar from "./SearchBar";
import AuthModal from "./AuthModal";
import { toast } from "react-hot-toast";
import { showToast } from "@/lib/toast";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { userOpen, setUserOpen } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Dropdown Ref
  const dropdownRef = useRef(null);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setUserOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setUserOpen]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      const toastId = showToast.loading("Logging out...");

      await logoutUser();

      toast.dismiss(toastId);
      showToast.success("Logged out successfully! 👋");
    } catch (err) {
      console.error("Logout error:", err);

      showToast.error(
        `Logout failed: ${err.message || "Please try again"}`
      );
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

          {/* Account */}
          <div className="flex items-center gap-3 whitespace-nowrap">
            {authLoading ? (
              <div className="w-20 h-9 bg-blue-800 rounded-lg animate-pulse" />
            ) : user ? (
              <div
                ref={dropdownRef}
                className="relative flex items-center gap-2"
              >
                {/* User Button */}
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    User
                    <span>
                      {userOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute top-full right-0 mt-3 w-44 origin-top bg-white rounded-lg border shadow-lg z-50 transition-all duration-900 ease-in-out
                    ${
                      userOpen
                        ? "opacity-100 scale-y-100 visible"
                        : "opacity-0 scale-y-95 invisible pointer-events-none"
                    }
                  `}
                >
                  <button className="block w-full rounded-lg text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </button>

                  <button className="block w-full rounded-lg text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Order list
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="bg-white text-blue-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
              </div>
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

      <AuthModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}