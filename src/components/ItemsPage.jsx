"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Image as ImageIcon, Utensils, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const ItemsPage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
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
        <div className="w-full max-w-auto p-4 sm:p-6 lg:p-2 h-[93vh] overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 flex items-center gap-3 flex-wrap">
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
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat
                                    ? "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-md"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
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
                <div key={cat} className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="bg-linear-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                            {cat}
                        </span>
                        <span className="text-sm font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full">
                            {items.length}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {items.map((food) => (
                            /*--- Cards Section ---*/
                            <div
                                key={food.id}
                                className="flex flex-col justify-between h-55 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative h-48 sm:h-25 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
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
                                        <div className="absolute top-1 right-2 bg-white/80 backdrop-blur-sm px-1 py-1.5 rounded-lg shadow-md hover:bg-transparent ">
                                            <span className="text-xs font-bold text-gray-800  hover:font-semibold">
                                                £{Number(food.price).toFixed(2)}
                                            </span>
                                        </div>

                                    )}
                                </div>
                                <div className="px-3 py-2 ">
                                    <div className="flex justify-between items-center gap-2">
                                        <h3 className="text-md font-semibold text-gray-800 truncate">
                                            {food.name}
                                        </h3>
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 p-1 rounded-lg">
                                            <Utensils className="w-3 h-3" />
                                            {food.category || "Uncategorized"}
                                        </span>
                                    </div>
                                    <div className="pt-2 ">
                                        <button
                                            onClick={() => handleAddToCart(food)}
                                            className={`px-2 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${addedIds[food.id]
                                                ? "bg-green-500 text-white scale-95"
                                                : "bg-orange-500 hover:bg-orange-600 text-white"
                                                }`}
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            {addedIds[food.id] ? "Added!" : "Add to Cart"}
                                        </button>
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

export default ItemsPage;


