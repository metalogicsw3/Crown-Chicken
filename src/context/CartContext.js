// src/context/CartContext.js
"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { doc, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

const CartContext = createContext();
const LOCAL_CART_KEY = "guest_cart";

// ── localStorage helpers ──────────────────────────────────────────
function readLocalCart() {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items) {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
  } catch {}
}

// ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [uid, setUid] = useState(null);          // null = guest
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  

  // Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user ? user.uid : null);
    });
    return () => unsub();
  }, []);

  // ── Sync cart based on login state ──────────────────────────────
  useEffect(() => {
    if (uid === null) {
      // Guest — load from localStorage immediately
      setItems(readLocalCart());
      setLoading(false);
      return;
    }

    // Logged-in — listen to Firestore
    const cartRef = doc(db, "carts", uid);
    const unsub = onSnapshot(cartRef, (snap) => {
      setItems(snap.exists() ? snap.data().items || [] : []);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  // ── addToCart ───────────────────────────────────────────────────
  const addToCart = useCallback(async (food, qty = 1) => {
    if (uid) {
      // Firestore path
      const cartRef = doc(db, "carts", uid);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(cartRef);
        const current = snap.exists() ? snap.data().items || [] : [];
        const idx = current.findIndex((i) => i.foodId === food.id);
        let updated;
        if (idx > -1) {
          updated = [...current];
          updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
        } else {
          updated = [
            ...current,
            { foodId: food.id, name: food.name, price: Number(food.price), imageUrl: food.imageUrl || null, qty },
          ];
        }
        tx.set(cartRef, { items: updated, updatedAt: serverTimestamp() });
      });
    } else {
      // localStorage path
      const current = readLocalCart();
      const idx = current.findIndex((i) => i.foodId === food.id);
      let updated;
      if (idx > -1) {
        updated = [...current];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
      } else {
        updated = [
          ...current,
          { foodId: food.id, name: food.name, price: Number(food.price), imageUrl: food.imageUrl || null, qty },
        ];
      }
      writeLocalCart(updated);
      setItems(updated);
    }
    return true;
  }, [uid]);

  // ── updateQty ───────────────────────────────────────────────────
  const updateQty = useCallback(async (foodId, qty) => {
    if (uid) {
      const cartRef = doc(db, "carts", uid);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(cartRef);
        const current = snap.exists() ? snap.data().items || [] : [];
        const updated = qty <= 0
          ? current.filter((i) => i.foodId !== foodId)
          : current.map((i) => (i.foodId === foodId ? { ...i, qty } : i));
        tx.set(cartRef, { items: updated, updatedAt: serverTimestamp() });
      });
    } else {
      const current = readLocalCart();
      const updated = qty <= 0
        ? current.filter((i) => i.foodId !== foodId)
        : current.map((i) => (i.foodId === foodId ? { ...i, qty } : i));
      writeLocalCart(updated);
      setItems(updated);
    }
  }, [uid]);

  const removeFromCart = useCallback((foodId) => updateQty(foodId, 0), [updateQty]);

  // ── clearCart ───────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (uid) {
      await runTransaction(db, async (tx) => {
        tx.set(doc(db, "carts", uid), { items: [], updatedAt: serverTimestamp() });
      });
    } else {
      writeLocalCart([]);
      setItems([]);
    }
  }, [uid]);

  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ uid, items, loading, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
