// src/app/checkout/page.js
'use client';

import GuestCheckoutForm from '@/components/_client/checkout/GuestCheckoutForm';

export default function CheckoutPage() {
  // Abhi dummy data - baad mein Cart Context se aayega
  const cartItems = [
    { id: 1, name: 'Variety Box', price: 29.5, qty: 1 },
  ];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <GuestCheckoutForm cartItems={cartItems} total={total} />
    </div>
  );
}