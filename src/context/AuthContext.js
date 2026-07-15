"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);

  //tracking auth state (real user OR anonymous guest)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
      
        if (!firebaseUser.isAnonymous) {
          try {
            await firebaseUser.reload(); 
            const freshUser = auth.currentUser;

            const userRef = doc(db, "users", freshUser.uid);
            const snap = await getDoc(userRef);

            if (
              snap.exists() &&
              snap.data().emailVerified !== freshUser.emailVerified
            ) {
              await updateDoc(userRef, {
                emailVerified: freshUser.emailVerified,
              });
            }
            setUser(freshUser);
          } catch (err) {
            console.error("emailVerified sync failed:", err);
            setUser(firebaseUser);
          }
        } else {
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
 // Check Admin or User
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user || user.isAnonymous) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === "admin");
      } catch (err) {
        console.error("Admin check failed:", err);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    };

    if (!authLoading) {
      checkAdmin();
    }
  }, [user, authLoading]);

  const logout = async () => {
    await signOut(auth);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, authLoading, adminLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);