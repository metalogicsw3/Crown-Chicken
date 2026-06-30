"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/auth";
export default function ForgotPassword({ setView }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await resetPassword(email);
            alert("Password reset email sent");
            setView("login");
        } catch (error) {
            console.error(error);
            alert("Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleReset}>
            <h2 className="text-3xl font-bold mb-6">
                Reset Password
            </h2>

            <input
                type="email"
                placeholder="Email"
                className="w-full border p-3 rounded-lg mb-4"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-3 rounded-lg"
            >
                {loading ? "Sending..." : "Send Reset Email"}
            </button>

        </form>
    );
}
