"use client";

import { useState, useRef } from "react"; // ✅ Added useRef
import { signupUser } from "@/lib/auth";
import { toast } from 'react-hot-toast'; // ✅ Added
import { showToast } from "@/lib/toast"; // ✅ Added
import { CgArrowLeft } from "react-icons/cg";

export default function SignupForm({ setView, onClose }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toastId = useRef(null); // ✅ Added

    const handleSignup = async (e) => {
        e.preventDefault();

        // ✅ Validation
        if (!name || !email || !password) {
            showToast.error("Please fill in all fields");
            return;
        }

        if (name.length < 2) {
            showToast.error("Name must be at least 2 characters");
            return;
        }

        if (password.length < 6) {
            showToast.error("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            
            // ✅ Show loading toast
            toastId.current = showToast.loading("Creating your account...");

            await signupUser(name, email, password);
            
            // ✅ Dismiss loading and show success
            toast.dismiss(toastId.current);
            showToast.success("Account created successfully! 🎉");
            
            // Reset form
            setName("");
            setEmail("");
            setPassword("");
            
            onClose();
            
        } catch (error) {
            console.error("Signup error:", error);
            
            // ✅ Dismiss loading toast
            toast.dismiss(toastId.current);

            // ✅ Error handling with toasts
            if (error.code === "auth/email-already-in-use") {
                showToast.error("An account with this email already exists.");
            } else if (error.code === "auth/weak-password") {
                showToast.error("Password must be at least 6 characters.");
            } else if (error.code === "auth/invalid-email") {
                showToast.error("Please enter a valid email address.");
            } else if (error.code === "auth/too-many-requests") {
                showToast.error("Too many attempts. Try again later.");
            } else if (error.code === "auth/network-request-failed") {
                showToast.error("Network error. Please check your connection.");
            } else {
                showToast.error(`Signup failed: ${error.message || "Please try again"}`);
            }
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignup} autoComplete="off">
            <h2 className="text-3xl font-bold mb-6">
                Create Account
            </h2>

            <div className="flex flex-col gap-5"> 
            <input
                type="text"
                placeholder="Name"
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 px-5 focus:border-blue-500 focus:outline-none focus:ring-0"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
            />

            <input
                type="email"
                placeholder="Email"
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 px-5 focus:border-blue-500 focus:outline-none focus:ring-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="new-email"
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 px-5 focus:border-blue-500 focus:outline-none focus:ring-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-3 rounded-lg disabled:opacity-50"
            >
                {loading ? "Creating..." : "Signup"}
            </button>
            </div>

            <div className="py-3">
            <button
                type="button"
                onClick={() => setView("login")}
                className="text-sm flex gap-2 items-center cursor-pointer text-gray-400 hover:text-blue-900"
            >
              <span><CgArrowLeft size={19} /></span>  Back To Login
            </button>

            </div>
        </form>
    );
}