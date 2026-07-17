"use client";

import { useCart } from "@/context/CartContext";

const DateSlot = () => {
  const {
    dateDropdownOpen,
    setDateDropdownOpen,
    selectedDate,
    setSelectedDate,
    dateSlots,
  } = useCart();

  return (
    <div
      className={`absolute left-0 top-full mt-2 w-full bg-white rounded-lg border border-gray-300 shadow-xl z-40 origin-top overflow-hidden transition-all duration-300 ease-in-out
      ${
        dateDropdownOpen
          ? "opacity-100 translate-y-0 scale-100 visible"
          : "opacity-0 -translate-y-2 scale-95 invisible pointer-events-none"
      }`}
    >
      <div className="max-h-60 overflow-y-auto">
        {dateSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => {
              setSelectedDate(slot);
              setDateDropdownOpen(false);
            }}
            className={`w-full px-2 py-2 text-left text-sm transition-colors duration-200
              ${
                selectedDate === slot
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSlot;
