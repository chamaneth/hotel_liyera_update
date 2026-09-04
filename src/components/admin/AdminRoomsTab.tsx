"use client";

import type { RoomRecord } from "./types";

interface AdminRoomsTabProps {
  rooms: RoomRecord[];
  onToggleStatus: (roomNumber: string, currentStatus: string) => void;
}

export default function AdminRoomsTab({ rooms, onToggleStatus }: AdminRoomsTabProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-serif font-bold text-white">
            Suite Inventory & Housekeeping
          </h3>
          <p className="text-xs text-slate-400">
            Click any room status badge to toggle live state (Available / Occupied / Maintenance)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Occupied
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Maintenance
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {rooms.map((room) => {
          const isOccupied = room.status === "Occupied";
          const isMaint = room.status === "Maintenance";

          return (
            <div
              key={room.roomNumber}
              className={`p-4 rounded-2xl border transition text-xs flex flex-col justify-between ${
                isOccupied
                  ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                  : isMaint
                  ? "bg-slate-950 border-slate-800 text-slate-400"
                  : "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-base font-bold text-white">
                    Suite {room.roomNumber}
                  </span>
                  <span className="text-[10px] text-amber-400 font-semibold">
                    ${room.pricePerNight}/nt
                  </span>
                </div>
                <span className="font-medium block text-[11px] truncate mb-2">
                  {room.type}
                </span>
              </div>

              <button
                onClick={() => onToggleStatus(room.roomNumber, room.status || "Available")}
                className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer border ${
                  isOccupied
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30"
                    : isMaint
                    ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                    : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                }`}
              >
                {room.status || "Available"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
