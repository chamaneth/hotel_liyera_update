"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import QuickBookingBar from "@/components/QuickBookingBar";

export default function Home() {
  const accommodation = [
    { img: "/images/amenities/luxury-suites.jpg", label: "SUITES", link: "/rooms" },
    { img: "/images/amenities/infinity-pool.avif", label: "POOLS", link: "/gallery" },
    { img: "/images/amenities/gourmet-dining.jpg", label: "GOURMET DINING", link: "/dining" },
    { img: "/images/amenities/wellness-spa.webp", label: "SPA & WELLNESS", link: "/rooms" },
  ];

  const features = [
    {
      title: "Spacious High-Ceiling Living",
      desc: "Thoughtfully engineered sanctuaries with expansive private balconies and panoramic vistas.",
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: "Scenic Coastal Sanctuary",
      desc: "Idyllic natural surroundings offering secluded privacy paired with effortless city connectivity.",
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: "Grand Banquet Facilities",
      desc: "Five versatile luxury ballrooms hosting up to 1,500 guests with custom lighting & catering.",
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18z" />
        </svg>
      ),
    },
    {
      title: "World-Class Hospitality",
      desc: "Warm personalized service, dedicated 24/7 concierge, and bespoke guest experiences.",
      icon: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      name: "Sarah & David, London",
      text: "Our stay at Hotel Liyera was unforgettable. The infinity pool, lush gardens, and exquisite candlelight dinners were simply magical.",
    },
    {
      name: "Mark H., Singapore",
      text: "The high-ceiling suites and tranquil ocean views made working and relaxing completely effortless. Exemplary service.",
    },
    {
      name: "Jessica T., New York",
      text: "Breathtaking architectural elegance, lavish room finishes, and five-star concierge attentiveness from start to finish.",
    },
    {
      name: "Elena R., Zurich",
      text: "Quiet, immaculate living spaces, fast Wi-Fi, and heavenly wellness treatments. An absolute paradise.",
    },
  ];

  return (
    <main className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* ===== NAVBAR ===== */}
      <NavBar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[85vh] min-h-[580px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero/hero-banner.avif"
          alt="Hotel Liyera Hero"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        {/* Balanced Dark Gradient for High-Contrast Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60 flex flex-col items-center justify-center text-center px-4" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center">
       
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold font-serif text-white mb-4 drop-shadow-xl tracking-wider"
          >
            HOTEL LIYERA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl drop-shadow-md font-light leading-relaxed"
          >
            A tranquil sanctuary where modern luxury meets timeless elegance.
          </motion.p>
        </div>
      </section>

      {/* ===== QUICK BOOKING BAR ===== */}
      <QuickBookingBar />

      {/* ===== CORE HIGHLIGHTS SECTION ===== */}
      <section className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition text-left flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center mb-4 border border-yellow-100">
                  {f.icon}
                </div>
                <h3 className="font-bold text-base text-gray-900 mb-2 font-serif">
                  {f.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== ACCOMMODATION SECTION ===== */}
      <section className="py-16 bg-white border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-yellow-600 font-semibold text-xs tracking-[0.2em] uppercase block mb-2"
          >
            Refined Sanctuaries
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 mb-4"
          >
            Accommodations & Living
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
          >
            Thoughtfully engineered living spaces with higher ceilings, private balconies, and sublime comforts designed for restorative relaxation.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accommodation.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-200"
              >
                <Link href={item.link} className="block w-full h-full relative">
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/90 transition-colors duration-300" />
                  <div className="absolute bottom-5 left-5 right-5 text-left">
                    <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-md tracking-wider">
                      {item.label}
                    </span>
                    <span className="block text-white text-xs mt-2 opacity-90 group-hover:underline">
                      Explore Experience →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section id="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-yellow-600 font-semibold text-xs tracking-[0.2em] uppercase block mb-2"
        >
          Guest Experiences
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 mb-3"
        >
          What Our Guests Say
        </motion.h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto mb-12">
          Genuine reflections from travelers who experienced the tranquil luxury of Hotel Liyera.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="p-6 sm:p-7 rounded-2xl border border-gray-200/90 bg-white shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <h3 className="font-bold text-sm text-gray-900 font-serif">{t.name}</h3>
                <span className="text-xs text-gray-400">Verified Guest Stay</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== UNIFIED FOOTER ===== */}
      <Footer />
    </main>
  );
}
