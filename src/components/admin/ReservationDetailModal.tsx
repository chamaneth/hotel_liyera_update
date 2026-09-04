"use client";

import type { Reservation } from "./types";

interface ReservationDetailModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export default function ReservationDetailModal({
  reservation,
  onClose,
}: ReservationDetailModalProps) {
  if (!reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-xs text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] text-amber-400 font-mono font-bold block">
              {reservation.bookingReference}
            </span>
            <h3 className="text-lg font-serif font-bold text-white">
              Reservation Itinerary
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 text-[10px] block">Guest Name</span>
              <span className="font-semibold text-white">{reservation.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Assigned Room</span>
              <span className="font-bold text-amber-400">Suite {reservation.roomNumber}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 text-[10px] block">Email</span>
              <span className="text-slate-300 truncate block">{reservation.email}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Phone</span>
              <span className="text-slate-300">{reservation.phone}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 text-[10px] block">Check-In</span>
              <span className="text-white">{reservation.checkin}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Check-Out</span>
              <span className="text-white">{reservation.checkout}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 text-[10px] block">Suite Category</span>
            <span className="text-white font-medium">{reservation.roomType}</span>
          </div>

          {reservation.specialRequests && (
            <div>
              <span className="text-slate-500 text-[10px] block">Special Requests</span>
              <p className="text-slate-300 italic">{reservation.specialRequests}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-[10px] text-slate-500 block">Total Amount</span>
            <span className="text-base font-bold text-amber-400">
              ${(reservation.totalPrice || 250).toLocaleString()} USD
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
