// src/components/CheckOut 
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
// import { useRouter, usePathname } from "next/navigation";

const DELIVERY_FEE = 3;

const CheckOut = ({ setCheck }) => {

  // const router = useRouter();  

  const [userData, setUserData] = useState({
    name: '',
    postcode: '',
    emailadd: '',
    phonnum: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('')
  const {
    items,
    loading,
    uid,
    updateQty,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const saveData = async (e) => {
    e.preventDefault();

    if (paymentMethod === '') {
      alert("Please select Payment method");
      return;
    }
    try {

      // Login ya Guest User
      const userType = uid ? "user" : "guest" ;

      // Order Items
      const orderItems = items.map((item) =>({
        foodId: item.foodId,
        name: item.name,
        price: item.price,
        qty: item.qty || 1,
        image: item.image || "",
      }))

      await addDoc(collection(db, "orders"), {
        name: userData.name,
        postcode: userData.postcode,
        emailadd: userData.emailadd,
        phonnum: userData.phonnum,

        userType : userType,
        userId : uid || null,
        paymentMethod : paymentMethod,
        items : orderItems ,

        subtotal : cartTotal,
        total : total,

        createAt : new Date(),
      })
      alert("Order Placed Successfully ✅");

      clearCart();

      // router.push("/"); <== For Page Routing 

      setCheck(false);

    } catch (error) {
      console.error(error)
    }
  }

  const total = cartTotal + DELIVERY_FEE;

  return (
    <div className="lg:max-w-150 h-180 overflow-y-auto">
      <div className="p-2">
        <form onSubmit={saveData} className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold">Billing & Shipping</h2>
          <div className="grid lg:grid-cols-2 gap-4">

            {/* Label */}
            <div className="flex flex-col gap-1">
              <label>
                Full name<span className="text-red-500">*</span>
              </label>
              <input required={true}
                value={userData.name}
                onChange={(e) => { setUserData({ ...userData, name: e.target.value }) }}
                className="border focus:outline-none rounded-md py-1 px-2 placeholder:text-gray-400"
                type="text"
                placeholder="Rao Zaheer"
              />
            </div>

            {/* Label */}
            <div className="flex flex-col gap-1">
              <label>Postcode <span className="text-red-500">*</span></label>
              <input required={true}
                className="border focus:outline-none rounded-md py-1 px-2  placeholder:text-gray-400 placeholder:text-sm"
                type="text"
                value={userData.postcode}
                onChange={(e) => setUserData({ ...userData, postcode: e.target.value })}
                placeholder="Postcodes GU14*, GU15*, GU16*, GU17*, GU18*, GU19*, GU47*"
              />
            </div>

            {/* Label */}
            <div className="flex flex-col gap-1">
              <label className="text-red-500 ">Email address *</label>
              <input required={true}
                className="border focus:outline-none rounded-md py-1 px-2 placeholder:text-gray-400"
                type="email"
                value={userData.emailadd}
                onChange={(e) => setUserData({ ...userData, emailadd: e.target.value })}
                placeholder="testing@gmail.com"
              />
            </div>

            {/* Label */}
            <div className="flex flex-col gap-1">
              <label>
                Phone<span className="text-red-500">*</span>
              </label>
              <input required={true}
                className="border focus:outline-none rounded-md py-1 px-2 placeholder:text-gray-400"
                type="number"
                value={userData.phonnum}
                onChange={(e) => setUserData({ ...userData, phonnum: e.target.value })}
                placeholder="+442007700900123"
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
                        <h3 className="font-medium text-gray-800 text-sm truncate min-w-60">
                          {item.name}
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
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label>
                  <input  value="Cash On Delivery" required={true} onChange={(e) => setPaymentMethod(e.target.value)} type="radio" /> Pay via phone or at the restaurant.
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
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 font-semibold text-white px-5 py-2 cursor-pointer rounded-sm">
              PLACE ORDER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOut;
