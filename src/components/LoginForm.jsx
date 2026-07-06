"use client";

import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from 'react-hot-toast';
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
        if(!email || !password) {
            showToast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            toastId.current = showToast.loading("Logging in....")
            const user = await loginUser(email, password);
            setEmail('');
            setPassword('');
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                toast.dismiss(toastId.current)

                if (userData.role === "admin") {
                    showToast.success("Welcome Admin! 👋")
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
            } finally{
                setLoading(false)
            }
    }

    return (

        <form onSubmit={handleLogin}>
            <h2 className="text-3xl font-bold mb-6">
                Login
            </h2>
            <input
                type="email"
                autoComplete="new-password"
                placeholder="Email"
                className="w-full border p-3 rounded-lg mb-4"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                } />
            <input
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                className="w-full border p-3 rounded-lg mb-4"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                } />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-3 rounded-lg">
                {loading ? "Loading..." : "Login"}
            </button>
            <button
                type="button"
                onClick={() => setView("signup")}
                className="w-full mt-4 border py-3 rounded-lg" >
                Create Account
            </button>
            <button
                type="button"
                onClick={() => setView("forgot")}
                className="text-sm underline mt-4" >
                Forgot Password?
            </button>
        </form>
    );
}
