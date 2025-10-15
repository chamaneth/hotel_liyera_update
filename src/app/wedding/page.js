"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

export default function Wedding() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const venues = [
    {
      img: "/assets/grandballroom.jpeg",
      title: "Grand Ballroom",
      desc: "The Grand Ballroom offers an opulent setting for weddings, galas, and large events. This venue is perfect for those seeking an unforgettable experience.",
      features: [
        "Capacity: Up to 1,000 guests",
        "High ceilings with crystal chandeliers",
        "Custom lighting & AV systems",
        "Spacious dance floor & stage area",
        "Elegant décor & personalized themes",
        "Dedicated event planning services",
        "Private pre-function lounge",
        "World-class catering options",
      ],
    },
    {
      img: "/assets/royal.jpeg",
      title: "Royal Banquet",
      desc: "A lavish and grand setup designed for large-scale events with an opulent ambiance.",
      features: [
        "Capacity: Up to 1,500 guests",
        "Crystal chandeliers & luxury interiors",
        "Custom lighting and AV setup",
        "VIP rooms & personal concierge",
        "Expansive dance floor and stage",
        "Gourmet multi-course catering",
      ],
    },
    {
      img: "/assets/elegance.jpg",
      title: "Elegance Banquet",
      desc: "A sophisticated and stylish venue, ideal for elegant weddings and gala dinners.",
      features: [
        "Capacity: Up to 400 guests",
        "Neutral tones with luxurious décor",
        "Modern lighting & spacious floor",
        "Exclusive lounge areas for VIPs",
        "Event coordination included",
        "Customized menus",
      ],
    },
    {
      img: "/assets/classic.png",
      title: "Classic Banquet",
      desc: "A more intimate and timeless option for mid-sized events, perfect for family gatherings.",
      features: [
        "Capacity: Up to 500 guests",
        "Classic, refined décor",
        "Cozy dance floor & flexible seating",
        "Complimentary event planning",
        "Private pre-function lounge",
        "Premium catering services",
      ],
    },
    {
      img: "/assets/corporate.jpg",
      title: "Corporate Banquet",
      desc: "A professional venue designed for business events, conferences, and corporate galas.",
      features: [
        "Capacity: Up to 700 guests",
        "Modern AV setup & stage area",
        "Flexible seating for conferences",
        "Private breakout rooms",
        "Tailored corporate catering",
      ],
    },
  ];

  return (
    <main className="font-sans antialiased">
              {/* ===== NAVBAR ===== */}
              <NavBar/>

      {/* Hero Image */}
      <section className="relative h-[90vh] w-full">
       <Image
                 src="/assets/wedding.jpg"
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
            className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg"
          >
            Weddings & Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-white max-w-1xl"
          >
            Celebrate life’s most beautiful moments with elegance and style at Hotel Liyera.
          </motion.p>
        </div>
      </section>

      {/* Venues Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Our Event Venues</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {venues.map((v, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 group"
              >
                <div className="relative h-56 w-full">
                  <Image src={v.img} alt={v.title} fill className="object-cover" />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-2xl font-semibold mb-2">{v.title}</h3>
                  <p className="text-gray-600 mb-4">{v.desc}</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {v.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="bg-white py-20">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Inquiry Form</h2>
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
            >
              Submit
            </button>
          </form>
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
