// src/context/CartContext.js
"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
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
  const [items, setItems] = useState([]);
  const [uid, setUid] = useState(null); // null = guest
  const [loading, setLoading] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [check, setCheck] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  //Creating 7 Days
  const getNext7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      days.push({
        day: date.toLocaleDateString("en-GB", { weekday: "short" }),
        label: date.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        }),
      });
    }

    return days;
  };

  const dateSlots = getNext7Days();

  // Set Time Slot on Day Base
  const getSlotsByDay = (day) => {
    switch (day) {
      case "Mon":
        return [];

      case "Tue":
      case "Wed":
      case "Thu":
      case "Fri":
        return generateTimeSlots(17, 22);

      case "Sat":
        return [...generateTimeSlots(11, 15), ...generateTimeSlots(17, 23)];

      case "Sun":
        return generateTimeSlots(12, 21);

      default:
        return [];
    }
  };

  //Genrate Time Slot
  const generateTimeSlots = (startHour, endHour) => {
    const slots = [];

    const start = new Date();
    start.setHours(startHour, 0, 0, 0);

    const end = new Date();
    end.setHours(endHour, 0, 0, 0);

    while (start < end) {
      const next = new Date(start);
      next.setMinutes(next.getMinutes() + 20);

      slots.push(
        `${start.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })} - ${next.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`,
      );

      start.setMinutes(start.getMinutes() + 20);
    }

    return slots;
  };

  const todayName = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
  });

  const selectedDay =
    deliveryMethod === "Pickup"
      ? dateSlots.find((d) => d.label === selectedDate)?.day ||
        dateSlots[0]?.day
      : todayName;

  const timeSlots = getSlotsByDay(selectedDay);

  const resetDiscount = () => {
    setDiscountCode("");
    setDiscountAmount(0);
    setSelectedTime("");
    setSelectedDate("");
  };

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
  const addToCart = useCallback(
    async (food, qty = 1) => {
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
              {
                foodId: food.id,
                name: food.name,
                price: Number(food.price),
                imageUrl: food.imageUrl || null,
                qty,
              },
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
            {
              foodId: food.id,
              name: food.name,
              price: Number(food.price),
              imageUrl: food.imageUrl || null,
              qty,
            },
          ];
        }
        writeLocalCart(updated);
        setItems(updated);
      }
      return true;
    },
    [uid],
  );

  // ── updateQty ───────────────────────────────────────────────────
  const updateQty = useCallback(
    async (foodId, qty) => {
      if (uid) {
        const cartRef = doc(db, "carts", uid);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(cartRef);
          const current = snap.exists() ? snap.data().items || [] : [];
          const updated =
            qty <= 0
              ? current.filter((i) => i.foodId !== foodId)
              : current.map((i) => (i.foodId === foodId ? { ...i, qty } : i));
          tx.set(cartRef, { items: updated, updatedAt: serverTimestamp() });
        });
      } else {
        const current = readLocalCart();
        const updated =
          qty <= 0
            ? current.filter((i) => i.foodId !== foodId)
            : current.map((i) => (i.foodId === foodId ? { ...i, qty } : i));
        writeLocalCart(updated);
        setItems(updated);
      }
    },
    [uid],
  );

  const removeFromCart = useCallback(
    (foodId) => updateQty(foodId, 0),
    [updateQty],
  );

  // ── clearCart ───────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (uid) {
      await runTransaction(db, async (tx) => {
        tx.set(doc(db, "carts", uid), {
          items: [],
          updatedAt: serverTimestamp(),
        });
      });
    } else {
      writeLocalCart([]);
      setItems([]);
    }
  }, [uid]);

  const openPopup = (content) => {
    setPopupContent(content);
    setPopupOpen(true);
  };
  const closePopup = () => {
    setPopupOpen(false);
    setPopupContent("");
  };

  const DELIVERY_FEE = 3;
  const FREE_DELIVERY_LIMIT = 15;
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const deliveryFee =
    deliveryMethod === "Delivery"
      ? cartTotal >= FREE_DELIVERY_LIMIT
        ? 0
        : DELIVERY_FEE
      : 0;
  const total = cartTotal + deliveryFee - discountAmount;

  return (
    <CartContext.Provider
      value={{
        uid,
        items,
        loading,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,

        popupOpen,
        popupContent,

        openPopup,
        closePopup,

        check,
        setCheck,

        deliveryMethod,
        setDeliveryMethod,

        discountCode,
        setDiscountCode,

        discountAmount,
        setDiscountAmount,
        resetDiscount,
        deliveryFee,
        total,

        userOpen,
        setUserOpen,

        timeDropdownOpen,
        setTimeDropdownOpen,
        selectedTime,
        setSelectedTime,
        timeSlots,

        dateDropdownOpen,
        setDateDropdownOpen,
        selectedDate,
        setSelectedDate,
        dateSlots,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
