// src/components/ProfilePage.jsx
'use client';

import { useCart } from "@/context/CartContext";

const ProfilePage = () => {
  const { closePopup } = useCart();
  return (
    <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6">
      
      <div className="flex items-center gap-4 border-b pb-4">
        <img
          src="https://i.pravatar.cc/100"
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Rao Zaheer
          </h2>
          <p className="text-gray-500">zaheer@gmail.com</p>
          <span className="inline-block mt-2 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
            Active User
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">Phone</span>
          <span className="font-medium">+92 300 1234567</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Address</span>
          <span className="font-medium">Lahore, Pakistan</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Orders</span>
          <span className="font-medium">12</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Member Since</span>
          <span className="font-medium">Jan 2026</span>
        </div>
      </div>

      <button className="w-full mt-6 py-3 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfilePage;