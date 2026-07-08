// src/components/Popup.jsx

"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Popup() {
  const [popupOpen, setPopupOpen] = useState(false)
  const { userOpen, setUserOpen } = useCart();

  return (
    <div className="inset-0 w-full h-90 bg-black/50 mx-auto justify-around">
      <button className="px-4 py-2 bg-blue-400 rounded-lg text-white hover:cursor-pointer"
        onClick={() => {
          setPopupOpen(true);
          setUserOpen(!false)
        }}>
        Show data </button>
      {popupOpen === true ?
        (<div> PopUp open on Dummy Page Button </div>) :
        userOpen === true ?
          (<div>
            PopUp open on Navbar Button
          </div>) :
          (() => setPopupOpen(true))
      }
    </div>
  );
}