"use client";

import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { GoChevronDown } from "react-icons/go";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderOpenDetails, setOrderOpenDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(collection(db, "orders"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[90vh] text-4xl font-semibold">
        Loading...
      </div>
    );
  }

  const cell =
    "flex items-center justify-center px-3 py-4 text-sm text-gray-700 ";

  return (
    <div className="h-[92vh] flex flex-col gap-1 bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
      {/* Header */}
      <div className="grid grid-cols-[1.2fr_2.2fr_0.8fr_1fr_1.2fr_1.4fr_1fr_1fr_1.2fr_0.8fr] bg-gray-100 border-b border-gray-300 font-semibold text-gray-800 rounded-t-xl">
        <div className={cell}>Name</div>
        <div className={cell}>Email Address</div>
        <div className={cell}>Date</div>
        <div className={cell}>Post Code</div>
        <div className={cell}>Order Type</div>
        <div className={cell}>Phone Number</div>
        <div className={cell}>Total</div>
        <div className={cell}>User Type</div>
        <div className={cell}>Completed</div>
        <div className={cell}>View</div>
      </div>

      {/* Body */}
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-[1.2fr_2.2fr_0.8fr_1fr_1.2fr_1.4fr_1fr_1fr_1.2fr_0.8fr] border-b border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            <div className={cell}>{order.name || "-"}</div>

            <div className={`${cell} break-all`}>{order.emailadd || "-"}</div>

            <div className={cell}>{order.date || "-"}</div>

            <div className={cell}>{order.postcode || "-"}</div>

            <div className={cell}>{order.orderType || "-"}</div>

            <div className={cell}>{order.phonnum || "-"}</div>

            <div className={cell}>£{order.total ?? 0}</div>

            <div className={cell}>{order.userType || "-"}</div>

            <div className={cell}>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm transition">
                Done
              </button>
            </div>

            <div className={cell}>
              <button
                onClick={() =>
                  setOrderOpenDetails((prev) =>
                    prev === order.id ? null : order.id,
                  )
                }
                className={`hover:bg-gray-200 p-2 rounded-full transition-all duration-300 ${
                  orderOpenDetails === order.id ? "rotate-180" : ""
                }`}
              >
                <GoChevronDown size={20} />
              </button>
            </div>

            {/* Order Details Section */}
            <div
              className={`col-span-10 overflow-hidden transition-all duration-300 ease-in-out ${
                orderOpenDetails === order.id
                  ? "opacity-100 max-h-[93vh] overflow-y-auto px-10 "
                  : "max-h-0 opacity-0 p-0"
              }`}
            >
              <div className="bg-white ">
                {/* Header */}
                <div className="grid grid-cols-5 font-semibold text-gray-700">
                  <div className="px-5 py-3">Item</div>
                  <div className="px-5 py-3 text-center">Quantity</div>
                  <div className="px-5 py-3 text-right">Price</div>
                </div>

                {/* Items */}
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 items-center  last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <div className="px-5 py-3 font-medium text-gray-700">
                      {item.name}
                    </div>

                    <div className="px-5 py-3 text-center text-gray-600">
                      x {item.qty}
                    </div>

                    <div className="px-5 py-3 text-right font-semibold text-green-600">
                      £{item.price}
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div className="flex gap-100 items-center px-5 py-4  font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">£{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="py-10 text-center text-gray-500">No Orders Found</div>
      )}
    </div>
  );
};

export default Orders;


// Email , Postcode , UserType in ko accordian ma rakhna ha kal 