// src/app/Layout.js 

import Footer from "@/components/Footer";
import Navbar from "../components/Navbar";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

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
      <body className="bg-neutral-200">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
