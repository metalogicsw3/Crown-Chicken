"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPassword from "./ForgotPassword";

export default function AuthModal({ isOpen, onClose }) {
    const [view, setView] = useState("login");
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-2xl">
                    ×
                </button>

                {view === "login" && (
                    <LoginForm
                        setView={setView}
                        onClose={onClose} />)}

                {view === "signup" && (
                    <SignupForm
                        setView={setView}
                        onClose={onClose} />)}

                {view === "forgot" && (
                    <ForgotPassword
                        setView={setView} />)}
            </div>
        </div>
    );
}
