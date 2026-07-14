"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPassword from "./ForgotPassword";
import { RxCross1 } from "react-icons/rx";

export default function AuthModal({ isOpen, onClose }) {
  const handleClose = () => {
    setView("login");
    onClose();
  };

  const [view, setView] = useState("login");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
        {/* Close Button */}
        <button onClick={handleClose} className="absolute right-4 top-4 text-2xl">
          <RxCross1
            size={24}
            className="text-gray-400 hover:text-red-500 transition cursor-pointer"
          />
        </button>

        {view === "login" && <LoginForm setView={setView} onClose={handleClose} />}

        {view === "signup" && (
          <SignupForm setView={setView} onClose={handleClose} />
        )}

        {view === "forgot" && <ForgotPassword setView={setView} />}
      </div>
    </div>
  );
}
