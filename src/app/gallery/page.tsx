"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

interface GalleryItem {
  id: string;
  title: string;
  category: "Suites" | "Venues" | "Wellness";
  src: string;
  description: string;
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const photos: GalleryItem[] = [
    {
      id: "1",
      title: "Presidential Suite Living Salon",
      category: "Suites",
      src: "/images/rooms/presidential-suite.webp",
      description: "Expansive luxury living area with bespoke furnishings and panoramic horizons.",
    },
    {
      id: "2",
      title: "Deluxe Oceanview Sun Deck",
      category: "Suites",
      src: "/images/rooms/deluxe-oceanview.jpg",
      description: "Private sun terrace facing serene coastal ocean horizons.",
    },
    {
      id: "3",
      title: "Premier Garden Suite Terrace",
      category: "Suites",
      src: "/images/rooms/premier-garden.jpg",
      description: "Tranquil botanical foliage and peaceful garden atmosphere.",
    },
    {
      id: "4",
      title: "Standard Deluxe Bedroom",
      category: "Suites",
      src: "/images/rooms/standard-deluxe.jpg",
      description: "Plush king bedding and warm contemporary architectural comfort.",
    },
    {
      id: "5",
      title: "Grand Ballroom Gala Reception",
      category: "Venues",
      src: "/images/venues/grand-ballroom.jpeg",
      description: "Monumental crystal chandeliers and opulent banqueting setups.",
    },
    {
      id: "6",
      title: "Royal Banquet Grand Setting",
      category: "Venues",
      src: "/images/venues/royal-banquet.jpeg",
      description: "Dramatic ambient lighting tailored for prestigious high-society galas.",
    },
    {
      id: "7",
      title: "Elegance Banquet Lounge",
      category: "Venues",
      src: "/images/venues/elegance-banquet.jpg",
      description: "Contemporary interior detailing for intimate celebration gatherings.",
    },
    {
      id: "8",
      title: "Classic Banquet Gathering",
      category: "Venues",
      src: "/images/venues/classic-banquet.png",
      description: "Timeless architectural elegance hosting up to 500 guests.",
    },
    {
      id: "9",
      title: "Executive Conference Hall",
      category: "Venues",
      src: "/images/venues/corporate-hall.jpg",
      description: "State-of-the-art audiovisual systems and corporate breakout halls.",
    },
    {
      id: "10",
      title: "Heated Infinity Horizon Pool",
      category: "Wellness",
      src: "/images/amenities/infinity-pool.avif",
      description: "Panoramic horizon swimming pool framed by natural scenery.",
    },
    {
      id: "11",
      title: "The Grand Bistro Dining Room",
      category: "Wellness",
      src: "/images/amenities/gourmet-dining.jpg",
      description: "Artisanal fine dining featuring world-class culinary excellence.",
    },
    {
      id: "12",
      title: "Holistic Wellness & Spa Sanctuary",
      category: "Wellness",
      src: "/images/amenities/wellness-spa.webp",
      description: "Restorative massage therapies, herbal remedies, and tranquil relaxation.",
    },
  ];

  const categories = ["All", "Suites", "Venues", "Wellness"];

  const filtered =
    activeCategory === "All"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : filtered.length - 1));
  }, [selectedIndex, filtered.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < filtered.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex, filtered.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  const selectedPhoto = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <main className="font-sans antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {/* ===== NAVBAR ===== */}
      <NavBar />

      {/* ===== HERO ===== */}
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/images/amenities/infinity-pool.avif"
          alt="Hotel Liyera Gallery"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60 flex flex-col items-center justify-center text-center px-4" />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-3 drop-shadow-xl tracking-wide">
            Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-gray-200 font-light max-w-xl mx-auto drop-shadow-md">
            A glimpse into our serene landscapes, living sanctuaries, and event halls.
          </p>
        </div>
      </section>

      {/* ===== FILTER TABS ===== */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedIndex(null);
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition cursor-pointer ${
                  isSelected
                    ? "bg-yellow-400 text-black shadow-xs font-bold"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat === "All" ? "All Photographs" : cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== GALLERY GRID ===== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              className="relative aspect-[4/3] w-full min-h-[260px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-200 bg-gray-100"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Bottom gradient overlay with visible title & category badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-left transition-opacity">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wider mb-1.5 w-fit">
                  {item.category}
                </span>
                <h3 className="text-white text-base font-serif font-bold drop-shadow-md">
                  {item.title}
                </h3>
                <span className="text-gray-300 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Click to view full photo ⤢
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== LIGHTBOX MODAL ===== */}
      {selectedPhoto && (
        <div
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
        >
          {/* Top Bar: Counter & Close */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl flex items-center justify-between text-white py-2"
          >
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Photo {(selectedIndex ?? 0) + 1} of {filtered.length}
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black text-white transition text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              aria-label="Close Lightbox"
            >
              Close ✕
            </button>
          </div>

          {/* Main Stage */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[60vh] sm:h-[70vh] flex items-center justify-center my-auto"
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />

            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-yellow-400 hover:text-black text-white transition shadow-lg text-lg font-bold cursor-pointer"
              aria-label="Previous Photo"
            >
              ❮
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-yellow-400 hover:text-black text-white transition shadow-lg text-lg font-bold cursor-pointer"
              aria-label="Next Photo"
            >
              ❯
            </button>
          </div>

          {/* Caption & Category */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="text-center text-white max-w-xl pb-3"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wider mb-2">
              {selectedPhoto.category}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mb-1">
              {selectedPhoto.title}
            </h2>
            <p className="text-xs text-gray-300 font-light">
              {selectedPhoto.description}
            </p>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <Footer />
    </main>
  );
}
