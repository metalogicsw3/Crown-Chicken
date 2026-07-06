"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { isAdmin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Image as ImageIcon,
    Loader2,
    FolderPlus,
    Tag
} from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [foods, setFoods] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        image: null,
    });
    const [editingId, setEditingId] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    const fetchFoods = async () => {
        const querySnapshot = await getDocs(collection(db, "foods"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFoods(data);
    };

    const fetchCategories = async () => {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const list = querySnapshot.docs.map((d) => d.id);
        setCategories(list.sort());
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (!user) {
                    router.push("/");
                    return;
                }
                const admin = await isAdmin(user.uid);
                if (!admin) {
                    router.push("/");
                    return;
                }
                await fetchFoods();
                await fetchCategories();
                setLoading(false);
            } catch (error) {
                console.error(error);
                router.push("/");
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (categories.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: categories[0] }));
        }
    }, [categories]);

    const handleAddCategory = async () => {
        const trimmed = newCategory.trim();
        if (!trimmed) return;

        const alreadyExists = categories.some(
            (c) => c.toLowerCase() === trimmed.toLowerCase()
        );
        if (alreadyExists) {
            alert("That category already exists.");
            return;
        }

        await setDoc(doc(db, "categories", trimmed), { name: trimmed });
        setCategories((prev) => [...prev, trimmed].sort());
        setFormData(prev => ({ ...prev, category: trimmed }));
        setNewCategory("");
    };

    const handleRemoveCategory = async (catName) => {
        const ok = window.confirm(
            `Remove "${catName}"? Foods already using it will keep showing this name, it just won't be selectable anymore.`
        );
        if (!ok) return;

        await deleteDoc(doc(db, "categories", catName));
        const updated = categories.filter((c) => c !== catName);
        setCategories(updated);
        if (formData.category === catName) {
            setFormData(prev => ({ ...prev, category: updated[0] || "" }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) {
            alert("Please add or select a category first.");
            return;
        }

        setSubmitting(true);
        let imageUrl = existingImageUrl;

        if (formData.image) {
            try {
                const imageRef = ref(storage, `foods/${Date.now()}-${formData.image.name}`);
                await uploadBytes(imageRef, formData.image);
                imageUrl = await getDownloadURL(imageRef);
            } catch (uploadErr) {
                console.error("Image upload failed:", uploadErr);
                alert(
                    "Image upload failed. Saving the item without an image."
                );
                imageUrl = existingImageUrl;
            }
        }

        try {
            const priceNumber = Number(formData.price) || 0;

            if (editingId) {
                const foodRef = doc(db, "foods", editingId);
                await updateDoc(foodRef, {
                    name: formData.name,
                    price: priceNumber,
                    category: formData.category,
                    imageUrl
                });
                setEditingId(null);
            } else {
                await addDoc(collection(db, "foods"), {
                    name: formData.name,
                    price: priceNumber,
                    category: formData.category,
                    imageUrl
                });
            }

            setFormData({ name: "", price: "", category: formData.category, image: null });
            setExistingImageUrl("");
            setPreviewImage(null);
            await fetchFoods();
        } catch (err) {
            console.error("Failed to save food:", err);
            alert("Couldn't save this item — check the console for details.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        await deleteDoc(doc(db, "foods", id));
        await fetchFoods();
    };

    const handleEdit = (food) => {
        setFormData({
            name: food.name,
            price: food.price,
            category: food.category || "",
            image: null,
        });
        setEditingId(food.id);
        setExistingImageUrl(food.imageUrl || "");
        setPreviewImage(food.imageUrl || null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ name: "", price: "", category: formData.category, image: null });
        setExistingImageUrl("");
        setPreviewImage(null);
    };

    const groupedFoods = foods.reduce((acc, food) => {
        const cat = food.category || "Uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(food);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center gap-3 text-gray-600">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <span className="bg-linear-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            Dashboard
                        </span>
                        <span className="text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                            {foods.length} items
                        </span>
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your food menu and categories</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Food Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Food Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Margherita Pizza"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                >
                                    {categories.length === 0 && <option value="">No categories</option>}
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                    className="w-full border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    required
                                />
                            </div>

                            {/* Action Button */}
                            <div className="flex items-end gap-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full px-6 py-2.5 rounded-xl text-white font-medium transition flex items-center justify-center gap-2 ${editingId
                                            ? "bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                                            : "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {submitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : editingId ? (
                                        <>
                                            <Pencil className="w-4 h-4" />
                                            Update
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Add Item
                                        </>
                                    )}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition font-medium"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Food Image
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                                />
                                {previewImage && (
                                    <div className="relative w-16 h-16 shrink-0">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                setFormData(prev => ({ ...prev, image: null }));
                                                setExistingImageUrl("");
                                            }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>

                    {/* Category Management */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Manage Categories</span>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            <div className="flex gap-2 flex-1 min-w-50">
                                <input
                                    type="text"
                                    placeholder="New category name"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="flex-1 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-sm font-medium"
                                >
                                    <FolderPlus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <span
                                        key={cat}
                                        className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {cat}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCategory(cat)}
                                            className="text-gray-400 hover:text-red-600 transition"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                                {categories.length === 0 && (
                                    <span className="text-sm text-gray-400">No categories yet.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                {Object.entries(groupedFoods).map(([cat, items]) => (
                    <div key={cat} className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                                {cat}
                            </span>
                            <span className="text-sm font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full">
                                {items.length}
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((food) => (
                                <div
                                    key={food.id}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                                >
                                    <div className="relative h-48 bg-gray-100">
                                        {food.imageUrl ? (
                                            <img
                                                src={food.imageUrl}
                                                alt={food.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                                                <ImageIcon className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                                            {food.name}
                                        </h3>
                                        <p className="text-xl font-bold text-blue-600 mt-1">
                                            ${Number(food.price).toFixed(2)}
                                        </p>
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => handleEdit(food)}
                                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition flex items-center justify-center gap-1 text-sm font-medium"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(food.id)}
                                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition flex items-center justify-center gap-1 text-sm font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {foods.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No items yet</h3>
                        <p className="text-gray-500">Start adding your delicious menu items above!</p>
                    </div>
                )}
            </div>
        </div>
    );
}