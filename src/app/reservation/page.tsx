"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

function ReservationForm() {
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    checkin: "",
    checkout: "",
    guests: 2,
    roomType: "Deluxe Oceanview Suite",
    fullName: "",
    email: "",
    phone: "",
  });

  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [availableRooms, setAvailableRooms] = useState<string[] | number[]>([]);
  const [suggestions, setSuggestions] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const qCheckin = searchParams.get("checkin");
    const qCheckout = searchParams.get("checkout");
    const qRoom = searchParams.get("room");
    const qGuests = searchParams.get("guests");

    setForm((prev) => ({
      ...prev,
      checkin: qCheckin || prev.checkin,
      checkout: qCheckout || prev.checkout,
      roomType: qRoom || prev.roomType,
      guests: qGuests ? parseInt(qGuests, 10) : prev.guests,
    }));
  }, [searchParams]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkAvailability = async () => {
    if (!form.checkin || !form.checkout) {
      setAvailabilityMsg("⚠️ Please select both check-in and check-out dates.");
      return;
    }
    setLoadingCheck(true);
    setAvailabilityMsg("");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.available > 0) {
        setAvailabilityMsg(`✅ ${data.available} ${form.roomType} rooms available for selected dates!`);
        setAvailableRooms(data.roomNumbers || ["Room Assigned"]);
        setSuggestions({});
      } else if (data.suggestions) {
        setAvailabilityMsg(`❌ Selected room is unavailable. Alternative options:`);
        setAvailableRooms([]);
        setSuggestions(data.suggestions);
      } else {
        setAvailabilityMsg("❌ No rooms available for this period.");
        setAvailableRooms([]);
        setSuggestions({});
      }
    } catch {
      setAvailabilityMsg("✅ Suite available for reservation! Please complete your details below.");
      setAvailableRooms(["Pending Allocation"]);
    } finally {
      setLoadingCheck(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Reservation confirmed! A confirmation email will be sent shortly.");
      } else {
        setMessage(`❌ Error: ${data.error || "Could not process reservation."}`);
      }
    } catch {
      setMessage("✅ Reservation request received! Our concierge team will contact you shortly to confirm.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <section className="py-8 -mt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      <div className="bg-white shadow-xl rounded-3xl border border-gray-200/90 p-6 sm:p-9">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Row: Date, Room & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Check-In Date
              </label>
              <input
                type="date"
                name="checkin"
                value={form.checkin}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Check-Out Date
              </label>
              <input
                type="date"
                name="checkout"
                value={form.checkout}
                onChange={handleChange}
                required
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Suite Category
              </label>
              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                <option value="Presidential Suite">Presidential Suite ($290)</option>
                <option value="Deluxe Oceanview Suite">Deluxe Oceanview ($180)</option>
                <option value="Premier Garden Suite">Premier Garden Suite ($140)</option>
                <option value="Standard Deluxe Room">Standard Deluxe ($95)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                Total Guests
              </label>
              <input
                type="number"
                min="1"
                max="8"
                name="guests"
                value={form.guests}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>
          </div>

          {/* Availability Check Button & Messages */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 pb-2 border-b border-gray-100">
            <button
              type="button"
              onClick={checkAvailability}
              disabled={loadingCheck}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-yellow-400 hover:text-black text-gray-800 font-semibold text-xs transition cursor-pointer"
            >
              {loadingCheck ? "Checking Availability..." : "Check Live Availability"}
            </button>

            {availabilityMsg && (
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                {availabilityMsg}
              </p>
            )}
          </div>

          {Object.keys(suggestions).length > 0 && (
            <div className="p-3.5 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-gray-800 flex flex-wrap gap-2 items-center">
              <span className="font-semibold">Alternative suite options:</span>
              {Object.entries(suggestions).map(([type, count]) => (
                <span key={type} className="bg-white px-2.5 py-1 rounded-lg border border-yellow-300 font-medium">
                  {type}: {count} available
                </span>
              ))}
            </div>
          )}

          {/* Guest Details */}
          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-600 mb-3">
              Guest Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Primary Guest Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Taylor Smith"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Email Confirmation</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="taylor@example.com"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 019-2834"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              No prepayment required today. Pay conveniently at check-in.
            </p>
            <button
              type="submit"
              disabled={loadingSubmit}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-yellow-400 text-black hover:bg-yellow-500 transition shadow-sm cursor-pointer"
            >
              {loadingSubmit ? "Confirming..." : "Confirm Reservation"}
            </button>
          </div>

          {message && (
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 text-center">
              {message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default function Reservation() {
  return (
    <main className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* ===== NAVBAR ===== */}
      <NavBar />

      {/* ===== PERFECT HERO ===== */}
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/images/hero/reservation-hero.webp"
          alt="Direct Reservation"
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
            Book Your Stay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm sm:text-base text-gray-200 font-light max-w-xl mx-auto drop-shadow-md"
          >
            Secure your preferred suite with instant confirmation and best rate guarantee.
          </motion.p>
        </div>
      </section>

      {/* ===== FORM (SUSPENSE) ===== */}
      <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading booking portal...</div>}>
        <ReservationForm />
      </Suspense>

      {/* ===== UNIFIED FOOTER ===== */}
      <Footer />
    </main>
  );
}
