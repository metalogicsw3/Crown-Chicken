// src/components/Popup.jsx
"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Popup() {
  const {  } = useCart();

  return (
    <div className="inset-0 w-full h-90 bg-neutral-200 text-center">
      <h1 className="text-2xl text-gray-400 hover:text-gray-500 inline-block">Dummy Page  </h1>
    </div>
  );
}