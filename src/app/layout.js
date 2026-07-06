// src/app/Layout.js

import Footer from "@/components/Footer";
import Navbar from "../components/Navbar";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  icons: {
    icon: "./favicon2.png",
  },
  title: "Crown Chicken",
  description: "Next.js Firebase CRUD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral-200 w-auto">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              containerClassName=""
              containerStyle={{}}
              toastOptions={{
                // Default options for all toasts
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                  padding: "16px",
                  borderRadius: "8px",
                },
                // Custom styles for different types
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#FFFFFF",
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#FFFFFF",
                  },
                },
              }}
            />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
