"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import AddItems from "./AddItems";
import Orders from "./Orders";
import Users from "./Users";
import Revenue from "./Revenue";

const AdminDashboard = () => {

  const [activeTab, setActiveTab] = useState("add-items");

  return (
    <div>
      <div className="flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 p-2">
          {activeTab === "add-items" && <AddItems />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "users" && <Users />}
          {activeTab === "revenue" && <Revenue />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
