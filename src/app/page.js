//src/app/page.js
"use client";
import ItemsPage from "../components/ItemsPage";
import AddtoCart from "../components/AddtoCart";
import { useCart } from "@/context/CartContext";

export default function Home() {

  return (
    <div className="flex flex-col lg:flex-row  gap-5  px-5">
      <div className="flex-1 min-w-0">
        <ItemsPage />
      </div>

      <div className="w-full min-h-0 h-[90vh] lg:w-auto lg:shrink-0">
        <AddtoCart />
      </div>
    </div>
  );
}
