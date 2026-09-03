"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function RoomsPage() {
  const rooms = [
    {
      id: "presidential-suite",
      name: "Presidential Suite",
      image: "/images/rooms/presidential-suite.webp",
      desc: "The pinnacle of architectural grandeur. Expansive living area, panoramic terrace, and dedicated butler service for an unforgettable stay.",
      features: [
        "Room size: 120 m² with private terrace",
        "Panoramic ocean & skyline views",
        "King-sized bed with Egyptian cotton linens",
        "Whirlpool spa tub & rainfall shower",
        "Dedicated 24/7 butler service",
        "Exclusive private lounge privileges",
      ],
      price: "$290 per night*",
    },
    {
      id: "deluxe-oceanview",
      name: "Deluxe Oceanview Suite",
      image: "/images/rooms/deluxe-oceanview.jpg",
      desc: "Wake up to breathtaking ocean horizon views, gentle morning light, and soothing seaside breezes from your private sun deck.",
      features: [
        "Room size: 55 m² with private balcony",
        "Direct unobstructed ocean vista",
        "King-sized bed with plush pillowtop",
        "Rainfall shower with botanical bath amenities",
        "In-room espresso machine & tea bar",
        "24/7 in-room dining service",
      ],
      price: "$180 per night*",
    },
    {
      id: "premier-garden",
      name: "Premier Garden Suite",
      image: "/images/rooms/premier-garden.jpg",
      desc: "Immersed within lush tropical foliage, this peaceful haven provides serene seclusion paired with contemporary comfort.",
      features: [
        "Room size: 48 m² with garden terrace",
        "Tranquil botanical garden backdrop",
        "Luxury marble bathroom with deep tub",
        "High-speed fiber-optic Wi-Fi",
        "Work desk & comfortable reading lounge",
        "Complimentary evening turndown service",
      ],
      price: "$140 per night*",
    },
    {
      id: "standard-deluxe",
      name: "Standard Deluxe Room",
      image: "/images/rooms/standard-deluxe.jpg",
      desc: "A warm, thoughtfully appointed sanctuary ideal for individual travelers and couples seeking tranquility and modern ease.",
      features: [
        "Room size: 36 m² with expansive windows",
        "Cozy king or twin bedding configuration",
        "Modern smart entertainment display",
        "Designer bath amenities & rain shower",
        "Executive workspace & ergonomic chair",
        "Daily housekeeping & valet laundry",
      ],
      price: "$95 per night*",
    },
  ];

  return (
    <main className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* ===== NAVBAR ===== */}
      <NavBar />

      {/* ===== PERFECT HERO ===== */}
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/images/rooms/rooms-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60 flex flex-col items-center justify-center text-center px-4" />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto flex flex-col items-center">
         
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-3 drop-shadow-xl tracking-wide"
          >
            Suites & Living
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-200 font-light max-w-xl mx-auto drop-shadow-md"
          >
            Thoughtfully appointed sanctuaries designed for privacy and restorative sleep.
          </motion.p>
        </div>
      </section>

      {/* ===== ROOMS LIST ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16 flex-1">
        {rooms.map((room, idx) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
            className={`bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image container */}
            <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-[380px] overflow-hidden group">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Room details */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mb-3">
                  {room.name}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {room.desc}
                </p>

                {/* Features checklist */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-yellow-600 mb-3">
                    Key Features & Amenities
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                    {room.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-serif font-bold text-2xl text-gray-900">{room.price}</p>
                  <p className="text-xs text-gray-400">
                    *Includes breakfast & resort privileges
                  </p>
                </div>
                <Link
                  href={`/reservation?room=${encodeURIComponent(room.name)}`}
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider bg-yellow-400 text-black hover:bg-yellow-500 transition shadow-sm text-center"
                >
                  Book This Suite
                </Link>
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
