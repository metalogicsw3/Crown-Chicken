// lib/firebase/auth.js
import { auth } from './config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Login
export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Signup
export const signupUser = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// Sign Out
export const logoutUser = () => signOut(auth);

// Google Login
export const googleLogin = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};