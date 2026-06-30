// src/lib/auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const isAdmin = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return false;
  return snap.data().role === "admin";
};

// SIGNUP
export const signupUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), { name, email, role: "user" });
  return user;
};

// LOGIN
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  return userCredential.user;
};

// LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};

// RESET PASSWORD
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
