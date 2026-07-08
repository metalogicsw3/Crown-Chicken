'use client';
import { useCart } from "@/context/CartContext";
import { RxCross1 } from "react-icons/rx";

const CloseComp = () => {
    const {closePopup} = useCart();
  return (
    <div>
      <RxCross1 size={24} className="text-gray-400 hover:text-red-500 transition cursor-pointer" 
      onClick={closePopup}/>
    </div>
  )
}

export default CloseComp
