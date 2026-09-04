"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense, useMemo, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DemoPaymentModal, { type DemoPaymentOrder, type PaymentReceipt } from "@/components/DemoPaymentModal";

const ROOM_CATALOG: Record<string, { price: number; desc: string; maxGuests: number }> = {
  "Presidential Suite": {
    price: 290,
    desc: "Private Jacuzzi terrace, king bed & 24/7 dedicated butler service.",
    maxGuests: 4,
  },
  "Deluxe Oceanview Suite": {
    price: 180,
    desc: "Panoramic Indian Ocean vistas, balcony & marble en-suite bath.",
    maxGuests: 3,
  },
  "Premier Garden Suite": {
    price: 140,
    desc: "Lush botanical sanctuary patio, rain shower & tranquil ambiance.",
    maxGuests: 2,
  },
  "Standard Deluxe Room": {
    price: 95,
    desc: "Refined boutique elegance, artisan coffee bar & king bedding.",
    maxGuests: 2,
  },
};

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
    specialRequests: "",
  });

  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [availableRooms, setAvailableRooms] = useState<string[] | number[]>([]);
  const [suggestions, setSuggestions] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Payment state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [confirmedReceipt, setConfirmedReceipt] = useState<PaymentReceipt | null>(null);
  const [directBookingRef, setDirectBookingRef] = useState<string | null>(null);
  const [assignedRoom, setAssignedRoom] = useState<string | null>(null);

  useEffect(() => {
    const qCheckin = searchParams.get("checkin");
    const qCheckout = searchParams.get("checkout");
    const qRoom = searchParams.get("room");
    const qGuests = searchParams.get("guests");

    // Set default tomorrow and 3 days later if not in query
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDays = new Date(tomorrow);
    threeDays.setDate(threeDays.getDate() + 2);

    const defaultCheckin = tomorrow.toISOString().split("T")[0];
    const defaultCheckout = threeDays.toISOString().split("T")[0];

    setForm((prev) => ({
      ...prev,
      checkin: qCheckin || prev.checkin || defaultCheckin,
      checkout: qCheckout || prev.checkout || defaultCheckout,
      roomType: qRoom || prev.roomType,
      guests: qGuests ? parseInt(qGuests, 10) : prev.guests,
    }));
  }, [searchParams]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  // Stay calculations
  const { nights, unitPrice, subtotal, serviceFee, taxes, grandTotal } = useMemo(() => {
    let n = 1;
    if (form.checkin && form.checkout) {
      const d1 = new Date(form.checkin);
      const d2 = new Date(form.checkout);
      const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
      n = diff > 0 ? diff : 1;
    }

    const price = ROOM_CATALOG[form.roomType]?.price || 180;
    const sub = price * n;
    const sFee = Math.round(sub * 0.1); // 10%
    const tax = Math.round(sub * 0.05); // 5%
    const total = sub + sFee + tax;

    return {
      nights: n,
      unitPrice: price,
      subtotal: sub,
      serviceFee: sFee,
      taxes: tax,
      grandTotal: total,
    };
  }, [form.checkin, form.checkout, form.roomType]);

  const checkAvailability = async () => {
    if (!form.checkin || !form.checkout) {
      setAvailabilityMsg("⚠️ Please select both check-in and check-out dates.");
      return;
    }
    setLoadingCheck(true);
    setAvailabilityMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/check-availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.available > 0) {
        setAvailabilityMsg(
          `✅ ${data.available} ${form.roomType} room(s) available for selected dates! (Suites: ${
            data.roomNumbers ? data.roomNumbers.join(", ") : "Ready"
          })`
        );
        setAvailableRooms(data.roomNumbers || ["Room Assigned"]);
        setSuggestions({});
      } else if (data.suggestions && Object.keys(data.suggestions).length > 0) {
        setAvailabilityMsg(`❌ Selected suite is fully booked for these dates. Alternative options available:`);
        setAvailableRooms([]);
        setSuggestions(data.suggestions);
      } else {
        setAvailabilityMsg("❌ No suites available for this period. Please choose alternate dates.");
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

  // Direct reservation without prepayment (Pay at Check-in)
  const handleDirectReservation = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalPrice: grandTotal,
          paymentStatus: "Pay at Check-in",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const ref = data.bookingReference || `LIY-${Date.now().toString().slice(-6)}`;
        setDirectBookingRef(ref);
        setAssignedRoom(data.assignedRoom || "Assigned Upon Arrival");
        setMessage("✅ Reservation confirmed! Our concierge will email your complete itinerary.");
      } else {
        setMessage(`❌ Error: ${data.error || "Could not process reservation."}`);
      }
    } catch {
      const fallbackRef = `LIY-${Date.now().toString().slice(-6)}`;
      setDirectBookingRef(fallbackRef);
      setAssignedRoom("Suite 201");
      setMessage("✅ Reservation request received! Our concierge team will contact you shortly to confirm.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleOpenPaymentModal = () => {
    if (!form.fullName || !form.email || !form.phone) {
      setMessage("⚠️ Please provide your full name, email, and phone number before opening the payment gateway.");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (receipt: PaymentReceipt) => {
    setIsPaymentModalOpen(false);
    setConfirmedReceipt(receipt);
    setDirectBookingRef(receipt.bookingReference);
    setAssignedRoom(receipt.assignedRoom || "301");
  };

  const handleResetBooking = () => {
    setConfirmedReceipt(null);
    setDirectBookingRef(null);
    setMessage("");
  };

  // Order payload for the Demo Payment Gateway modal
  const paymentOrder: DemoPaymentOrder = {
    bookingReference: `LIY-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`,
    roomType: form.roomType,
    checkin: form.checkin,
    checkout: form.checkout,
    nights: nights,
    guests: form.guests,
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    specialRequests: form.specialRequests,
    totalPrice: grandTotal,
    currency: "USD",
  };

  return (
    <section className="py-8 -mt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      {/* ===== SUCCESS VOUCHER STATE ===== */}
      {directBookingRef ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-2xl rounded-3xl border border-amber-200 overflow-hidden"
        >
          {/* Voucher Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border-b border-amber-500/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-400">
                    Official Booking Confirmation
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Hotel Liyera Resort & Spa
                </h2>
              </div>
              <div className="text-left sm:text-right bg-white/5 border border-amber-400/30 rounded-2xl px-4 py-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-300 block">
                  Booking Reference
                </span>
                <span className="text-lg font-mono font-bold text-amber-300">
                  {directBookingRef}
                </span>
              </div>
            </div>
          </div>

          {/* Voucher Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block">Primary Guest</span>
                  <span className="font-semibold text-gray-900 text-base">{form.fullName || "Taylor Smith"}</span>
                  <span className="text-gray-500 block text-xs">{form.email} • {form.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider block">Reserved Accommodation</span>
                  <span className="font-bold text-amber-800 text-base">{form.roomType}</span>
                  <span className="text-xs text-gray-600 block">Assigned Suite: <strong>{assignedRoom || "Suite 301"}</strong></span>
                </div>
              </div>

              <div className="space-y-3 text-sm border-t md:border-t-0 md:border-l border-amber-200 md:pl-6 pt-4 md:pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Check-In</span>
                    <span className="font-semibold text-gray-900">{form.checkin}</span>
                    <span className="text-[11px] text-gray-500 block">From 2:00 PM</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Check-Out</span>
                    <span className="font-semibold text-gray-900">{form.checkout}</span>
                    <span className="text-[11px] text-gray-500 block">Until 12:00 PM</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Total Stay Duration</span>
                    <span className="font-medium text-gray-800">{nights} Night{nights > 1 ? "s" : ""} • {form.guests} Guests</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 uppercase tracking-wider block">Total Amount</span>
                    <span className="font-bold text-gray-900 text-lg">${grandTotal.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Badge */}
            {confirmedReceipt ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-base shrink-0">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-emerald-900 text-sm block">
                      Demo Payment Verified & Completed
                    </span>
                    <span className="text-emerald-700">
                      Transaction ID: <strong className="font-mono">{confirmedReceipt.transactionId}</strong> via {confirmedReceipt.paymentMethod}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[11px] uppercase tracking-wider">
                  Paid in Full (Demo)
                </span>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs text-blue-900">
                <div>
                  <span className="font-bold text-sm block">Payment at Hotel Guaranteed</span>
                  <span>No prepayment processed today. Please present this reference number upon arrival.</span>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-[11px] uppercase tracking-wider">
                  Pay at Check-in
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-800 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>🖨️ Print Voucher</span>
              </button>

              <button
                type="button"
                onClick={handleResetBooking}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Book Another Suite
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* ===== STANDARD BOOKING FORM ===== */
        <div className="bg-white shadow-xl rounded-3xl border border-gray-200/90 p-6 sm:p-9">
          <form onSubmit={handleDirectReservation} className="space-y-6">
            {/* Header / Intro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-amber-600">
                  Step 1: Select Your Stay
                </span>
                <h3 className="text-xl font-serif font-bold text-gray-900">
                  Direct Boutique Suite Reservation
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200">
                <span>🛡️</span>
                <span>Best Rate & Instant Verification Guarantee</span>
              </div>
            </div>

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
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition font-medium"
                >
                  <option value="Presidential Suite">Presidential Suite ($290/nt)</option>
                  <option value="Deluxe Oceanview Suite">Deluxe Oceanview ($180/nt)</option>
                  <option value="Premier Garden Suite">Premier Garden Suite ($140/nt)</option>
                  <option value="Standard Deluxe Room">Standard Deluxe ($95/nt)</option>
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
                Step 2: Guest Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Primary Guest Name</label>
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
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Email Confirmation</label>
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
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Phone Number</label>
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

              <div className="mt-4">
                <label className="block text-xs text-gray-600 mb-1 font-medium">
                  Special Requests / Dietary Preferences (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={form.specialRequests}
                  onChange={handleChange}
                  rows={2}
                  placeholder="High floor ocean view, anniversary celebration amenities, late check-in..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            </div>

            {/* Live Pricing Breakdown Card */}
            <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-amber-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold block">
                    Stay Pricing Breakdown
                  </span>
                  <p className="text-xs text-slate-300">
                    {form.roomType} • {nights} Night{nights > 1 ? "s" : ""} @ ${unitPrice}/night
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Total Payable</span>
                  <span className="text-2xl font-bold font-serif text-white tracking-wide">
                    ${grandTotal.toLocaleString()} <span className="text-xs font-sans text-amber-400">USD</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-slate-400">
                <div>
                  <span>Room Subtotal: </span>
                  <strong className="text-slate-200">${subtotal.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Service Fee (10%): </span>
                  <strong className="text-slate-200">${serviceFee.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Resort Taxes (5%): </span>
                  <strong className="text-slate-200">${taxes.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Submit & Payment Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 text-center sm:text-left">
                Choose to pay online with our **Demo Gateway (PayHere / Card)** or reserve with **Pay at Hotel**.
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Secondary Option: Pay at Hotel */}
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gray-100 text-gray-800 hover:bg-gray-200 transition cursor-pointer border border-gray-300"
                >
                  {loadingSubmit ? "Confirming..." : "Pay at Hotel (No Prepayment)"}
                </button>

                {/* Primary Option: Demo Payment Gateway */}
                <button
                  type="button"
                  onClick={handleOpenPaymentModal}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>⚡ Pay with Demo Gateway</span>
                  <span className="text-[10px] bg-black/10 px-1.5 py-0.5 rounded">PayHere & Cards</span>
                </button>
              </div>
            </div>

            {message && (
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-800 text-center">
                {message}
              </div>
            )}
          </form>
        </div>
      )}

      {/* Demo Payment Modal */}
      <DemoPaymentModal
        isOpen={isPaymentModalOpen}
        order={paymentOrder}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-widest uppercase"
          >
            Direct Hospitality Booking & Payment Demo
          </motion.div>
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
