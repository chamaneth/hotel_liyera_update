"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const handleLogin = async (e?: React.FormEvent, isQuickGuest = false, isQuickAdmin = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const targetEmail = isQuickGuest
      ? "guest@hotelliyera.com"
      : isQuickAdmin
      ? "admin@hotelliyera.com"
      : email;

    const targetPassword = isQuickGuest
      ? "guest12345"
      : isQuickAdmin
      ? "hoteladmin2026"
      : password;

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          password: targetPassword,
          quickGuestLogin: isQuickGuest,
          quickAdminLogin: isQuickAdmin,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        setSuccessMsg(data.message || "Signed in successfully!");
        localStorage.setItem("liyera_auth_token", data.user.token);
        localStorage.setItem("liyera_auth_user", JSON.stringify(data.user));

        if (rememberMe) {
          localStorage.setItem("liyera_remembered_email", targetEmail);
        }

        setTimeout(() => {
          if (data.user.role === "Super Admin") {
            localStorage.setItem("liyera_admin_user", JSON.stringify(data.user));
            router.push("/admin");
          } else {
            router.push("/reservation");
          }
        }, 800);
      } else {
        setErrorMsg(data.error || "Invalid credentials. Please verify and try again.");
      }
    } catch {
      // Offline fallback login for demonstration
      const fallbackUser = isQuickAdmin
        ? {
            fullName: "General Manager",
            email: "admin@hotelliyera.com",
            role: "Super Admin",
            token: "demo-admin-token",
          }
        : {
            fullName: "Alexander Vance",
            email: targetEmail || "guest@hotelliyera.com",
            role: "Guest Member",
            tier: "Privilege Diamond Member",
            token: "demo-guest-token",
          };

      localStorage.setItem("liyera_auth_user", JSON.stringify(fallbackUser));
      setSuccessMsg("Signed in (Demo Mode)!");

      setTimeout(() => {
        if (fallbackUser.role === "Super Admin") {
          localStorage.setItem("liyera_admin_user", JSON.stringify(fallbackUser));
          router.push("/admin");
        } else {
          router.push("/reservation");
        }
      }, 700);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavBar />

      <section className="flex-1 flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient atmospheric lighting */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10"
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
              Privilege Club & Staff Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mt-0.5">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage your suites, itineraries, or concierge services
            </p>
          </div>

          {/* Quick 1-Click Demo Buttons */}
          <div className="mb-5 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block text-center">
              ⚡ 1-Click Demo Sign In:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLogin(undefined, true, false)}
                disabled={loading}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-400/50 text-[11px] font-semibold text-slate-200 transition cursor-pointer text-center"
              >
                VIP Guest Demo
              </button>
              <button
                type="button"
                onClick={() => handleLogin(undefined, false, true)}
                disabled={loading}
                className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-[11px] font-bold text-amber-300 transition cursor-pointer text-center"
              >
                Staff Admin Demo
              </button>
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

          {/* Login Form */}
          <form onSubmit={(e) => handleLogin(e, false, false)} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="guest@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-400 hover:underline transition"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md transition transform active:scale-[0.99] cursor-pointer"
            >
              {loading ? "Verifying Credentials..." : "Sign In to Account"}
            </button>
          </form>

          {/* Registration Footer */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Not a member yet? </span>
            <Link
              href="/signup"
              className="text-amber-400 font-bold hover:underline transition ml-1"
            >
              Join Privilege Club →
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
