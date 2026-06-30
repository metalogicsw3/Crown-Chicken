'use client';

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';

export default function CheckoutForm({ clientSecret, userId, cartItems, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage('');

    // 1. Validate Stripe form fields client-side
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || 'Validation error');
      setLoading(false);
      return;
    }

    // 2. Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // 3. Save order to Firestore via our API route
      try {
        const res = await fetch('/api/confirm-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            userId,
            cartItems,
            total,
          }),
        });

        const data = await res.json();
        if (!data.success) {
          // Payment went through but DB write failed — still go to success
          // so user isn't confused, but log for debugging
          console.error('Order save failed:', data.error);
        }

        // 4. Redirect to success page with payment reference
        window.location.href = `/checkout/success?payment_intent=${paymentIntent.id}&order_id=${data.orderId || ''}`;
      } catch (err) {
        console.error('confirm-order fetch failed:', err);
        // Still redirect — payment succeeded even if our DB write failed
        window.location.href = `/checkout/success?payment_intent=${paymentIntent.id}`;
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element — handles card, Google Pay, Apple Pay automatically */}
      <PaymentElement options={{ layout: 'tabs' }} />

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay £{Number(total).toFixed(2)}
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Secured by Stripe. Your payment info is never stored.
      </p>
    </form>
  );
}
