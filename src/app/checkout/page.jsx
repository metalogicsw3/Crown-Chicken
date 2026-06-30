'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import { Loader2, ShoppingBag, Image as ImageIcon } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const DELIVERY_FEE = 3;
const SERVICE_FEE = 1.5;

export default function CheckoutPage() {
  const { items, cartTotal, loading: cartLoading, uid } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState('');
  const [intentLoading, setIntentLoading] = useState(false);
  const [intentError, setIntentError] = useState('');

  const total = cartTotal + DELIVERY_FEE + SERVICE_FEE;

  // Create payment intent once cart is loaded and has items
  useEffect(() => {
    if (cartLoading || items.length === 0) return;

    setIntentLoading(true);
    setIntentError('');

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: items }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setClientSecret(data.clientSecret);
      })
      .catch((err) => setIntentError(err.message))
      .finally(() => setIntentLoading(false));
  }, [cartLoading, items]);

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your cart...</span>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <ShoppingBag className="w-16 h-16 text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-500 text-sm">Add some items before checking out.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          <p className="text-gray-500 mt-1 text-sm">Review your order and complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── Left: Order Summary ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              Order Summary
              <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
            </h2>

            {/* Items list */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.foodId} className="flex items-center gap-3">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">£{item.price.toFixed(2)} × {item.qty}</p>
                  </div>
                  <span className="font-semibold text-gray-800 text-sm shrink-0">
                    £{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>£{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>£{SERVICE_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-800 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Test card hint */}
            <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 space-y-1">
              <p className="font-semibold">🧪 Test Card Details</p>
              <p>Card number: <span className="font-mono font-medium">4242 4242 4242 4242</span></p>
              <p>Expiry: any future date &nbsp;|&nbsp; CVC: any 3 digits</p>
              <p>ZIP: any 5 digits</p>
            </div>
          </div>

          {/* ── Right: Payment Form ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>

            {intentError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {intentError}
              </div>
            )}

            {intentLoading || !clientSecret ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Preparing secure payment...</span>
              </div>
            ) : (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#f97316',
                      borderRadius: '12px',
                    },
                  },
                }}
              >
                <CheckoutForm
                  clientSecret={clientSecret}
                  userId={uid || 'guest'}
                  cartItems={items}
                  total={total}
                />
              </Elements>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
