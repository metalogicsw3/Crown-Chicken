// src/components/profilecompnents/ProfilePopuo.jsx
"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { changeEmail, changePassword } from "@/lib/auth";
import { IoClose } from "react-icons/io5";
import ForgotPassword from "../ForgotPassword";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ProfilePopup = ({ type, onClose }) => {
  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleEmailChange = async () => {
    try {
      await changeEmail(currentPasswordForEmail, newEmail);
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        email: newEmail,
      });
      toast.success(
        "Verification link has been sent to the new email address.",
      );
      setNewEmail("");
      setCurrentPasswordForEmail("");
      onClose();
    } catch (error) {
      toast.error("Password is incorrect, or the email is already in use.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!...");
      setCurrentPassword("");
      setNewPassword("");
      onClose();
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          toast.error("Current password is incorrect.");
          break;

        case "auth/email-already-in-use":
          toast.error("This email is already in use.");
          break;

        case "auth/invalid-email":
          toast.error("Please enter a valid email.");
          break;

        default:
          toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-full max-w-sm relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={22} />
        </button>

        {showForgotPassword ? (
          <ForgotPassword setView={() => setShowForgotPassword(false)} />
        ) : (
          <>
            {type === "email" && (
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-800">Change Email</h3>
                <input
                  type="email"
                  placeholder="New Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg py-2 px-3"
                />
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPasswordForEmail}
                  onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                  autoComplete="new-password"
                  className="w-full border border-gray-400 rounded-lg py-2 px-3"
                />
                <button
                  type="button"
                  onClick={handleEmailChange}
                  className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
                >
                  Update Email
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-700 underline block"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {type === "password" && (
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-800">Change Password</h3>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full border border-gray-400 rounded-lg py-2 px-3"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full border border-gray-400 rounded-lg py-2 px-3"
                />
                <button
                  type="button"
                  onClick={handlePasswordChange}
                  className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-700 underline block"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePopup;
