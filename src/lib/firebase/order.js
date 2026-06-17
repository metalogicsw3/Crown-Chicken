// src/lib/firebase/orders.js
import { db } from './config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Order place karna - chahe guest ho ya logged-in user
export const placeOrder = async (orderData, userId = null) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,           // { name, email, phone, items, total }
      userId: userId || null, // agar logged-in hai toh uid, warna null
      isGuest: !userId,
      createdAt: serverTimestamp(),
      status: 'pending',
    });
    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error('Order placing error:', error);
    return { success: false, error: error.message };
  }
};