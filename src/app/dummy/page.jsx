"use client";

import { useCart } from "@/context/CartContext";

export default function DummyPage() {
  const { items } = useCart();

  return (
    <div className=" flex text-center items-center justify-center text-2xl w-48">
        Dummy Page
    </div>
  );
}