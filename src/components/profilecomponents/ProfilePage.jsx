// src/components/ProfilePage.jsx
"use client";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { IoMdPerson, IoIosMail } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import { BsTelephoneFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { CgArrowRight } from "react-icons/cg";
import ProfilePopup from "./ProfilePopup";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { sendVerificationEmail } from "@/lib/auth";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumber } from "react-phone-number-input";


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
  const [popupType, setPopupType] = useState(null);

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

          let normalizedPhone = "";
          if (data.phone && data.phone.trim()) {
            const parsed = parsePhoneNumber(data.phone, "GB");
            normalizedPhone = parsed ? parsed.number : "";
          }

          const fetched = {
            name: data.name || " ",
            email: data.email || " ",
            address: data.address || " ",
            phone: normalizedPhone,
            emailVerified: data.emailVerified ?? false,
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

      // Phone Number Validation (international)
      if (!profile.phone || !isValidPhoneNumber(profile.phone)) {
        toast.error("Enter a valid phone number");
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        name: profile.name,
        email: profile.email,
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

  // Send Verfication
  const handleVerifyEmail = async () => {
    try {
      await sendVerificationEmail(auth.currentUser);
      toast.success("Verification email sent.");
    } catch (error) {
      toast.error(error.message);
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
    <div className="flex h-[93vh] justify-center items-center bg-gray-100 ">
      <div className="flex flex-col justify-center mx-auto gap-3 p-5 hover:shadow-xl max-w-xl border border-gray-300 rounded-lg">
        <div
          onClick={() => {
            router.replace("/");
          }}
          className="w-full flex justify-end py-2"
        >
          <button className="text-gray-400 flex gap-1 items-center  transform duration-200 hover:scale-110">
            <span>Back to Order Page</span>
            <CgArrowRight className="" size={21} />
          </button>
        </div>

        {/*Info Section */}
        <div className="flex gap-5 relative">
          <div className="border border-gray-400 rounded-full p-1 text-center">
            <span className="text-gray-600"> image</span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{savedProfile.name}</h2>

            <div className="flex items-center text-sm gap-1">
              <p className="text-gray-500 ">{savedProfile.email}</p>

              {profile.emailVerified ? (
                <RiVerifiedBadgeFill
                  className="text-blue-600"
                  size={16}
                  title="Verified Email"
                />
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="text-xs text-red-600 font-medium cursor-pointer hover:underline"
                >
                  Verify Email
                </button>
              )}
            </div>
          </div>
        </div>

        <hr className="text-gray-300" />

        {/*Edit  Section */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="py-2 grid gap-10 grid-cols-2"
        >
          <div className="space-y-1">
            <label className="flex text-sm text-blue-800 font-semibold items-center gap-1">
              Name
            </label>
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
            <label className="flex text-sm text-blue-800 font-semibold ">
              Email
            </label>
            <div className="relative">
              <IoIosMail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              />
              <input
                onChange={handleChange}
                onClick={() => setPopupType("email")}
                readOnly
                name="email"
                type="email"
                value={profile.email}
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex text-sm text-blue-800 font-semibold">
              Password
            </label>
            <div className="relative">
              <FaKey
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
              />
              <input
                onChange={handleChange}
                onClick={() => setPopupType("password")}
                readOnly
                type="password"
                value=""
                name="password"
                placeholder="********"
                className="w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex text-sm text-blue-800 font-semibold items-center gap-1">
              Address
            </label>
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
            <label className="flex text-sm text-blue-800 font-semibold items-center gap-1">
              Contact Number
            </label>
            <div className="">
              <PhoneInput
                international
                defaultCountry="GB"
                onChange={(value) =>
                  setProfile((prev) => ({ ...prev, phone: value || "" }))
                }
                onFocus={() => setIsEditingOpen(true)}
                readOnly={!isEditingOpen}
                name="phone"
                type="tel"
                value={profile.phone}
                placeholder="Enter phone number"
                className="phone-input-custom w-full hover:bg-gray-200 border border-gray-400 rounded-lg py-2 pl-4 pr-3 focus:border-blue-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full col-span-2 font-semibold bg-blue-900 text-white py-2 rounded-lg cursor-pointer hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
        {popupType && (
          <ProfilePopup
            type={popupType}
            onClose={() => setPopupType(null)}
            userEmail={savedProfile.email}
          />
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
