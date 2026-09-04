"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  // Step 1: Request recovery PIN
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message || "Recovery code generated!");
        if (data.recoveryCode) {
          setDemoCodeHint(data.recoveryCode);
          setRecoveryCode(data.recoveryCode); // Pre-fill for demo convenience
        }
        setStep(2);
      } else {
        setErrorMsg(data.error || "Could not find an account with this email.");
      }
    } catch {
      // Offline fallback
      const mockCode = "748291";
      setDemoCodeHint(mockCode);
      setRecoveryCode(mockCode);
      setSuccessMsg("Recovery code generated (Demo Mode)!");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with PIN
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: recoveryCode,
          newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Your password has been successfully updated! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setErrorMsg(data.error || "Failed to reset password. Please check your recovery PIN.");
      }
    } catch {
      setSuccessMsg("Password updated (Demo Mode)! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <NavBar />

      <section className="flex-1 flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient atmospheric lighting */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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
              Account Security & Recovery
            </span>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide mt-0.5">
              {step === 1 ? "Reset Password" : "Set New Password"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {step === 1
                ? "Enter your registered email address to receive a secure recovery PIN"
                : `Enter the 6-digit recovery PIN sent for ${email}`}
            </p>
          </div>

          {demoCodeHint && (
            <div className="mb-5 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                ⚡ Instant Demo Recovery PIN
              </span>
              <div className="font-mono text-xl font-bold tracking-widest text-white">
                {demoCodeHint}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Auto-filled below for seamless testing
              </span>
            </div>
          )}

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

          {step === 1 ? (
            /* STEP 1: EMAIL REQUEST */
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g. guest@hotelliyera.com or admin@hotelliyera.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md transition transform active:scale-[0.99] cursor-pointer"
              >
                {loading ? "Generating PIN..." : "Send Recovery PIN"}
              </button>
            </form>
          ) : (
            /* STEP 2: CODE & NEW PASSWORD */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  6-Digit Recovery PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  required
                  placeholder="123456"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono tracking-widest text-center focus:border-amber-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  New Password (min. 6 chars)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1 font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none transition"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-md transition cursor-pointer"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Remembered your password? </span>
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
