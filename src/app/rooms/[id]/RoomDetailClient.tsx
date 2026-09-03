"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { hotelConfig, RoomItem } from "@/config/hotel.config";
import { useCurrency } from "@/context/CurrencyContext";

interface RoomDetailClientProps {
  room: RoomItem;
}

export default function RoomDetailClient({ room }: RoomDetailClientProps) {
  const { formatPrice } = useCurrency();

  const images = room.images && room.images.length > 0 ? room.images : [room.image];
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Other rooms recommendation
  const otherRooms = hotelConfig.rooms.filter((r) => r.id !== room.id).slice(0, 3);

  return (
    <main className="font-sans antialiased bg-stone-50 text-stone-900 min-h-screen flex flex-col">
      <NavBar />

      {/* Breadcrumb Header */}
      <div className="pt-24 pb-4 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <nav className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-amber-600 transition">Home</Link>
          <span>/</span>
          <Link href="/rooms" className="hover:text-amber-600 transition">Suites & Rooms</Link>
          <span>/</span>
          <span className="text-stone-900 font-semibold">{room.name}</span>
        </nav>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24 w-full flex-1">
        {/* Title & Tag */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300/40">
                {room.tag}
              </span>
              <span className="text-xs text-stone-500 uppercase tracking-wider">
                {room.category}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
              {room.name}
            </h1>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-stone-500 uppercase tracking-wider block">Nightly Rate</span>
            <div className="font-serif text-3xl sm:text-4xl font-bold text-stone-950">
              {formatPrice(room.pricePerNight)}
              <span className="text-xs font-normal text-stone-500"> / night</span>
            </div>
          </div>
        </div>

        {/* Gallery Showcase */}
        <div className="space-y-4 mb-12">
          <div className="relative h-[420px] sm:h-[540px] w-full rounded-3xl overflow-hidden shadow-xl border border-stone-200">
            <Image
              src={images[activeImageIndex]}
              alt={`${room.name} photo`}
              fill
              className="object-cover transition-all duration-500"
              priority
            />
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-amber-500 scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${room.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Key Features Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-stone-200/90 shadow-sm mb-12 text-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Room Dimensions</span>
            <span className="font-serif font-bold text-base sm:text-lg text-stone-900">{room.size}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Bedding Configuration</span>
            <span className="font-serif font-bold text-base sm:text-lg text-stone-900">{room.bed}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Max Occupancy</span>
            <span className="font-serif font-bold text-base sm:text-lg text-stone-900">{room.capacity}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">View Aspect</span>
            <span className="font-serif font-bold text-base sm:text-lg text-stone-900">{room.category}</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Story & Amenities */}
          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
                The Sanctuary Experience
              </h2>
              <p className="text-stone-600 text-base font-light leading-relaxed mb-4">
                {room.description}
              </p>
              <p className="text-stone-600 text-sm font-light leading-relaxed">
                Every detail inside this residence has been tailored for supreme comfort, from the thread count of our Egyptian cotton linens to the acoustic insulation providing uninterrupted calm.
              </p>
            </div>

            {/* Inclusions & Highlights */}
            <div className="p-8 bg-white rounded-3xl border border-stone-200/90 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-6">
                Suite Highlights & Exclusives
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-stone-700">
                {room.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Amenities Grid */}
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">
                Room Amenities & Technologies
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-stone-100/80 rounded-xl text-xs font-medium text-stone-800 flex items-center gap-2"
                  >
                    <span className="text-amber-600">✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 border border-stone-200/90 shadow-xl sticky top-24 space-y-6">
              <div className="pb-4 border-b border-stone-100">
                <span className="text-xs uppercase tracking-wider text-stone-500 block mb-1">
                  Ready for your getaway?
                </span>
                <div className="font-serif text-2xl font-bold text-stone-900">
                  {formatPrice(room.pricePerNight)}
                  <span className="text-xs font-normal text-stone-500"> / night</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-center justify-between py-1">
                  <span>Direct Booking Perk</span>
                  <span className="font-semibold text-emerald-700">Daily Breakfast Included</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Cancellation Policy</span>
                  <span className="font-semibold text-stone-800">48-Hour Free Cancellation</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>Check-In</span>
                  <span className="font-semibold text-stone-800">2:00 PM</span>
                </div>
              </div>

              <Link
                href={`/reservation?room=${room.id}`}
                className="w-full block text-center py-4 rounded-xl text-xs font-semibold uppercase tracking-widest bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Reserve This Suite
              </Link>

              <div className="pt-4 border-t border-stone-100 text-center">
                <p className="text-[11px] text-stone-500">
                  Need personalized assistance? Call our concierge:
                </p>
                <a
                  href={`tel:${hotelConfig.contact.phones.reservations}`}
                  className="text-xs font-bold text-amber-700 hover:underline mt-1 inline-block"
                >
                  {hotelConfig.contact.phones.reservations}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Other Recommended Accommodations */}
        <div className="mt-24 pt-16 border-t border-stone-200">
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-8 text-center">
            Discover More Suites & Villas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherRooms.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-shadow group flex flex-col"
              >
                <Link href={`/rooms/${r.id}`} className="relative h-56 block overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                    {r.tag}
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
                      {r.size} • {r.capacity}
                    </span>
                    <Link href={`/rooms/${r.id}`}>
                      <h4 className="font-serif text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {r.name}
                      </h4>
                    </Link>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-serif font-bold text-stone-900 text-lg">
                      {formatPrice(r.pricePerNight)}
                      <span className="text-[10px] font-normal text-stone-500"> / nt</span>
                    </span>
                    <Link
                      href={`/rooms/${r.id}`}
                      className="text-xs uppercase tracking-wider font-semibold text-amber-700 hover:text-amber-800"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
