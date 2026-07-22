"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const ItemsPage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [addedIds, setAddedIds] = useState({});
    const { addToCart } = useCart();

    const handleAddToCart = async (food) => {
        await addToCart(food, 1);
        setAddedIds((prev) => ({ ...prev, [food.id]: true }));
        setTimeout(() => {
            setAddedIds((prev) => ({ ...prev, [food.id]: false }));
        }, 1500);
    };

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

    const categories = Object.keys(groupedFoods).sort();

    // Default to the first category once foods are loaded
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    const activeItems = groupedFoods[selectedCategory] || [];

    if (loading) {
        return (
            <div className="h-[90vh] flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-2xl">Loading our delicious menu...</span>
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
        <div className="w-full h-[93vh] flex flex-col md:flex-row bg-white overflow-hidden">
            {/* Mobile: horizontal category strip (below md) */}
            <div className="md:hidden border-b border-gray-900 overflow-x-auto">
                <div className="flex gap-2 px-4 py-3 w-max">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                ? "bg-gray-400 text-white shadow-md"
                                : "bg-white text-gray-600 border border-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop: left vertical sidebar (md and up) */}
            <div className="hidden md:flex md:flex-col w-48 lg:w-56 shrink-0 border-r border-gray-100 overflow-y-auto py-5">
                <h2 className="px-5 text-lg font-bold text-gray-800 mb-3">Menu</h2>
                <nav className="flex flex-col">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`text-left px-5 py-3 text-sm font-medium border-l-4 transition-colors ${selectedCategory === cat
                                ? "border-gray-500 rounded-md bg-gray-200 text-orange-600"
                                : "border-transparent text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Center: items list for the selected category */}
            <div className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 py-5">
                <div className="flex items-center gap-2 mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">
                        <span className="bg-linear-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                            {selectedCategory}
                        </span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    {activeItems.map((food) => (
                        <div
                            key={food.id}
                            className="flex items-center justify-between gap-3 pb-4 border-b border-gray-300"
                        >
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                    {food.name}
                                </h3>
                                {food.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {food.description}
                                    </p>
                                )}
                            </div>

                            {food.price && (
                                <p className="text-sm font-bold text-gray-800 shrink-0">
                                    £{Number(food.price).toFixed(2)}
                                </p>
                            )}

                            <button
                                onClick={() => handleAddToCart(food)}
                                className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${addedIds[food.id]
                                    ? "bg-green-500 border-green-500 text-white scale-95"
                                    : "bg-white border-gray-300 text-gray-500 hover:border-orange-500 hover:text-orange-500"
                                    }`}
                            >
                                {addedIds[food.id] ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {activeItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No items in this category</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemsPage;