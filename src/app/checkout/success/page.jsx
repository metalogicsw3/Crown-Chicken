'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckCircle, ShoppingBag, Loader2 } from 'lucide-react';

// Inner component that safely uses useSearchParams inside Suspense
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();

  const paymentIntentId = searchParams.get('payment_intent');
  const orderId = searchParams.get('order_id');

  // Clear cart once on mount
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 text-sm mb-6">
        Thank you for your order. Your payment was successful and your order is being prepared.
      </p>

      {/* Order details */}
      {(orderId || paymentIntentId) && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-left space-y-2">
          {orderId && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
              <p className="text-xs font-mono font-semibold text-gray-800 break-all">{orderId}</p>
            </div>
          )}
          {paymentIntentId && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Payment Reference</p>
              <p className="text-xs font-mono text-gray-600 break-all">{paymentIntentId}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push('/')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue Shopping
        </button>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition text-sm"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

// Outer page wraps in Suspense — required by Next.js App Router for useSearchParams
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading...</span>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
