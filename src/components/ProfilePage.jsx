"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { IoMdPerson,IoIosMail } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";

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
    <div className="flex bg-gray-100 p-5">
      <div className="w-full space-y-3">
        {/*Info Section */}
        <div className="flex gap-3 ">
          <div className="border border-gray-400 rounded-full p-1 text-center">
            <span className="text-gray-600"> image</span> 
          </div>
          <div className="">
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
          </div>
        </div>

      <hr className="text-gray-300" />

        {/*Edit  Section */}
        <form className="py-2 grid gap-8 grid-cols-2">

          <div className="space-y-1">
            <label className="flex items-center gap-1">
              <IoMdPerson size={18} className="text-blue-700" />
              Name
            </label>
            <div className="relative">
              <IoMdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
              <input
               onChange={() => {}}
                type="text"
                value={profile.name}
                className="w-full border border-gray-400 rounded-lg py-2 pl-10 pr-3"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1">
              <IoIosMail size={18} className="text-blue-700" />
              Email
            </label>
            <div className="relative">
              <IoIosMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
              <input
               onChange={() => {}}
                type="text"
                value={profile.email}
                className="w-full border border-gray-400 rounded-lg py-2 pl-10 pr-3"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1">
              <FaKey size={18} className="text-blue-700" />
              Password
            </label>
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
              <input
               onChange={() => {}}
                type="text"
                value={profile.name}
                className="w-full border border-gray-400 rounded-lg py-2 pl-10 pr-3"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1">
              <SiGooglemaps size={18} className="text-blue-700" />
              Address
            </label>
            <div className="relative">
              <SiGooglemaps className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
              <input
               onChange={() => {}}
                type="text"
                value={profile.name}
                className="w-full border border-gray-400 rounded-lg py-2 pl-10 pr-3"
              />
            </div>
          </div>
          <button type="submit" className="w-full col-span-2 font-semibold bg-blue-700 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-800">Update Profile</button>
        </form>
      </div>
    </div>
  );
};
export default ProfilePage;
