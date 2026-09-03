"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function DiningPage() {
  const experiences = [
    {
      title: "The Grand Bistro",
      image: "/images/amenities/gourmet-dining.jpg",
      cuisine: "Artisanal Contemporary & International Cuisine",
      timing: "Breakfast: 6:30 AM – 10:30 AM | Dinner: 6:30 PM – 11:00 PM",
      desc: "Delight in farm-fresh produce, coastal catches, and expertly curated multi-course menus prepared by master chefs in a sophisticated dining room.",
    },
    {
      title: "The Poolside Terrace & Lounge",
      image: "/images/amenities/infinity-pool.avif",
      cuisine: "Gourmet Small Plates, Artisanal Coolers & Sunsets",
      timing: "Open Daily: 10:00 AM – 10:00 PM",
      desc: "Unwind alongside the panoramic pool with refreshing handcrafted coolers, chilled beverages, afternoon tea service, and light wood-fired specialties.",
    },
    {
      title: "Private In-Suite Dining",
      image: "/images/amenities/luxury-suites.jpg",
      cuisine: "Bespoke 24-Hour Room Service Menu",
      timing: "Available 24 Hours Daily",
      desc: "Enjoy breakfast on your private balcony or an intimate candlelit dinner in the seclusion of your suite with dedicated white-glove table service.",
    },
  ];

  return (
    <main className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* ===== NAVBAR ===== */}
      <NavBar />

      {/* ===== PERFECT HERO ===== */}
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/images/amenities/gourmet-dining.jpg"
          alt="Gourmet Dining"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60 flex flex-col items-center justify-center text-center px-4" />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto flex flex-col items-center">
         
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-3 drop-shadow-xl tracking-wide"
          >
            Gourmet Dining
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-200 font-light max-w-xl mx-auto drop-shadow-md"
          >
            Artisanal flavors, organic ingredients, and world-class culinary artistry.
          </motion.p>
        </div>
      </section>

      {/* ===== EXPERIENCES ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 flex-1">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-yellow-600 font-semibold text-xs tracking-[0.2em] uppercase block mb-2">
            Gastronomy & Lounges
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
            Culinary Experiences
          </h2>
          <p className="text-gray-600 text-sm">
            Each restaurant and lounge blends fresh local produce with international culinary techniques.
          </p>
        </div>

        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
            className={`bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full md:w-1/2 relative min-h-[280px] md:min-h-[360px] overflow-hidden group">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <span className="text-yellow-600 font-semibold text-xs tracking-wider uppercase block mb-1">
                  {exp.cuisine}
                </span>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                  {exp.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {exp.desc}
                </p>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-xs text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{exp.timing}</span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-yellow-400 text-black font-semibold text-xs hover:bg-yellow-500 transition shadow-sm"
                >
                  Reserve a Table
                </Link>
                <span className="text-xs text-gray-400 font-medium">Casual Elegance Attire</span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ===== UNIFIED FOOTER ===== */}
      <Footer />
    </main>
  );
}
