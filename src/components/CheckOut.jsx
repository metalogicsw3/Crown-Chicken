// src/components/CheckOut
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { showToast } from "@/lib/toast";
import { useRef } from "react";
import { serverTimestamp } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { MdDeliveryDining } from "react-icons/md";

const CheckOut = () => {
  const {
    uid,
    items,
    loading,
    clearCart,
    cartTotal,
    total,
    closePopup,
    resetDiscount,
    selectedTime,
    selectedDate,
    deliveryMethod,
  } = useCart();

  const [userData, setUserData] = useState({
    name: "",
    emailadd: "",
    address: "",
    postcode: "",
    phonnum: "",
  });

  const [deliveryUnavailable, setDeliveryUnavailable] = useState(false);

  //Fetch Data
  useEffect(() => {
    const getUserProfile = async () => {
      if (!uid) return;

      try {
        const docSnap = await getDoc(doc(db, "users", uid));

        if (docSnap.exists()) {
          const data = docSnap.data();

          setUserData({
            name: data.name || "",
            emailadd: data.email || "",
            address: data.address || "",
            postcode: data.postcode || "",
            phonnum: data.phone || "",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserProfile();
  }, [uid]);

  const [paymentMethod, setPaymentMethod] = useState("");
  const toastId = useRef(null);

  const saveData = async (e) => {
    e.preventDefault();

    //Postcode Validation
    const allowedPostcodes = [
      "GU14",
      "GU15",
      "GU16",
      "GU17",
      "GU18",
      "GU19",
      "GU47",
    ];
    const postcode = userData.postcode.trim().toUpperCase();

    const isValidPostcode = allowedPostcodes.some((code) =>
      postcode.startsWith(code),
    );

    if (!isValidPostcode) {
      setDeliveryUnavailable(true);
      showToast.error("Sorry, delivery is not available in your area.");
      return;
    }

    // Phone Number Validation
    const ukPhoneRegex = /^07\d{9}$/;

    if (!ukPhoneRegex.test(userData.phonnum)) {
      showToast.error("Enter a valid UK mobile number");
      return;
    }

    if (paymentMethod === "") {
      showToast.error("Please select Payment method");
      return;
    }

    // ✅ Show loading toast
    toastId.current = showToast.loading("Placing your order...");

    try {
      // Login ya Guest User
      const userType = uid ? "user" : "guest";

      // Order Items
      const orderItems = items.map((item) => ({
        foodId: item.foodId,
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
        image: item.image || "",
      }));

      await addDoc(collection(db, "orders"), {
        name: userData.name,
        emailadd: userData.emailadd,
        address: userData.address,
        postcode: userData.postcode,
        phonnum: userData.phonnum,

        userType: userType,
        userId: uid || null,
        paymentMethod: deliveryMethod,
        orderType: deliveryMethod,
        time: deliveryMethod === "Delivery" ? selectedTime : selectedTime,
        date: deliveryMethod === "Pickup" ? selectedDate : null,
        status: false,
        items: orderItems,
        subtotal: cartTotal,
        total: total,
        createdAt: serverTimestamp(),
      });
      toast.dismiss(toastId.current);
      showToast.success("Your order has been placed successfully! 🎉");

      clearCart();
      resetDiscount();
      closePopup();
    } catch (error) {
      toast.dismiss(toastId.current);
      showToast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="h-[92vh] overflow-y-auto ">
      <form onSubmit={saveData} className="flex flex-col gap-3 p-10">
        <h2 className="text-2xl font-semibold">Billing & Shipping</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Label */}
          <div className="flex flex-col gap-1">
            <label>
              Full name<span className="text-red-500">*</span>
            </label>
            <input
              required={true}
              value={userData.name}
              onChange={(e) => {
                setUserData({ ...userData, name: e.target.value });
              }}
              className="hover:bg-gray-200 border border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 rounded-md py-1 px-2 placeholder:text-gray-400"
              type="text"
              placeholder="Rao Zaheer"
            />
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <label className="text-red-500 ">Email address *</label>
            <input
              type="email"
              value={userData.emailadd}
              readOnly
              className="hover:bg-gray-200 border border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 rounded-md py-1 px-2 placeholder:text-gray-400"
            />
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <label>
              Address<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required={true}
              value={userData.address}
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
              placeholder="Enter your address...."
              className="hover:bg-gray-200 border border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 rounded-md py-1 px-2 placeholder:text-gray-400"
            />
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <label>
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              required={true}
              type="text"
              value={userData.postcode}
              onChange={(e) =>
                setUserData({ ...userData, postcode: e.target.value })
              }
              placeholder="Postcodes GU14*, GU15*, GU16*, GU17*, GU18*, GU19*, GU47*"
              className="hover:bg-gray-200 border border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 rounded-md py-1 px-2 placeholder:text-gray-400"
            />
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <label>
              Phone<span className="text-red-500">*</span>
            </label>
            <input
              required={true}
              type="tel"
              maxLength={11}
              pattern="^07\d{9}$"
              placeholder="07400123456"
              value={userData.phonnum}
              onChange={(e) =>
                setUserData({ ...userData, phonnum: e.target.value })
              }
              className="hover:bg-gray-200 border border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-0 rounded-md py-1 px-2 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* ORDER Dev */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Your Order</h2>
          <div className="">
            {/* ORDER Details */}
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-1 overflow-y-auto pr-1 max-h-80">
                {items.map((item) => (
                  <div
                    key={item.foodId}
                    className="flex  flex-col gap-1 px-3 py-2 "
                  >
                    <div className="flex ">
                      <h3 className="text-gray-800 text-sm truncate min-w-60">
                        <span className="text-md font-medium">{item.name}</span>
                        <span className="font-semibold text-sm">
                          {" "}
                          × {item.qty}
                        </span>
                      </h3>
                      <p className="text-gray-600 font-medium text-sm">
                        £{item.price.toFixed(2)}
                      </p>
                    </div>
                    <hr className="text-gray-300 rounded-lg" />
                  </div>
                ))}

                {/*Total Card Dev*/}
                <div className="px-3 py-2">
                  <div className="flex font-bold">
                    <h3 className="text-gray-800 text-md  truncate min-w-60">
                      Total
                    </h3>
                    <span className="text-neutral-800">
                      £{total.toFixed(2)}
                    </span>
                  </div>
                  <hr className="text-gray-300 rounded-lg" />
                  {deliveryUnavailable && (
                    <div className="mt-5 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                      <span className="flex items-center gap-2">
                      <MdDeliveryDining className="" size={20}/> We only deliver on the following postcodes:
                      </span>
                      <br />
                      <span className="font-semibold">
                        GU14, GU15, GU16, GU17, GU18, GU19, GU47
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label>
                <input
                  value="Cash On Delivery"
                  required={true}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  type="radio"
                />{" "}
                Pay via phone or at the restaurant.
              </label>
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-700 font-semibold text-white px-5 py-2 cursor-pointer rounded-sm"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
        {/* Submit Button */}
      </form>
    </div>
  );
};

export default CheckOut;
