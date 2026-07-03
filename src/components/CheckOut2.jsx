import React from "react";
import { useCart } from "@/context/CartContext";

const CheckOut2 = () => {
  const {
    items,
    loading,
    uid,
    updateQty,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();
  return (
    <div className="max-w-150">
      <div className="p-2">
        <form className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">Billing & Shipping</h2>
          {/* Label */}
          <div className="flex flex-col gap-1">
            <label>
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              className="border focus:outline-none rounded-md py-1 px-2  placeholder:text-gray-400 placeholder:text-xs"
              type="text"
              placeholder="postcodes GU14*, GU15*, GU16*, GU17*, GU18*, GU19*, GU47*"
            />
          </div>

          {/* Label */}
          <div className="md:flex justify-between gap-2 ">
            <div className="flex flex-col gap-1">
              <label>
                First name<span className="text-red-500">*</span>
              </label>
              <input
                className="border focus:outline-none rounded-md py-1 px-2 placeholder:text-gray-400"
                type="text"
                placeholder="Rao"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>
                Last name<span className="text-red-500">*</span>
              </label>
              <input
                className="border focus:outline-none rounded-md py-1 px-2 placeholder:text-gray-400"
                type="text"
                placeholder="Zaheer"
              />
            </div>
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <label className="text-red-500 ">Email address *</label>
            <input
              className="border focus:outline-none rounded-md py-1 px-2 placeholder:text-gray-400"
              type="text"
              placeholder="testing@gmail.com"
            />
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <label>
              Phone<span className="text-red-500">*</span>
            </label>
            <input
              className="border focus:outline-none rounded-md py-1 px-2 placeholder:text-gray-400"
              type="text"
              placeholder="+442007700900123"
            />
          </div>

          {/* ORDER Dev */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Your Order</h2>
            <div className="">
              {/* ORDER Details */}
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.foodId}
                      className="flex  flex-col items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex gap-3">
                        <h3 className="font-medium text-gray-800 text-sm truncate min-w-60">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 font-medium text-sm">
                          £{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex">
                        <h3 className="text-gray-800 text-md font-semibold truncate min-w-60">
                          Total
                        </h3>
                        <span>£{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <input type="radio" />
                <label> Pay via phone or at the restaurant.</label>
              </div>
              <p className="flex flex-col p-4 bg-gray-900/20 rounded-sm">
                <span>
                  {
                    "Delivery -> We will call you as soon as we receive the order to get the payment."
                  }
                </span>
                <span>
                  {
                    "Pickup -> You will be able to pay directly at the restaurant."
                  }
                </span>
              </p>
              <p>
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our{" "}
                <span className="font-semibold">privacy policy.</span>
              </p>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button className="bg-orange-500 hover:bg-orange-600 font-semibold text-white px-5 py-2 cursor-pointer rounded-sm">
              PLACE ORDER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOut2;
