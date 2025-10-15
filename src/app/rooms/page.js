"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

export default function RoomsPage() {
  const rooms = [
    {
      name: "Presidential Suite",
      image: "/assets/presidential.webp",
      desc: "The pinnacle of luxury and elegance. Expansive space, exquisite design, and personalized service for those seeking an unforgettable stay.",
      features: [
        "Room size: 100–120 m²",
        "Private terrace with Ocean & City views",
        "King-sized bed with premium linens",
        "Jacuzzi + designer bath amenities",
        "Dedicated butler service",
        "Private lounge access",
      ],
      price: "Rs. 85,000 per night*",
    },
    {
      name: "Deluxe Oceanview Room",
      image: "/assets/deluxe-oceanview.jpg",
      desc: "Wake up to breathtaking ocean views and premium comfort for a perfect stay.",
      features: [
        "Room size: 45 sqm",
        "Private balcony with ocean view",
        "King-sized bed",
        "Rainfall shower",
        "24/7 Room Service",
      ],
      price: "Rs. 23,000 per night*",
    },
    {
      name: "Premier Garden Suite",
      image: "/assets/garden.jpg",
      desc: "Surrounded by lush greenery, offering privacy and tranquility with a modern touch.",
      features: [
        "Room size: 40–50 m²",
        "Private balcony with garden view",
        "Luxury bathroom",
        "High-speed Wi-Fi",
        "Room service 24/7",
      ],
      price: "Rs. 18,500 per night*",
    },
    {
      name: "Standard Room",
      image: "/assets/standard.jpg",
      desc: "A cozy, affordable option ideal for solo travelers or couples.",
      features: [
        "Room size: 30–36 m²",
        "City view",
        "Double bed",
        "Essential amenities",
        "Wi-Fi & TV",
      ],
      price: "Rs. 13,000 per night*",
    },
  ];

  return (
    <main className="font-sans antialiased">
      {/* ===== NAVBAR ===== */}
      <NavBar />

      {/* ===== HERO ===== */}
      <section className="relative h-[85vh] flex items-center justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/66db56a2887e7646272fc832.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl text-white font-bold tracking-wide text-center">
            Discover Our Luxury Rooms
          </h1>
        </div>
      </section>

      {/* ===== ROOMS ===== */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-20">
        {rooms.map((room, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className={`flex flex-col md:flex-row ${
              idx % 2 ? "md:flex-row-reverse" : ""
            } items-center gap-10`}
          >
            <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={room.image}
                alt={room.name}
                width={600}
                height={400}
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="md:w-1/2 text-gray-700">
              <h2 className="text-3xl font-bold mb-3 text-yellow-500">{room.name}</h2>
              <p className="mb-4">{room.desc}</p>
              <ul className="list-disc list-inside mb-4 space-y-1 text-gray-600">
                {room.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <p className="font-semibold text-lg mb-2">{room.price}</p>
              <p className="text-sm text-gray-500 mb-4">
                *Rates vary depending on season & availability.
              </p>
              <a
                href="/reservation"
                className="bg-yellow-500 px-5 py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
              >
                Book Now
              </a>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-white py-10 mt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-semibold mb-3">Liyera Hotel</h3>
            <p className="text-gray-400">Where luxury meets serenity.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p>123/6 Kottawa, Pannipitiya</p>
            <p>011 267 5432</p>
            <p><a href="mailto:info@hotelliyera.com" className="underline">info@hotelliyera.com</a></p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-yellow-400">Facebook</a>
              <a href="#" className="hover:text-yellow-400">Instagram</a>
              <a href="#" className="hover:text-yellow-400">Twitter</a>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-6 text-sm">
          © 2025 Liyera Hotel. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
