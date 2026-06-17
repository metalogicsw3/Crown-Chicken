// src/components/_client/checkout/GuestCheckoutForm.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { placeOrder } from '@/lib/firebase/orders';
import CreateAccountPrompt from './CreateAccountPrompt';

export default function GuestCheckoutForm({ cartItems, total }) {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await placeOrder(
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        items: cartItems,
        total,
      },
      user?.uid // agar logged in hai toh uid jayega, warna undefined
    );

    setLoading(false);

    if (result.success) {
      setOrderPlaced(true);

      // Agar guest hai (logged in nahi), account banane ka offer do
      if (!user) {
        setShowAccountPrompt(true);
      } else {
        router.push('/'); // logged-in hai toh seedha home
      }
    } else {
      alert('Order place nahi hua, dobara try karo!');
    }
  };

  if (orderPlaced && showAccountPrompt) {
    return <CreateAccountPrompt email={formData.email} name={formData.name} />;
  }

  if (orderPlaced) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800">Order Confirmed!</h2>
        <p className="text-gray-500 mt-2">Aapka order successfully place ho gaya hai.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Delivery Details</h2>
      <p className="text-sm text-gray-500 mb-4">
        Account zaroori nahi hai — bas apna details daalo aur order karo!
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="03XX-XXXXXXX"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? 'Placing order...' : `Place Order — Rs. ${total}`}
      </button>
    </form>
  );
}