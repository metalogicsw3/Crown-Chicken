"use client";
import { useCart } from "@/context/CartContext";

const TimeSlot = () => {
  const {
    timeDropdownOpen,
    setTimeDropdownOpen,
    selectedTime,
    setSelectedTime,
    timeSlots,
  } = useCart();

  return (
    <div
      className={`absolute left-0 top-full mt-2 w-full bg-white rounded-lg border border-gray-300 shadow-xl z-40 origin-top overflow-hidden transition-all duration-300 ease-in-out
                  ${
                    timeDropdownOpen
                      ? "opacity-100 translate-y-0 scale-100 visible"
                      : "opacity-0 -translate-y-2 scale-95 invisible pointer-events-none"
                  }`}
    >
      <div className="max-h-60 w-full overflow-y-auto">
        {timeSlots.length === 0 ? (
          <div className="px-4 py-3 text-center text-red-500 font-medium">
            Closed
          </div>
        ) : (
          timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => {
                setSelectedTime(slot);
                setTimeDropdownOpen(false);
              }}
              className={`w-full px-2 py-2 text-left text-sm transition-colors duration-200
                        ${
                          selectedTime === slot
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 rounded-lg hover:bg-gray-100"
                        }`}
            >
              {slot}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TimeSlot;
