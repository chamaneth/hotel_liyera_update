"use client";

import Link from "next/link";
import type { Metrics, Reservation, AdminTab } from "./types";

interface AdminOverviewTabProps {
  metrics: Metrics | null;
  reservations: Reservation[];
  onSelectTab: (tab: AdminTab) => void;
  onRefresh: () => void;
}

export default function AdminOverviewTab({
  metrics,
  reservations,
  onSelectTab,
  onRefresh,
}: AdminOverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="p-6 bg-slate-900 border border-amber-500/30 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
            <span className="text-lg">💰</span>
          </div>
          <div className="text-3xl font-serif font-bold text-white">
            ${(metrics?.totalRevenue || 0).toLocaleString()}{" "}
            <span className="text-xs font-sans text-amber-400 font-normal">USD</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2">
            <span>▲ Verified live payments</span>
          </div>
        </div>

        {/* Card 2: Total Bookings */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Bookings</span>
            <span className="text-lg">🛎️</span>
          </div>
          <div className="text-3xl font-serif font-bold text-white">
            {metrics?.totalBookings || reservations.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Across Presidential & Luxury Suites
          </div>
        </div>

        {/* Card 3: Occupancy Rate */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Live Occupancy</span>
            <span className="text-lg">🏨</span>
          </div>
          <div className="text-3xl font-serif font-bold text-white">
            {metrics?.occupancyRate || 25.0}%
          </div>
          <div className="text-[11px] text-amber-400 mt-2">
            {metrics?.occupiedRooms || 5} of {metrics?.totalRooms || 20} Suites Active
          </div>
        </div>

        {/* Card 4: Guest Inquiries */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Pending Inquiries</span>
            <span className="text-lg">📩</span>
          </div>
          <div className="text-3xl font-serif font-bold text-white">
            {metrics?.pendingInquiries || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            From Contact & Concierge Form
          </div>
        </div>
      </div>

      {/* Quick Actions & Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Feed */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Recent Reservations
              </h3>
              <p className="text-xs text-slate-400">Latest guest bookings submitted online</p>
            </div>
            <button
              onClick={() => onSelectTab("reservations")}
              className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {reservations.slice(0, 5).map((r) => (
              <div
                key={r.bookingReference}
                className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-amber-400">
                      {r.bookingReference}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      Suite {r.roomNumber || "301"}
                    </span>
                  </div>
                  <span className="font-semibold text-white text-sm block">
                    {r.fullName}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {r.roomType} • {r.checkin} to {r.checkout}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="font-bold text-white block text-sm">
                    ${(r.totalPrice || 250).toLocaleString()} USD
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold mt-1 ${
                      r.paymentStatus === "Paid"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {r.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>
            ))}
            {reservations.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No reservations recorded yet.</p>
            )}
          </div>
        </div>

        {/* Quick Staff Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-white">
              Operations Shortcuts
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/reservation"
                target="_blank"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-between transition"
              >
                <span>⚡ Test Guest Booking Flow</span>
                <span>→</span>
              </Link>
              <button
                onClick={() => onSelectTab("gateway")}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-between transition cursor-pointer"
              >
                <span>⚙️ Test Gateway Webhook (IPN)</span>
                <span>→</span>
              </button>
              <button
                onClick={onRefresh}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-between transition cursor-pointer"
              >
                <span>🔄 Refresh Dashboard Data</span>
                <span>↻</span>
              </button>
            </div>
          </div>

          {/* Property Briefing */}
          <div className="p-5 bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/20 rounded-3xl text-xs space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold block">
              Property Briefing
            </span>
            <p className="text-slate-300 leading-relaxed">
              VIP arrivals scheduled for Presidential Suite 401. All demo payment transactions automatically update booking status and room allocation in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
