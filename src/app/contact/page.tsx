"use client";

import React, { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Room Reservation",
    message: "",
  });

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
          src="/images/hero/contact-hero.jpg"
          alt="Contact Hotel Liyera"
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
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-200 font-light max-w-xl mx-auto drop-shadow-md"
          >
            We are here to assist with reservations, event bookings, and bespoke requests.
          </motion.p>
        </div>
      </section>

      {/* ===== CONTACT CONTENT ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-gray-200/90 shadow-sm space-y-7">
              <div>
                <span className="text-yellow-600 font-semibold text-xs tracking-[0.2em] uppercase block mb-1">
                  Connect With Us
                </span>
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  Guest Concierge Desk
                </h2>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Whether organizing an upcoming vacation, booking a grand wedding ballroom, or making dining reservations, our hospitality team is at your disposal around the clock.
              </p>

              <div className="space-y-5 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-gray-500">Property Address</h4>
                    <p className="text-gray-800 font-medium mt-0.5">120 Ocean View Boulevard, Coastal Sanctuary Suite 500</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-gray-500">Telephone Lines</h4>
                    <p className="text-gray-800 font-medium mt-0.5">+1 (800) 555-0199 / +1 (800) 555-0120</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-gray-500">Electronic Mail</h4>
                    <a href="mailto:info@hotelliyera.com" className="text-yellow-600 font-medium mt-0.5 block hover:underline">
                      info@hotelliyera.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-gray-500">Operating Schedule</h4>
                    <p className="text-gray-800 font-medium mt-0.5">Front Desk: 24/7 Available</p>
                    <p className="text-gray-500 text-xs">Concierge & Reservations: 8:00 AM – 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-gray-200/90 shadow-sm">
              <span className="text-yellow-600 font-semibold text-xs tracking-[0.2em] uppercase block mb-1">
                Direct Communication
              </span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Send Us a Message
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-6">
                Complete the inquiry form below and our team will respond within 24 business hours.
              </p>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl">
                  <h4 className="font-bold text-base mb-1">Message Sent Successfully!</h4>
                  <p className="text-sm">
                    Thank you for contacting Hotel Liyera. Our concierge will review your message and reach out promptly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Morgan Reed"
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
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
                        placeholder="morgan@example.com"
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                      >
                        <option>Room Reservation</option>
                        <option>Wedding & Banquet Booking</option>
                        <option>Dining & Restaurant Reservation</option>
                        <option>Corporate Summit</option>
                        <option>General Concierge Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How may our concierge team assist you today?"
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black font-semibold py-3.5 rounded-xl hover:bg-yellow-500 transition shadow-sm cursor-pointer text-sm uppercase tracking-wider font-sans"
                  >
                    Transmit Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== UNIFIED FOOTER ===== */}
      <Footer />
    </main>
  );
}
