"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [navScrolled, setNavScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "ROOMS", href: "/rooms" },
    { name: "EVENTS & WEDDINGS", href: "/wedding" },
    { name: "DINING", href: "/dining" },
    { name: "GALLERY", href: "/gallery" },
    { name: "CONTACT US", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        navScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md text-gray-800 py-3 border-b border-gray-100"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white py-4"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative h-11 w-11 sm:h-12 sm:w-12 flex items-center justify-center">
            <Image
              src="/images/brand/logo.png"
              alt="Hotel Liyera Emblem"
              fill
              priority
              className="object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-serif tracking-[0.18em] text-base sm:text-lg font-bold uppercase leading-tight transition-colors ${
                navScrolled ? "text-gray-900 group-hover:text-yellow-600" : "text-white group-hover:text-yellow-400"
              }`}
            >
              HOTEL LIYERA
            </span>
            <span
              className={`text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-sans font-medium ${
                navScrolled ? "text-yellow-600" : "text-yellow-400"
              }`}
            >
              Resort & Spa
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <ul
          className={`hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider transition-colors ${
            navScrolled ? "text-gray-700" : "text-gray-100"
          }`}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`transition-colors py-1 relative ${
                    isActive
                      ? "text-yellow-500 font-bold"
                      : "hover:text-yellow-400"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Action Button & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/reservation"
            className="px-4 sm:px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-yellow-400 text-black hover:bg-yellow-500 transition shadow-sm"
          >
            RESERVE NOW
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 rounded-md transition ${
              navScrolled ? "text-gray-800 hover:bg-gray-100" : "text-white hover:bg-white/10"
            }`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white text-gray-900 border-t border-gray-100 px-6 py-5 shadow-2xl">
          <ul className="flex flex-col space-y-3.5 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-1 transition ${
                    pathname === link.href ? "text-yellow-600 font-semibold" : "text-gray-800 hover:text-yellow-600"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
