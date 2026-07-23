"use client";

import { useState } from "react";
import { UtensilsCrossed, ClipboardList, Users } from "lucide-react";
import { FaMoneyBill1Wave } from "react-icons/fa6";

// Css Classes For Buttons
const baseClass =
  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition";

const activeClass = "bg-gray-500 text-white shadow-md";

const inactiveClass = "text-gray-600 font-semibold hover:bg-gray-100 hover:text-neutral-500";

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="px-10 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Crown Chicken</h2>

        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>

      {/* Menu */}
      <div className="p-4 space-y-2">
        {/* Add Items */}
        <button
          onClick={() => setActiveTab("add-items")}
          className={`${baseClass} ${
            activeTab === "add-items" ? activeClass : inactiveClass
          }`}
        >
          <UtensilsCrossed className="w-5 h-5" />
          Add Items
        </button>

        {/* Orders */}
        <button
          onClick={() => setActiveTab("orders")}
          className={`${baseClass} ${
            activeTab === "orders" ? activeClass : inactiveClass
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          Orders
        </button>

        {/* Users */}
        <button
          onClick={() => setActiveTab("users")}
          className={`${baseClass} ${
            activeTab === "users" ? activeClass : inactiveClass
          }`}
        >
          <Users className="w-5 h-5" />
          Users
        </button>

        {/* Users */}
        <button
          onClick={() => setActiveTab("revenue")}
          className={`${baseClass} ${
            activeTab === "revenue" ? activeClass : inactiveClass
          }`}
        >
          <FaMoneyBill1Wave className="w-5 h-5" />
          Revenue
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
