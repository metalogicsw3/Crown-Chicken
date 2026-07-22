"use client";
import { useEffect, useMemo, useRef, useState } from "react";
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

  // refs for scroll-spy
  const containerRef = useRef(null);
  const sectionRefs = useRef({});
  const mobileBtnRefs = useRef({});
  const desktopBtnRefs = useRef({});
  const isClickScrollingRef = useRef(false);
  const clickScrollTimeoutRef = useRef(null);

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

  const groupedFoods = useMemo(() => {
    return foods.reduce((acc, food) => {
      const cat = food.category || "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(food);
      return acc;
    }, {});
  }, [foods]);

  const categories = useMemo(
    () => Object.keys(groupedFoods).sort(),
    [groupedFoods],
  );

  // Default to the first category once foods are loaded
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Scroll-spy: watch category sections, auto-update the active sidebar item
  useEffect(() => {
    if (categories.length === 0 || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrollingRef.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const cat = visible[0].target.dataset.category;
          if (cat) setSelectedCategory(cat);
        }
      },
      {
        root: containerRef.current,
        rootMargin: "0px 0px -80% 0px",
        threshold: 0,
      },
    );

    categories.forEach((cat) => {
      const el = sectionRefs.current[cat];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  // Keep the active category button visible inside the sidebar / mobile strip
  useEffect(() => {
    if (!selectedCategory) return;
    mobileBtnRefs.current[selectedCategory]?.scrollIntoView({
      block: "nearest",
      inline: "center",
    });
    desktopBtnRefs.current[selectedCategory]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    isClickScrollingRef.current = true;

    sectionRefs.current[cat]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (clickScrollTimeoutRef.current)
      clearTimeout(clickScrollTimeoutRef.current);
    clickScrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 900);
  };

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
      <div className="w-full h-[93vh] flex flex-col items-center justify-center text-center py-20 bg-white">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          Our menu is being prepared
        </h3>
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
              ref={(el) => (mobileBtnRefs.current[cat] = el)}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
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
      <div className="hidden md:flex md:flex-col w-48 lg:w-56 shrink-0 border-r border-gray-100 overflow-y-auto px-1 py-5">
        <h2 className="px-5 text-lg font-bold text-gray-800 mb-3">Menu</h2>
        <nav className="flex flex-col">
          {categories.map((cat) => (
            <button
              key={cat}
              ref={(el) => (desktopBtnRefs.current[cat] = el)}
              onClick={() => handleCategoryClick(cat)}
              className={`text-left px-5 py-3 text-sm font-medium border-l-4 transition-colors ${
                selectedCategory === cat
                  ? "border-gray-500 rounded-md bg-gray-200 text-orange-600"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>

      {/* Center: all categories rendered together, scroll-spy keeps sidebar in sync */}
      <div
        ref={containerRef}
        className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 py-5"
      >
        {categories.map((cat) => (
          <div
            key={cat}
            ref={(el) => (sectionRefs.current[cat] = el)}
            data-category={cat}
            className="mb-10 scroll-mt-2"
          >
            <div className="flex items-center gap-2 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">
                <span className="bg-linear-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                  {cat}
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 ">
              {groupedFoods[cat].map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between gap-3 py-4 px-2 border-b border-gray-300 hover:shadow-md hover:rounded-lg hover:bg-gray-50"
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
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                      addedIds[food.id]
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;
