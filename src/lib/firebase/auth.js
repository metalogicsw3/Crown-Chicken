// src/lib/firebase/auth.js
import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

// ✅ Signup
export const signupUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// ✅ Login
export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// ✅ Logout
export const logoutUser = () => signOut(auth);

// ✅ Google Login
export const googleLogin = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
