"use client";

import Image from "next/image";
import Link from "next/link";
import type { AdminUser, AdminTab } from "./types";

interface AdminHeaderProps {
  currentUser: AdminUser;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  reservationCount: number;
  paymentCount: number;
  roomCount: number;
  inquiryCount: number;
}

export default function AdminHeader({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  reservationCount,
  paymentCount,
  roomCount,
  inquiryCount,
}: AdminHeaderProps) {
  const tabs: { id: AdminTab; label: string }[] = [
    { id: "overview", label: "📊 Overview & KPIs" },
    { id: "reservations", label: `🛎️ Reservations (${reservationCount})` },
    { id: "payments", label: `💳 Payment Logs (${paymentCount})` },
    { id: "rooms", label: `🛏️ Rooms & Suites (${roomCount})` },
    { id: "inquiries", label: `📩 Inquiries (${inquiryCount})` },
    { id: "gateway", label: "⚙️ Gateway Sandbox" },
  ];

  return (
    <header className="bg-slate-900 border-b border-amber-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-9 w-9">
              <Image
                src="/images/brand/logo.png"
                alt="Hotel Liyera Emblem"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-sm sm:text-base tracking-widest text-white uppercase block">
                HOTEL LIYERA
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400 font-semibold block -mt-1">
                Staff Executive Console
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/reservation"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs hover:bg-amber-500/20 transition"
          >
            <span>↗ Guest Booking Portal</span>
          </Link>

          <div className="text-right hidden md:block">
            <span className="text-xs font-semibold text-white block">{currentUser.name}</span>
            <span className="text-[10px] text-amber-400 font-mono">{currentUser.role}</span>
          </div>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 border border-slate-700 text-slate-300 text-xs transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tab Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 border-t border-slate-800/80 text-xs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`py-3 px-3.5 border-b-2 font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? "border-amber-400 text-amber-300 bg-amber-500/10 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}
