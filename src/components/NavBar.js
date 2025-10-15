"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        navScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between p-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Image
            src="/assets/image-removebg-preview.png"
            alt="Hotel Liyera Logo"
            width={120}
            height={60}
            priority
          />
        </div>

        {/* Links */}
        <ul
          className={`hidden md:flex items-center space-x-6 font-medium transition-colors ${
            navScrolled ? "text-gray-800" : "text-white"
          }`}
        >
          <li>
            <a href="/" className="hover:text-yellow-400 text-sm transition">
              HOME
            </a>
          </li>
          <li>
            <a href="/rooms" className="hover:text-yellow-400 text-sm transition">
              ROOMS
            </a>
          </li>
          <li>
            <a href="/wedding" className="hover:text-yellow-400 text-sm transition">
              EVENTS & WEDDINGS
            </a>
          </li>
          <li>
            <a href="#testimonials" className="hover:text-yellow-400 text-sm transition">
              REVIEWS
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-yellow-400 text-sm transition">
              CONTACT US
            </a>
          </li>
        </ul>

        {/* Button */}
        <a
          href="/reservation"
          className="px-4 py-2 rounded-md text-sm font-semibold bg-yellow-400 text-black hover:bg-yellow-500 transition"
        >
          RESERVE NOW
        </a>
      </nav>
    </header>
  );
}
