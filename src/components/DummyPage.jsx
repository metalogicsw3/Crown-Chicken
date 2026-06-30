"use client";
import React from 'react'
import { 
  MdCode, 
  MdHome, 
  MdRestaurantMenu, 
  MdShoppingCart,
  MdContentCopy,
  MdCheckCircle
} from "react-icons/md";

const DummyPage = () => {
  const [copied, setCopied] = React.useState(null);

  const copyToClipboard = (code, name) => {
    navigator.clipboard.writeText(code);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeSections = [
    {
      id: 'home',
      icon: MdHome,
      title: 'Home Page',
      description: 'Main layout combining menu and cart',
      code: `"use client";
import { useState } from "react";
import ItemsPage from "../components/ItemsPage";
import AddtoCart from "../components/AddtoCart";

export default function Home() {
  const [cartItems, setCartItems] = useState([]);

  const handleUpdateCart = (updatedCart) => {
    setCartItems(updatedCart);
  };

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  return (
    <div className="flex flex-col px-4 md:px-20 py-10">
      <ItemsPage addToCart={addToCart} />
      <AddtoCart
        cartItems={cartItems}
        onUpdateCart={handleUpdateCart}
      />
    </div>
  );
}`
    },
    {
      id: 'items',
      icon: MdRestaurantMenu,
      title: 'Items Page',
      description: 'Displays menu items with category filtering',
      code: `"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Image as ImageIcon, Utensils, Plus } from "lucide-react";

const ItemsPage = ({ addToCart }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "foods"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFoods(data);
      } catch (err) {
        console.error("Failed to load items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const groupedFoods = foods.reduce((acc, food) => {
    const cat = food.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(food);
    return acc;
  }, {});

  const categories = ["All", ...Object.keys(groupedFoods).sort()];
  
  const filteredFoods = selectedCategory === "All" 
    ? foods 
    : foods.filter(food => (food.category || "Uncategorized") === selectedCategory);

  const filteredGroupedFoods = filteredFoods.reduce((acc, food) => {
    const cat = food.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(food);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading our delicious menu...</span>
        </div>
      </div>
    );
  }

  if (foods.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Our menu is being prepared</h3>
        <p className="text-gray-500">Check back soon for delicious items!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl py-8 md:pr-96">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <span className="bg-linear-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            Our Menu
          </span>
          <span className="text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            {foods.length} items
          </span>
        </h1>
        <p className="text-gray-500 mt-1">Discover our delicious selection</p>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={\`px-4 py-2 rounded-lg text-sm font-medium transition-all \${
                  selectedCategory === cat
                    ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }\`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-xs opacity-75">
                    ({groupedFoods[cat]?.length || 0})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Grid */}
      {Object.entries(filteredGroupedFoods).map(([cat, items]) => (
        <div key={cat} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-linear-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
              {cat}
            </span>
            <span className="text-sm font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((food) => (
              <div 
                key={food.id} 
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-52 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
                  {food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                  {food.price && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                      <span className="text-sm font-bold text-gray-800">
                        £{Number(food.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => addToCart(food)}
                    className="absolute bottom-3 right-3 bg-linear-to-r from-orange-500 to-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {food.name}
                  </h3>
                  {food.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {food.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      <Utensils className="w-3 h-3" />
                      {food.category || "Uncategorized"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredFoods.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No items in this category</h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default ItemsPage;`
    },
    {
      id: 'cart',
      icon: MdShoppingCart,
      title: 'Add to Cart',
      description: 'Floating cart sidebar with delivery options',
      code: `'use client';
import { useState, useEffect } from "react";
import {
  MdChevronRight,
  MdDeliveryDining,
  MdStorefront,
  MdRemove,
  MdAdd,
  MdDeleteOutline,
  MdShoppingCart,
  MdAccessTime,
  MdCalendarToday,
  MdClose
} from "react-icons/md";

const AddtoCart = ({ cartItems: propCartItems = [], onUpdateCart }) => {
  const [cartItems, setCartItems] = useState(propCartItems);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (propCartItems) {
      setCartItems(propCartItems);
    }
  }, [propCartItems]);

  const updateQuantity = (id, change) => {
    const updated = cartItems.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updated);
    if (onUpdateCart) onUpdateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    if (onUpdateCart) onUpdateCart(updated);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === "delivery" ? 10 : 0;
  const serviceFee = 1;
  const total = subtotal + deliveryFee + serviceFee;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const CartButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 z-40 bg-linear-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 md:hidden"
    >
      <div className="relative">
        <MdShoppingCart className="text-2xl" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
    </button>
  );

  const CartContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MdShoppingCart className="text-orange-500" />
          Your Cart
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {totalItems} items
          </span>
        </h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-500 hover:text-gray-700"
        >
          <MdClose className="text-2xl" />
        </button>
      </div>

      {/* Delivery Options */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={() => setDeliveryMethod("delivery")}
            className={\`flex-1 px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm \${
              deliveryMethod === "delivery"
                ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }\`}
          >
            <MdDeliveryDining className="text-lg" />
            <div className="text-left">
              <div className="font-medium text-xs">Delivery</div>
              <div className={\`text-[10px] \${deliveryMethod === "delivery" ? "text-orange-100" : "text-gray-400"}\`}>
                £10 minimum
              </div>
            </div>
          </button>
          <button
            onClick={() => setDeliveryMethod("pickup")}
            className={\`flex-1 px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm \${
              deliveryMethod === "pickup"
                ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }\`}
          >
            <MdStorefront className="text-lg" />
            <div className="text-left">
              <div className="font-medium text-xs">Pickup</div>
              <div className={\`text-[10px] \${deliveryMethod === "pickup" ? "text-orange-100" : "text-gray-400"}\`}>
                £6 minimum
              </div>
            </div>
          </button>
        </div>

        {/* Time Slot */}
        <div className="flex items-center justify-between mt-3 bg-white px-3 py-2 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center gap-1">
              <MdCalendarToday className="text-orange-500 text-sm" />
              <span className="text-xs font-medium">Today</span>
            </div>
            <div className="flex items-center gap-1">
              <MdAccessTime className="text-orange-500 text-sm" />
              <span className="text-xs font-medium">11:00 - 11:30</span>
            </div>
          </div>
          <MdChevronRight className="text-gray-400 cursor-pointer hover:text-orange-500 transition" />
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-gray-500 text-sm">Your cart is empty</p>
            <p className="text-gray-400 text-xs mt-1">Add items from our menu!</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
            >
              {/* Image */}
              <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <MdShoppingCart className="text-xl" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h4>
                <p className="text-orange-600 font-medium text-sm">£{item.price.toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1 py-0.5">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 hover:bg-gray-100 rounded transition text-gray-600 hover:text-orange-600"
                >
                  <MdRemove className="text-sm" />
                </button>
                <span className="w-6 text-center font-medium text-gray-700 text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 hover:bg-gray-100 rounded transition text-gray-600 hover:text-orange-600"
                >
                  <MdAdd className="text-sm" />
                </button>
              </div>

              {/* Item Total & Delete */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 text-sm">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-600 transition p-1"
                >
                  <MdDeleteOutline className="text-lg" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>£{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Service Fee</span>
              <span>£{serviceFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-base font-bold text-gray-800">
                <span>Total</span>
                <span className="bg-linear-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>

            <button className="w-full mt-3 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2">
              <span>Proceed to Checkout</span>
              <MdChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <CartButton />
      <div className="hidden md:block fixed right-0 top-0 rounded-lg h-screen w-96 bg-white shadow-2xl border-l border-gray-200 z-30">
        <CartContent />
      </div>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl shadow-2xl z-50 md:hidden flex flex-col">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 shrink-0" />
            <CartContent />
          </div>
        </>
      )}
    </>
  );
};

export default AddtoCart;`
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MdCode className="text-4xl text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              <span className="bg-linear-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                Code Documentation
              </span>
            </h1>
          </div>
          <p className="text-gray-500 ml-1">
            Complete component code for your food ordering system
          </p>
        </div>

        {/* Code Sections */}
        <div className="space-y-6">
          {codeSections.map((section) => {
            const Icon = section.icon;
            return (
              <div 
                key={section.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                      <Icon className="text-2xl text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {section.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(section.code, section.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
                  >
                    {copied === section.id ? (
                      <>
                        <MdCheckCircle className="text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <MdContentCopy />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                {/* Code Display */}
                <div className="relative">
                  <div className="absolute top-3 left-4 flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <pre className="p-6 pt-10 overflow-x-auto bg-gray-900 text-gray-100 text-sm leading-relaxed">
                    <code className="font-mono">
                      {section.code}
                    </code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-white rounded-xl shadow-md border border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            💡 These components work together to create a complete food ordering experience.
            The cart is sticky on desktop and slides up on mobile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DummyPage;