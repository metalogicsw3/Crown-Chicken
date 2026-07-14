"use client";

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "react-hot-toast";
import { showToast } from "@/lib/toast";
import { useState, useRef } from "react";

export default function LoginForm({ setView, onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toastId = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      toastId.current = showToast.loading("Logging in....");
      const user = await loginUser(email, password);
      setEmail("");
      setPassword("");
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        toast.dismiss(toastId.current);

        if (userData.role === "admin") {
          showToast.success("Welcome Admin! 👋");
          router.push("/dashboard");
        } else {
          showToast.success("Welcome back! 👋");
          router.push("/");
        }
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId.current);

      if (error.code === "auth/invalid-credential") {
        showToast.error("Incorrect email or password.");
      } else if (error.code === "auth/too-many-requests") {
        showToast.error("Too many failed attempts. Try again later.");
      } else {
        showToast.error(`Login failed: ${error.message || "Please try again"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2 className="text-3xl font-bold mb-2">Login</h2>

      <div className="flex flex-col gap-4 py-4">
        <input
          type="email"
          name="login_email_field"
          autoComplete="off"
          placeholder="Email"
          className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 px-5 focus:border-blue-500 focus:outline-none focus:ring-0"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 px-5 focus:border-blue-500 focus:outline-none focus:ring-0"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Login"}
        </button>
        <button
          type="button"
          onClick={() => setView("signup")}
          className="w-full border border-gray-400 py-2 rounded-lg hover:bg-blue-900 hover:text-white cursor-pointer"
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => setView("forgot")}
          className="text-sm hover:text-blue-900 underline cursor-pointer"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
}
