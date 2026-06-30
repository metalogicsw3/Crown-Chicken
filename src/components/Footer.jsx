'use client';
import Image from "next/image";
import Link from "next/link";
import { MdLocationOn } from "react-icons/md";
import { MdPhone } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { FaSquareInstagram, FaYoutube } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { MdFacebook } from "react-icons/md";
import { MdDeliveryDining } from "react-icons/md";
import { MdStorefront } from "react-icons/md";
import { MdPayment } from "react-icons/md";
import { MdSecurity } from "react-icons/md";

const Footer = () => {
    return (
        <footer className="bg-black text-white">
            {/* Main Footer */}
            <div className="max-w-8xl mx-auto px-12 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Section */}
                    <div>
                        <Link
                            href="/"
                            className="text-xl font-bold flex items-center gap-2 whitespace-nowrap"
                        >
                            <Image
                                src="/favicon.png"
                                alt="Crown Chicken Logo"
                                width={55}
                                height={40}
                                className="object-contain rounded-md"
                            />
                        <h2 className="text-2xl font-bold text-center">
                            Crown <span className="text-orange-500">Chicken</span>
                        </h2>
                        </Link>
                        <p className="text-gray-400 text-sm mb-4">
                            Serving delicious, high-quality chicken since 1995.
                            We're committed to providing the best food experience
                            with fresh ingredients and authentic recipes.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition">
                                <MdFacebook className="text-xl" />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition">
                                <FaSquareInstagram className="text-xl" />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition">
                                <FaXTwitter className="text-xl" />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-orange-500 transition">
                                <FaYoutube className="text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-orange-500">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Home</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Menu</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Contact</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-orange-500 transition">Careers</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-orange-500">Services</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2 text-gray-400">
                                <MdDeliveryDining className="text-orange-500" />
                                <span>Delivery</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <MdStorefront className="text-orange-500" />
                                <span>Takeaway</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <MdPayment className="text-orange-500" />
                                <span>Online Ordering</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <MdSecurity className="text-orange-500" />
                                <span>Secure Payments</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-orange-500">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MdLocationOn className="text-orange-500 text-xl mt-0.5" />
                                <span>123 Crown Street,<br />London, UK</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <MdPhone className="text-orange-500 text-xl" />
                                <span>+44 20 1234 5678</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <MdEmail className="text-orange-500 text-xl" />
                                <span>info@crownchicken.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <MdAccessTime className="text-orange-500 text-xl mt-0.5" />
                                <div>
                                    <div>Mon - Fri: 10:00 - 22:00</div>
                                    <div>Sat - Sun: 11:00 - 23:00</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-8xl mx-auto px-14 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <p>
                            &copy; {new Date().getFullYear()} Crown Chicken. All rights reserved.
                        </p>
                        <div className="flex gap-6 mt-2 md:mt-0">
                            <a href="#" className="hover:text-orange-500 transition">Privacy Policy</a>
                            <a href="#" className="hover:text-orange-500 transition">Terms of Service</a>
                            <a href="#" className="hover:text-orange-500 transition">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;