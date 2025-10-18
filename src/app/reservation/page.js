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

  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [availableRooms, setAvailableRooms] = useState(0);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Move checkAvailability outside handleSubmit
  const [suggestions, setSuggestions] = useState({});

const checkAvailability = async () => {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/check-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.available > 0) {
      setAvailabilityMsg(`✅ ${data.available} ${form.roomType} rooms available!`);
      setAvailableRooms(data.roomNumbers || []);
      setSuggestions({});
    } else if (data.suggestions) {
      setAvailabilityMsg(`❌ No ${form.roomType} rooms. Other rooms available:`);
      setAvailableRooms([]);
      setSuggestions(data.suggestions);
    } else {
      setAvailabilityMsg("❌ No rooms available for this period.");
      setAvailableRooms([]);
      setSuggestions({});
    }
  } catch (err) {
    console.error(err);
    setAvailabilityMsg("⚠️ Error checking availability.");
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (availableRooms === 0) {
      setMessage("❌ Cannot reserve. No rooms available.");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Reservation submitted successfully!");
      } else {
        setMessage(`❌ Error: ${data.error || "Something went wrong"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server not responding");
    }
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
            className="text-white text-4xl font-semibold drop-shadow-lg"
          >
            Book Your Stay
          </motion.h1>
        </div>
      </div>

      {/* Booking Section */}
      <section className="py-6 -mt-10 px-4 md:px-12 max-w-5xl mx-auto text-center relative z-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-5 gap-3 items-end"
        >
          {/* Inputs */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Check-In</label>
            <input
              type="date"
              name="checkin"
              value={form.checkin}
              onChange={handleChange}
              required
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
              required
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

          {/* Check Availability Button */}
          <motion.button
            type="button"
            onClick={checkAvailability}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="text-white font-semibold py-1.5 px-3 rounded-md shadow hover:opacity-90 transition text-sm"
            style={{ backgroundColor: "#FFD700" }}
          >
            Check Availability
          </motion.button>
        </motion.form>

        {/* Messages */}
        {availabilityMsg && (
          <p className="mt-4 text-sm text-gray-600 font-medium">{availabilityMsg}</p>
        )}
        {message && (
          <p className="mt-2 text-sm text-gray-600 font-medium">{message}</p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center mt-20">
        <p className="text-gray-400">© 2025 Liyera Hotel. All rights reserved.</p>
      </footer>
    </div>
  );
}
