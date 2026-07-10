'use client';

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch User Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          setProfile(snap.data());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Update Profile
  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        name: profile.name,
        email: profile.email,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[88vh]">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-[88vh] bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-lg border p-6">

        <h2 className="text-2xl font-bold text-center mb-6">
          My Profile
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            Name
          </label>

          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
              isEditing
                ? "border-blue-500 focus:ring-2 focus:ring-blue-300"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
              isEditing
                ? "border-blue-500 focus:ring-2 focus:ring-blue-300"
                : "bg-gray-100 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Buttons */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="flex-1 rounded-lg bg-green-600 py-2 text-white font-semibold hover:bg-green-700 transition"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 rounded-lg bg-gray-500 py-2 text-white font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;