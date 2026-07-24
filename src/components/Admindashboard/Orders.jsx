"use client";

import {
  collection,
  getDocsFromServer,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
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
      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocsFromServer(ordersQuery);

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

  const handleStatus = async (id) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        status: true,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: true } : order,
        ),
      );
    } catch (error) {
      console.error(error);
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

  const formatCreatedAt = (timestamp) => {
    if (!timestamp) return "-";

    return timestamp.toDate().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="h-[92vh] bg-white rounded-xl shadow-md border border-gray-200 overflow-auto">
      <table className="w-full border-collapse">
        {/* Header */}
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr className="border-b border-gray-300 text-gray-800">
            <th className="table-head">Name</th>
            <th className="table-head">Address</th>
            <th className="table-head">PostCode</th>
            <th className="table-head">Date</th>
            <th className="table-head">Time Slot</th>
            <th className="table-head">Order Type</th>
            <th className="table-head">Phone Number</th>
            <th className="table-head">Total</th>
            <th className="table-head">Status</th>
            <th className="table-head">View</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <>
                <tr
                  key={order.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-5 text-center">{order.name || "-"}</td>

                  <td className="px-4 py-5 text-center text-xs text-gray-400">
                    {order.address || "-"}
                  </td>

                  <td className="px-4 py-5 text-center">
                    {order.postcode || "-"}
                  </td>

                  <td className="px-4 py-5 text-center whitespace-nowrap">
                    {order.date || formatCreatedAt(order.createdAt)}
                  </td>

                  <td className="px-4 py-5 text-center whitespace-nowrap text-xs">
                    {order.time || "-"}
                  </td>

                  <td className="px-4 py-5 text-center">
                    {order.orderType || "-"}
                  </td>

                  <td className="px-4 py-5 text-center whitespace-nowrap">
                    {order.phonnum || "-"}
                  </td>

                  <td className="px-4 py-5 text-center font-semibold">
                    £{order.total.toFixed(2)}
                  </td>

                  <td className="px-4 py-5 text-center">
                    <button
                      onClick={() => !order.status && handleStatus(order.id)}
                      disabled={order.status}
                      className={`px-4 py-1.5 rounded-md text-sm text-white transition ${
                        order.status
                          ? "bg-green-600 cursor-default"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {order.status ? "Done" : "Pending"}
                    </button>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <button
                      onClick={() =>
                        setOrderOpenDetails((prev) =>
                          prev === order.id ? null : order.id,
                        )
                      }
                      className={`hover:bg-gray-200 p-1 rounded-full transition-all duration-300 ${
                        orderOpenDetails === order.id ? "rotate-180" : ""
                      }`}
                    >
                      <GoChevronDown size={20} />
                    </button>
                  </td>
                </tr>
                {/* Order Details */}
                {orderOpenDetails === order.id && (
                  <tr>
                    <td colSpan={10} className="bg-gray-50 px-5 py-4">
                      <div className="bg-white border border-gray-300 rounded-xl p-5">
                        {/* Top Info */}
                        <div className="flex justify-between pb-3 mb-3 border-b border-gray-200">
                          <div className="px-2 py-1 background-styling">
                            <span className="font-medium text-gray-800">
                              Email:
                            </span>{" "}
                            <span className="text-gray-600">
                              {order.emailadd}
                            </span>
                          </div>

                          <div className="px-2 py-1 background-styling">
                            <span className="font-medium text-gray-800">
                              Post Code:
                            </span>{" "}
                            <span className="text-gray-600">
                              {order.postcode}
                            </span>
                          </div>

                          <div className="px-2 py-1 background-styling">
                            <span className="font-medium text-gray-800">
                              User Type:
                            </span>{" "}
                            <span className="text-gray-600">
                              {order.userType}
                            </span>
                          </div>
                        </div>

                        {/* Items Header */}

                        <div className="grid grid-cols-3 bg-blue-50 rounded-lg font-semibold text-gray-700">
                          <div className="px-5 py-3">Items</div>

                          <div className="px-5 py-3 text-center">Quantity</div>

                          <div className="px-5 py-3 text-right">Price</div>
                        </div>

                        {/* Items */}

                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                          >
                            <div className="px-5 py-3 font-medium text-[#5f5c5c]">
                              {item.name}
                            </div>

                            <div className="px-5 py-3 text-center text-gray-600">
                              x {item.qty}
                            </div>

                            <div className="px-5 py-3 text-right font-semibold text-green-600">
                              £{(item.price * item.qty).toFixed(2)}
                            </div>
                          </div>
                        ))}

                        {/* Footer */}

                        <div className="flex justify-between items-center px-5 py-4 mt-2 border-t border-gray-200 font-bold text-lg">
                          <span>Total</span>

                          <span className="text-green-600">
                            £{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="py-10 text-center text-gray-500">
                No Orders Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
