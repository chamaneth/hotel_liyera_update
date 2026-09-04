"use client";

import { useState } from "react";
import type { Reservation } from "./types";

interface AdminReservationsTabProps {
  reservations: Reservation[];
  onUpdateStatus: (bookingRef: string, newStatus: string) => void;
  onMarkPaid: (bookingRef: string) => void;
  onDeleteReservation: (bookingRef: string) => void;
  onSelectReservation: (reservation: Reservation) => void;
}

export default function AdminReservationsTab({
  reservations,
  onUpdateStatus,
  onMarkPaid,
  onDeleteReservation,
  onSelectReservation,
}: AdminReservationsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roomType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === "all" ||
      (r.paymentStatus && r.paymentStatus.toLowerCase() === paymentFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search guest name, ref, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Checked Out">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="Paid">Paid in Full</option>
            <option value="Pending">Pending</option>
            <option value="Pay at Check-in">Pay at Check-in</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Guest Info</th>
              <th className="py-3 px-4">Suite / Room</th>
              <th className="py-3 px-4">Stay Dates</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((r) => (
              <tr key={r.bookingReference} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                  {r.bookingReference}
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-white block">{r.fullName}</span>
                  <span className="text-[11px] text-slate-500">{r.email}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-slate-200 block">{r.roomType}</span>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    Room {r.roomNumber || "301"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[11px]">
                  <span>{r.checkin} → {r.checkout}</span>
                  <span className="block text-slate-500">{r.guests} guest(s)</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-white">
                  ${(r.totalPrice || 250).toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      r.paymentStatus === "Paid"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : r.paymentStatus === "Refunded"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {r.paymentStatus || "Pending"}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <select
                    value={r.status}
                    onChange={(e) => onUpdateStatus(r.bookingReference, e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white outline-none cursor-pointer"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Checked In">Checked In</option>
                    <option value="Checked Out">Checked Out</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                  {r.paymentStatus !== "Paid" && (
                    <button
                      onClick={() => onMarkPaid(r.bookingReference)}
                      className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded border border-emerald-600/30 text-[10px] font-semibold transition cursor-pointer"
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => onSelectReservation(r)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold transition cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onDeleteReservation(r.bookingReference)}
                    className="px-2 py-1 bg-red-950 hover:bg-red-900 text-red-300 rounded text-[10px] font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No reservations match the specified filter or query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
