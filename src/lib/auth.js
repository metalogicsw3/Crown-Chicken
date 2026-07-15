// src/lib/auth
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
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
// Verfication add
  await sendEmailVerification();
  return user;
};

// Send Verification
export const sendVerificationEmail = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user found");
  }

  await sendEmailVerification(user);
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

// CHANGE EMAIL
export const changeEmail = async (currentPassword, newEmail) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  // Verify current password
  await reauthenticateWithCredential(user, credential);

  // Sends a verification link to the NEW email
  await verifyBeforeUpdateEmail(user, newEmail);
};

//Change Password
export const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not logged in");
  }

  const credential = EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};