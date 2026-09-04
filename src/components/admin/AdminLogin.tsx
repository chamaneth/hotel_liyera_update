"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { AdminUser } from "./types";

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  apiBase: string;
}

export default function AdminLogin({ onLoginSuccess, apiBase }: AdminLoginProps) {
  const [loginEmail, setLoginEmail] = useState("admin@hotelliyera.com");
  const [loginPassword, setLoginPassword] = useState("hoteladmin2026");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e?: React.FormEvent, isQuick = false) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${apiBase}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: isQuick ? "admin@hotelliyera.com" : loginEmail,
          password: isQuick ? "hoteladmin2026" : loginPassword,
          demoQuickLogin: isQuick,
        }),
      });

      const data = await res.json();
      if (res.ok && data.authenticated) {
        onLoginSuccess(data.user);
      } else {
        setLoginError(data.error || "Authentication failed.");
      }
    } catch {
      // Offline fallback login
      const fallbackUser: AdminUser = {
        name: "General Manager & Concierge Director",
        email: "admin@hotelliyera.com",
        role: "Super Admin",
        hotel: "Hotel Liyera Luxury Resort & Spa",
      };
      onLoginSuccess(fallbackUser);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient luxury glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative z-10 text-white"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="relative h-16 w-16 mx-auto mb-3">
            <Image
              src="/images/brand/logo.png"
              alt="Hotel Liyera Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold block">
            Staff & Executive Management
          </span>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
            Hotel Liyera Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure admin console for reservations, revenue & suites
          </p>
        </div>

        {/* Quick Demo Access Button */}
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
          <span className="text-xs text-amber-300 font-semibold block mb-2">
            ⚡ Instant Evaluation Mode
          </span>
          <button
            type="button"
            onClick={() => handleLogin(undefined, true)}
            disabled={loginLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
          >
            {loginLoading ? "Entering Portal..." : "1-Click Demo Staff Login"}
          </button>
          <span className="text-[10px] text-slate-400 block mt-1.5">
            Auto-authenticates with Super Admin privileges
          </span>
        </div>

        <div className="flex items-center my-5 text-slate-600">
          <div className="flex-1 border-t border-slate-800" />
          <span className="px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
            or enter credentials
          </span>
          <div className="flex-1 border-t border-slate-800" />
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleLogin(e, false)} className="space-y-4">
          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Staff Email
            </label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {loginLoading ? "Authenticating..." : "Sign In to Admin Console"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-amber-400/80 hover:text-amber-300 transition"
          >
            ← Return to Hotel Guest Website
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
