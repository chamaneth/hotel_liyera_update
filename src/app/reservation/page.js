"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Reservation() {
  const [form, setForm] = useState({
    checkin: "",
    checkout: "",
    guests: 1,
    roomType: "Deluxe",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-[60vh] w-full">
        <Image
          src="/assets/reservation.webp"
          alt="Hotel view"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-5xl font-bold drop-shadow-lg"
          >
            Book Your Stay
          </motion.h1>
        </div>
      </div>

      {/* Booking Section */}
<section className="py-4 -mt-10 px-4 md:px-12 max-w-5xl mx-auto text-center relative z-10">
      

        <motion.form
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
  className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-5 gap-3 items-end"
>
  <div>
    <label className="block text-gray-700 text-sm mb-1">Check-In</label>
    <input
      type="date"
      name="checkin"
      value={form.checkin}
      onChange={handleChange}
      className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm mb-1">Check-Out</label>
    <input
      type="date"
      name="checkout"
      value={form.checkout}
      onChange={handleChange}
      className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm mb-1">Guests</label>
    <input
      type="number"
      min="1"
      name="guests"
      value={form.guests}
      onChange={handleChange}
      className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  <div>
    <label className="block text-gray-700 text-sm mb-1">Room Type</label>
    <select
      name="roomType"
      value={form.roomType}
      onChange={handleChange}
      className="w-full border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option>Deluxe</option>
      <option>Superior</option>
      <option>Family Suite</option>
      <option>Ocean View</option>
    </select>
  </div>

  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="text-white font-semibold py-1.5 px-3 rounded-md shadow hover:opacity-90 transition text-sm"
    style={{ backgroundColor: "#FFD700" }}
  >
    Check
  </motion.button>
</motion.form>

      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center mt-20">
        <p className="text-gray-400">© 2025 Liyera Hotel. All rights reserved.</p>
      </footer>
    </div>
  );
}
