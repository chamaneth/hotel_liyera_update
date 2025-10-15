"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import NavBar from "@/components/NavBar";

export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accommodation = [
    { img: "/assets/standard.jpg", label: "SUITES" },
    { img: "/assets/pool.avif", label: "POOLS" },
    { img: "/assets/dining.jpg", label: "GOURMET DINING" },
    { img: "/assets/spa.webp", label: "SPA" },
  ];

  const testimonials = [
    {
      name: "Sarah & David, UK",
      text: "Our stay at Hotel Liyera was magical. The infinity pool, lush greenery, and authentic Sri Lankan dinner were unforgettable.",
    },
    {
      name: "Mark, Singapore",
      text: "Serene environment, modern amenities, and high ceilings made working and relaxing perfect.",
    },
    {
      name: "Jessica & Tom, USA",
      text: "Spacious rooms, breathtaking balcony views, and luxury five-star service.",
    },
    {
      name: "Anil, India",
      text: "Quiet rooms, fast Wi-Fi, and comfortable workspace. Perfect for business and relaxation.",
    },
  ];

  return (
    <main className="font-sans antialiased">
          {/* ===== NAVBAR ===== */}
          <NavBar/>

      {/* Hero Section */}
<section className="relative h-screen w-full">
  <Image
    src="/assets/ihgor-member-rate-web-offers-1440x720.avif"
    alt="Hotel Hero"
    fill
    className="object-cover"
    unoptimized
    priority
  />

  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
    <motion.h1
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg"
    >
      HOTEL LIYERA
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.2 }}
      className="text-md md:text-lg lg:text-xl text-white max-w-3xl drop-shadow-md"
    >
      Discover Hotel Liyera in the heart of Sri Lanka, where modern luxury
      meets the island's rich heritage.
    </motion.p>
  </div>
</section>

      {/* Accommodation Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6"
          >
            Accommodation
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-16 text-gray-700"
          >
            Our hotel rooms are spacious, with higher ceilings than average hotels.
            Rooms with balconies are perfect for couples or small families.
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {accommodation.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative h-72 rounded-xl overflow-hidden shadow-lg group cursor-pointer transform transition duration-500 hover:scale-105"
              >
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-500"></div>
                <h3 className="absolute bottom-4 left-4 text-white text-xl md:text-2xl font-bold drop-shadow-lg bg-black/30 px-3 py-1 rounded">
                  {item.label}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-12"
        >
          What Our Guests Say
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="p-6 border rounded-lg shadow hover:shadow-xl transition bg-white"
            >
              <h3 className="font-bold text-xl mb-2">{t.name}</h3>
              <p className="text-gray-600">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">Contact Information</h4>
            <p>123/6<br />Kottawa<br />Pannipitiya</p>
            <p>0112675432</p>
            <p><a href="mailto:info@hotelliyera.com" className="text-yellow-400 hover:underline">info@hotelliyera.com</a></p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Useful Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Our Rooms</a></li>
              <li><a href="#" className="hover:underline">Explore</a></li>
              <li><a href="#" className="hover:underline">Dining</a></li>
              <li><a href="#" className="hover:underline">Sustainability</a></li>
              <li><a href="#" className="hover:underline">Gallery</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">About</h4>
            <p>
              Discover Hotel Liyera in the heart of Sri Lanka, blending modern luxury with local charm.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/assets/image-removebg-preview.png"
              alt="Liyera Logo"
              width={120}
              height={60}
            />
          </div>
        </div>
      </footer>
    </main>
  );
}
