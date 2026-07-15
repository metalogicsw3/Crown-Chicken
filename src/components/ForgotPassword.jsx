// src/components/ForgotPassword 
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
      <h2 className="text-3xl font-bold mb-6">Reset Password</h2>
      <div className=" flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full font-semibold bg-blue-900 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </div>
    </form>
  );
}
