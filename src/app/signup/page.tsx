"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredSuite: "Deluxe Oceanview Suite",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          preferredSuite: form.preferredSuite,
          password: form.password,
          role: "Guest Member",
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setSuccessMsg("Welcome to Privilege Club! Redirecting to reservation portal...");
        localStorage.setItem("liyera_auth_token", data.user.token);
        localStorage.setItem("liyera_auth_user", JSON.stringify(data.user));

        setTimeout(() => {
          router.push("/reservation");
        }, 1200);
      } else {
        setErrorMsg(data.error || "Registration failed. Please try again.");
      }
    } catch {
      // Offline fallback
      const fallbackUser = {
        fullName: form.fullName,
        email: form.email,
        role: "Guest Member",
        tier: "Privilege Member",
        preferredSuite: form.preferredSuite,
        token: "demo-guest-token",
      };
      localStorage.setItem("liyera_auth_user", JSON.stringify(fallbackUser));
      setSuccessMsg("Account created (Demo Mode)! Redirecting...");

      setTimeout(() => {
        router.push("/reservation");
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavBar />

      <section className="flex-1 flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient atmospheric lighting */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10"
        >
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="relative h-14 w-14 mx-auto mb-2">
              <Image
                src="/images/brand/logo.png"
                alt="Hotel Liyera Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold block">
              Exclusive Member Privileges
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mt-0.5">
              Join the Privilege Club
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Unlock direct booking privileges, welcome amenities, and preferred suite rates
            </p>
          </div>

          {/* Member Perks Highlights */}
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl">
            <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block mb-2 text-center">
              👑 Complimentary Membership Benefits
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span>
                <span>Best Rate Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span>
                <span>Complimentary Champagne</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span>
                <span>Priority Suite Allocation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">✓</span>
                <span>2:00 PM Late Check-out</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Alexander Vance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="alexander@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Preferred Suite Category
                </label>
                <select
                  name="preferredSuite"
                  value={form.preferredSuite}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition cursor-pointer"
                >
                  <option value="Presidential Suite">Presidential Suite ($290/nt)</option>
                  <option value="Deluxe Oceanview Suite">Deluxe Oceanview Suite ($180/nt)</option>
                  <option value="Premier Garden Suite">Premier Garden Suite ($140/nt)</option>
                  <option value="Standard Deluxe Room">Standard Deluxe Room ($95/nt)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Password (min. 6 chars)
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md transition transform active:scale-[0.99] cursor-pointer"
              >
                {loading ? "Creating Privilege Account..." : "Create Membership Account"}
              </button>
            </div>
          </form>

          {/* Login Footer */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="text-amber-400 font-bold hover:underline transition ml-1"
            >
              Sign In Here →
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
