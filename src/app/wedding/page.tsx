"use client";

import React, { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function WeddingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    venue: "Grand Ballroom",
    date: "",
    message: "",
  });

  const venues = [
    {
      img: "/images/venues/grand-ballroom.jpeg",
      title: "Grand Ballroom",
      desc: "An opulent setting with monumental crystal chandeliers and state-of-the-art acoustics for landmark gala dinners and fairytale weddings.",
      capacity: "Up to 1,000 guests",
      features: [
        "Capacity: Up to 1,000 guests",
        "High ceilings with crystal chandeliers",
        "Custom lighting & integrated AV",
        "Expansive dance floor & stage area",
        "Dedicated private pre-function lounge",
      ],
    },
    {
      img: "/images/venues/royal-banquet.jpeg",
      title: "Royal Banquet",
      desc: "A lavish and grand setup designed for large-scale banquets, awards ceremonies, and prestigious high-society receptions.",
      capacity: "Up to 1,500 guests",
      features: [
        "Capacity: Up to 1,500 guests",
        "Majestic interiors & dramatic lighting",
        "VIP bridal rooms & green rooms",
        "Custom stage & multimedia rigging",
        "Multi-course gourmet catering setup",
      ],
    },
    {
      img: "/images/venues/elegance-banquet.jpg",
      title: "Elegance Banquet",
      desc: "A sophisticated venue characterized by warm neutral tones, contemporary design, and an intimate ambiance for elegant dinners.",
      capacity: "Up to 400 guests",
      features: [
        "Capacity: Up to 400 guests",
        "Contemporary interior decor",
        "Intimate VIP cocktail lounge",
        "Flexible dining & ceremony layouts",
        "Integrated audio & ambient lighting",
      ],
    },
    {
      img: "/images/venues/classic-banquet.png",
      title: "Classic Banquet",
      desc: "A timeless, refined setting ideal for milestone family anniversaries, celebratory dinners, and mid-sized wedding gatherings.",
      capacity: "Up to 500 guests",
      features: [
        "Capacity: Up to 500 guests",
        "Classic refined architectural detailing",
        "Spacious dance floor & banquet seating",
        "Private arrival foyer & coat check",
        "Dedicated culinary service team",
      ],
    },
    {
      img: "/images/venues/corporate-hall.jpg",
      title: "Executive Hall",
      desc: "A technologically advanced hall tailored for corporate summits, international symposiums, product debuts, and business conferences.",
      capacity: "Up to 700 guests",
      features: [
        "Capacity: Up to 700 guests",
        "High-definition presentation projection",
        "Flexible theater or classroom seating",
        "Private breakout & board rooms",
        "Tailored corporate conference dining",
      ],
    },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* ===== NAVBAR ===== */}
      <NavBar />

      {/* ===== PERFECT HERO ===== */}
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero/wedding-hero.jpg"
          alt="Weddings and Celebrations"
          fill
          className="object-cover"
          unoptimized
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
            Weddings & Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-200 font-light max-w-xl mx-auto drop-shadow-md"
          >
            Celebrate life’s most beautiful moments with timeless elegance and style.
          </motion.p>
        </div>
      </section>

      {/* ===== VENUES GRID ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-yellow-600 font-semibold text-xs tracking-[0.2em] uppercase block mb-2">
          Bespoke Event Spaces
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
          Our Event Venues
        </h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto mb-14">
          From intimate gatherings to majestic galas accommodating up to 1,500 esteemed guests.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((v, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left group"
            >
              {/* Image with Tag */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={v.img}
                  alt={v.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-black/75 text-yellow-400 text-xs font-semibold px-3.5 py-1 rounded-full backdrop-blur-xs border border-yellow-400/30">
                  {v.capacity}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {v.desc}
                  </p>

                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-yellow-600 mb-3">
                      Venue Specifications
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {v.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <a
                  href="#inquiry"
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-gray-100 text-gray-800 font-semibold text-xs hover:bg-yellow-400 hover:text-black transition"
                >
                  Inquire for {v.title}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== INQUIRY FORM ===== */}
      <section id="inquiry" className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-yellow-600 font-semibold text-xs tracking-[0.2em] uppercase block mb-2">
            Plan Your Occasion
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
            Event Inquiry Form
          </h2>
          <p className="text-gray-600 text-sm mb-8">
            Tell us about your celebration and our certified event concierges will reach out within 24 hours.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl">
              <h3 className="font-bold text-lg mb-1">Inquiry Received!</h3>
              <p className="text-sm">
                Thank you for your interest in Hotel Liyera. Our banquet coordinator will contact you shortly with a personalized proposal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Preferred Venue
                  </label>
                  <select
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                  >
                    <option>Grand Ballroom (Up to 1,000)</option>
                    <option>Royal Banquet (Up to 1,500)</option>
                    <option>Elegance Banquet (Up to 400)</option>
                    <option>Classic Banquet (Up to 500)</option>
                    <option>Executive Hall (Up to 700)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Event Details & Desired Dates
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Estimated guest count, preferred dates, and any special catering or AV requests..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 text-black font-semibold py-3.5 rounded-xl hover:bg-yellow-500 transition shadow-sm cursor-pointer text-sm tracking-wider uppercase font-sans"
              >
                Submit Event Inquiry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ===== UNIFIED FOOTER ===== */}
      <Footer />
    </main>
  );
}
