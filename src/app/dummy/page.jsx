// src/dummy/page.jsx 
"use client";
import { useState } from "react"
import CheckOut2 from "@/components/CheckOut2";

export default function DummyPage() {

    const [showPopup, setShowPopup] = useState(false)

    return (
        <div className="h-screen flex items-center justify-center">

            <button
                onClick={() => setShowPopup(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Open Popup
            </button>

            {showPopup && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center">

                        <div className="bg-white p-5 rounded">

                            {/* Yaha component render hoga */}
                            <CheckOut2 />

                            <button
                                onClick={() => setShowPopup(false)}
                                className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
        </div>
)}