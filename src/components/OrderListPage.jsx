"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toDate().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrders([]);
        return;
      }
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="h-[90vh] w-full overflow-y-auto px-6 pt-8 ">
      <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400">No orders found.</p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4 pb-10">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">{order.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(order.createAt)}
                  </p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg whitespace-nowrap">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item, index) => (
                  <div
                    key={item.foodId || index}
                    className="flex justify-between py-2 text-sm text-gray-600"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>£{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-semibold text-gray-900">
                  £{order.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}