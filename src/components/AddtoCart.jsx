// src/components/AddtoCart.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import {
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
import { toast } from "react-hot-toast";
import { showToast } from "@/lib/toast";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import TimeSlot from "./TimeSlot";
import DateSlot from "./DateSlot";

const AddtoCart = () => {
  const {
    items,
    loading,
    updateQty,
    removeFromCart,
    clearCart,
    cartTotal,
    openPopup,

    deliveryMethod,
    setDeliveryMethod,

    discountCode,
    setDiscountCode,
    discountAmount,
    setDiscountAmount,
    resetDiscount,
    deliveryFee,
    total,
    setSelectedDate,
    setSelectedTime,
    timeDropdownOpen,
    setTimeDropdownOpen,
    selectedTime,
    dateDropdownOpen,
    setDateDropdownOpen,
    selectedDate,
  } = useCart();

  const toastId = useRef(null);
  const timeRef = useRef(null);
  const dateRef = useRef(null);

  const handleCheckOut = () => {
    // Delivery
    if (deliveryMethod === "Delivery") {
      if (!selectedTime) {
        toast.error("Please select a delivery time.");
        return;
      }
    }
    // Pickup
    if (deliveryMethod === "Pickup") {
      if (!selectedDate) {
        toast.error("Please select a Pickup date.");
        return;
      }

      if (!selectedTime) {
        toast.error("Please select a Pickup time.");
        return;
      }
    }
    openPopup("CheckOut");
  };

  // Apply Discount with toast
  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === "SAVE10") {
      setDiscountAmount(cartTotal * 0.1);
      showToast.success("Discount applied! 🎉");
      setDiscountCode("");
    } else {
      setDiscountAmount(0);
      showToast.error("Invalid discount code.");
    }
  };

  // clear cart with toast
  const handleClearCart = () => {
    if (items.length === 0) return;

    // Show confirmation toast
    const confirmId = toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-lg shadow-xl max-w-sm border border-gray-200">
          <p className="text-gray-800 font-medium mb-3">
            Clear all items from cart?
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Show loading while clearing
                toastId.current = showToast.loading("Clearing cart...");
                clearCart();
                resetDiscount();
                toast.dismiss(toastId.current);
                showToast.success("Cart cleared!");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  // quantity update with toast
  const handleUpdateQty = (foodId, newQty, itemName) => {
    if (newQty === 0) {
      // Show toast when removing item
      showToast.info(`${itemName} removed from cart`);
      updateQty(foodId, newQty);
    } else {
      updateQty(foodId, newQty);
    }
  };

  //  remove from cart with toast
  const handleRemoveItem = (foodId, itemName) => {
    showToast.info(`${itemName} removed from cart`);
    removeFromCart(foodId);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Time dropdown
      if (timeRef.current && !timeRef.current.contains(e.target)) {
        setTimeDropdownOpen(false);
      }
      // Date dropdown
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setDateDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full py-2 ">
      <div className="w-full h-[88vh] overflow-visible max-w-md max-h-screen flex flex-col rounded-lg bg-white shadow-md border border-gray-300 ">
        {/* Header */}
        <div className="p-2 border-b border-gray-200 shrink-0 flex items-center justify-between">
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
              onClick={handleClearCart}
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
              onClick={() => {
                setDeliveryMethod("Delivery");
                setSelectedTime("");
                setSelectedDate("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                deliveryMethod === "Delivery"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              <MdDeliveryDining className="text-lg" />
              <div className="text-left">
                <div className="font-medium text-xs">Delivery</div>
              </div>
            </button>
            <button
              onClick={() => {
                setDeliveryMethod("Pickup");
                setSelectedTime("");
                setSelectedDate("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                deliveryMethod === "Pickup"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              <MdStorefront className="text-lg" />
              <div className="text-left">
                <div className="font-medium text-xs">Pickup</div>
              </div>
            </button>
          </div>

          {/* Time Slot */}
          <div className="w-full mt-3 grid grid-cols-2 gap-2">
            {/* Date Button */}
            <div
              ref={dateRef}
              className={`relative ${deliveryMethod === "Delivery" ? "hidden" : ""}`}
            >
              <button
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                className="w-full flex items-center justify-center gap-2 border border-gray-400 rounded-lg px-2 py-1"
              >
                <MdCalendarToday className="text-gray-500 text-sm" />

                <span className="text-xs text-gray-500 font-medium">
                  {selectedDate || `${deliveryMethod} Date`}
                </span>

                <MdKeyboardArrowDown
                  className={`text-gray-400 text-xl transition-transform duration-300 ${
                    dateDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <DateSlot />
            </div>

            {/* Time Button */}
            <div
              ref={timeRef}
              className={`relative ${
                deliveryMethod === "Delivery" ? "col-span-2" : "col-span-1"
              }`}
            >
              <button
                onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                className="w-full flex items-center justify-center gap-2 border border-gray-400 rounded-lg px-2 py-1"
              >
                <MdAccessTime className="text-gray-500 text-sm" />

                <span className="text-xs text-gray-500 font-medium">
                  {selectedTime || `${deliveryMethod} Time`}
                </span>

                <MdKeyboardArrowDown
                  className={`text-gray-400 text-xl transition-transform duration-300 ${
                    timeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              <TimeSlot />
            </div>
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
              <p className="text-gray-400 text-xs mt-1">
                Add items from our menu!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.foodId}
                  className="flex items-center gap-3 py-1.5 px-3 bg-gray-50 rounded-lg"
                >
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
                    <h4 className="font-medium text-gray-800 text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-gray-600 font-medium text-xs">
                      £{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1 py-0.5 shrink-0">
                    <button
                      onClick={() =>
                        handleUpdateQty(item.foodId, item.qty - 1, item.name)
                      }
                      className="p-1 text-gray-600 hover:text-red-500 transition"
                      aria-label="Decrease quantity"
                    >
                      <MdRemove className="text-sm" />
                    </button>
                    <span className="w-6 text-center font-medium text-gray-700 text-sm">
                      {item.qty}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQty(item.foodId, item.qty + 1, item.name)
                      }
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
                      onClick={() => handleRemoveItem(item.foodId, item.name)}
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
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>£{deliveryFee.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-y border-gray-200 py-1">
                  <div className="flex justify-between text-base font-bold text-gray-800">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center py-1">
                  <button
                    onClick={handleCheckOut}
                    className="px-8 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                  >
                    Proceed to Check
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddtoCart;
