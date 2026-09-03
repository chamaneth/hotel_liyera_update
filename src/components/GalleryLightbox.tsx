"use client";

import { useEffect } from "react";
import Image from "next/image";
import { GalleryPhoto } from "@/config/hotel.config";

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryLightbox({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Top Bar: Counter & Close */}
      <div className="w-full max-w-6xl flex items-center justify-between text-white py-2">
        <span className="text-xs uppercase tracking-widest text-stone-400">
          {currentIndex + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-sm flex items-center gap-2"
          aria-label="Close Lightbox"
        >
          <span>✕</span>
          <span className="hidden sm:inline text-xs uppercase tracking-wider">Close</span>
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative w-full max-w-5xl h-[65vh] sm:h-[75vh] flex items-center justify-center">
        <Image
          src={currentPhoto.src}
          alt={currentPhoto.title}
          fill
          className="object-contain"
          priority
        />

        {/* Prev Arrow */}
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-4 p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white transition-all transform -translate-y-1/2 top-1/2 shadow-lg"
          aria-label="Previous Photo"
        >
          ❮
        </button>

        {/* Next Arrow */}
        <button
          onClick={onNext}
          className="absolute right-2 sm:right-4 p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white transition-all transform -translate-y-1/2 top-1/2 shadow-lg"
          aria-label="Next Photo"
        >
          ❯
        </button>
      </div>

      {/* Caption & Category */}
      <div className="text-center text-white max-w-xl pb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
          {currentPhoto.category}
        </span>
        <h3 className="font-serif text-xl sm:text-2xl font-bold mb-1">
          {currentPhoto.title}
        </h3>
        <p className="text-xs text-stone-400 font-light">
          {currentPhoto.desc}
        </p>
      </div>
    </div>
  );
}
