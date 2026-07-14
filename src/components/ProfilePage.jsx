// src/components/ProfilePage.jsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { IoMdPerson, IoIosMail } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { BsTelephoneFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { CgArrowRight } from "react-icons/cg";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [savedProfile, setSavedProfile] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditingOpen, setIsEditingOpen] = useState(false);

  const router = useRouter();

  // Fetch User Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          const data = snap.data();
          const fetched = {
            name: data.name || " ",
            email: data.email || " ",
            address: data.address || " ",
            phone: data.phone || " ",
          };
          setProfile((prev) => ({ ...prev, ...fetched }));
          setSavedProfile((prev) => ({ ...prev, ...fetched }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [router]);

  // Handle Input Change
  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Update Profile
  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        name: profile.name,
        address: profile.address,
        phone: profile.phone,
      });

      setSavedProfile(profile);
      toast.success("Profile updated successfully!");
      setIsEditingOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[88vh]">
        <p className="text-2xl font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[90vh] justify-center items-center bg-gray-100 ">
      <div className="flex flex-col justify-center mx-auto gap-3 p-5 hover:shadow-xl max-w-xl border border-gray-300 rounded-lg">
        <div
          onClick={() => {
            router.replace("/");
          }}
          className="w-full flex justify-end py-2"
        >
          <button className="text-gray-400 transform duration-200 hover:scale-110">
            <CgArrowRight className="" size={21} />
          </button>
        </div>

        {/*Info Section */}
        <div className="flex gap-3 relative">
          <div className="border border-gray-400 rounded-full p-1 text-center">
            <span className="text-gray-600"> image</span>
          </div>
          <div className="">
            <h2 className="text-2xl font-semibold">{savedProfile.name}</h2>
            <p className="text-gray-500 text-sm">{savedProfile.email}</p>
          </div>
        </div>

        <hr className="text-gray-300" />

        {/*Edit  Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="py-2 grid gap-8 grid-cols-2"
        >
          <div className="space-y-1">
            <label className="flex items-center gap-1">Name</label>
            <div className="relative">
              <IoMdPerson
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              />
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                onFocus={() => setIsEditingOpen(true)}
                readOnly={!isEditingOpen}
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1">Email</label>
            <div className="relative">
              <IoIosMail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              />
              <input
                type="email"
                value={savedProfile.email}
                disabled
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1">Password</label>
            <div className="relative">
              <FaKey
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              />
              <input
                type="password"
                value="••••••••"
                disabled
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1">Address</label>
            <div className="relative">
              <SiGooglemaps
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              />
              <input
                onChange={handleChange}
                onFocus={() => setIsEditingOpen(true)}
                readOnly={!isEditingOpen}
                name="address"
                type="text"
                value={profile.address}
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center gap-1">Contact Number</label>
            <div className="relative">
              <BsTelephoneFill
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              />
              <input
                onChange={handleChange}
                onFocus={() => setIsEditingOpen(true)}
                readOnly={!isEditingOpen}
                name="phone"
                type="text"
                value={profile.phone}
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
              />
            </div>
            {/* Abu Bakar ki purzoor farmaish par add kia ha */}
            {/* <textarea name="information" className="text-xs border border-gray-400 mt-5 rounded-lg w-full h-40" placeholder="User GirlFriend Information" id=""></textarea> */}
          </div>
          <button
            type="submit"
            className="w-full col-span-2 font-semibold bg-blue-900 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};
export default ProfilePage;





