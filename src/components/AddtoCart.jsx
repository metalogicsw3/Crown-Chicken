'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  MdChevronRight,
  MdDeliveryDining,
  MdStorefront,
  MdRemove,
  MdAdd,
  MdDeleteOutline,
  MdShoppingCart,
  MdAccessTime,
  MdCalendarToday,
  MdDiscount,
} from "react-icons/md";

const DELIVERY_FEE = 3;
const SERVICE_FEE = 1.5;

const AddtoCart = () => {
  const { items, loading, uid, updateQty, removeFromCart, clearCart, cartTotal } = useCart();
  const router = useRouter();
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const deliveryFee = deliveryMethod === "delivery" ? DELIVERY_FEE : 0;
  const total = cartTotal + deliveryFee + SERVICE_FEE - discount;

  const handleApplyDiscount = () => {
    // Placeholder — wire up real discount logic as needed
    if (discountCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(cartTotal * 0.1);
    } else {
      alert("Invalid discount code.");
      setDiscount(0);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-10 flex items-center justify-center mx-auto">
      <div className="w-full h-205 max-w-md max-h-screen flex flex-col rounded-lg bg-white shadow-xl border-l border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="p-4 border-b border-gray-200 shrink-0 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MdShoppingCart className="text-xl text-orange-500" />
            Your Cart
            {items.length > 0 && (
              <span className="ml-1 text-xs bg-orange-500 text-white rounded-full px-2 py-0.5">
                {items.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </h2>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-gray-400 hover:text-red-500 transition"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Delivery Options */}
        <div className="p-4 border-b border-gray-200 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setDeliveryMethod("delivery")}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                deliveryMethod === "delivery"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              <MdDeliveryDining className="text-lg" />
              <div className="text-left">
                <div className="font-medium text-xs">Delivery</div>
                <div className="text-[10px] text-gray-400">£10 minimum</div>
              </div>
            </button>
            <button
              onClick={() => setDeliveryMethod("pickup")}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                deliveryMethod === "pickup"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              <MdStorefront className="text-lg" />
              <div className="text-left">
                <div className="font-medium text-xs">Pickup</div>
                <div className="text-[10px] text-gray-400">£6 minimum</div>
              </div>
            </button>
          </div>

          {/* Time Slot */}
          <div className="flex items-center justify-between mt-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 text-gray-600 flex-wrap">
              <div className="flex items-center gap-1">
                <MdCalendarToday className="text-gray-500 text-sm" />
                <span className="text-xs font-medium">Today</span>
              </div>
              <div className="flex items-center gap-1">
                <MdAccessTime className="text-gray-500 text-sm" />
                <span className="text-xs font-medium">11:00 – 11:30</span>
              </div>
            </div>
            <MdChevronRight className="text-gray-400 text-xl shrink-0" />
          </div>
        </div>

        {/* Cart Items — scrollable */}
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              Loading cart…
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <MdShoppingCart className="text-4xl text-gray-400" />
                </div>
              </div>
              <p className="text-gray-500 text-sm">Your cart is empty</p>
              <p className="text-gray-400 text-xs mt-1">Add items from our menu!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.foodId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {/* Thumbnail */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                    <p className="text-gray-600 font-medium text-sm">
                      £{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1 py-0.5 shrink-0">
                    <button
                      onClick={() => updateQty(item.foodId, item.qty - 1)}
                      className="p-1 text-gray-600 hover:text-red-500 transition"
                      aria-label="Decrease quantity"
                    >
                      <MdRemove className="text-sm" />
                    </button>
                    <span className="w-6 text-center font-medium text-gray-700 text-sm">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.foodId, item.qty + 1)}
                      className="p-1 text-gray-600 hover:text-green-600 transition"
                      aria-label="Increase quantity"
                    >
                      <MdAdd className="text-sm" />
                    </button>
                  </div>

                  {/* Item Total & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-medium text-gray-800 text-sm">
                      £{(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.foodId)}
                      className="text-gray-400 hover:text-red-600 transition"
                      aria-label={`Remove ${item.name}`}
                    >
                      <MdDeleteOutline className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section — pinned */}
        <div className="border-t border-gray-200 p-4 shrink-0">
          {/* Discount Code */}
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <MdDiscount className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-black bg-gray-50"
                />
              </div>
              <button
                onClick={handleApplyDiscount}
                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
              >
                Apply
              </button>
            </div>
          </div>

          {items.length === 0 && !loading && (
            <div className="text-center py-2">
              <p className="text-gray-400 text-xs">Add items to get started</p>
            </div>
          )}

          {items.length > 0 && (
            <>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>£{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>£{SERVICE_FEE.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-£{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-base font-bold text-gray-800">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full mt-3 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Checkout</span>
                <MdChevronRight className="text-xl" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddtoCart;
