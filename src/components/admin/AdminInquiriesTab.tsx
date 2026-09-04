"use client";

import type { Inquiry } from "./types";

interface AdminInquiriesTabProps {
  inquiries: Inquiry[];
  onUpdateStatus: (inquiryId: string, status: string) => void;
}

export default function AdminInquiriesTab({
  inquiries,
  onUpdateStatus,
}: AdminInquiriesTabProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-serif font-bold text-white">
            Guest Messages & Contact Inquiries
          </h3>
          <p className="text-xs text-slate-400">
            Incoming contact submissions from guests via /contact
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div
            key={inq.inquiryId}
            className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3 text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div>
                <span className="font-semibold text-white text-sm block">
                  {inq.name}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {inq.email} {inq.phone ? `• ${inq.phone}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  {new Date(inq.receivedAt).toLocaleDateString()}
                </span>
                <select
                  value={inq.status}
                  onChange={(e) => onUpdateStatus(inq.inquiryId, e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-white outline-none cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Replied">Replied</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <span className="text-amber-400 font-semibold block mb-1">
                {inq.subject || "General Inquiry"}
              </span>
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                {inq.message}
              </p>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="text-xs text-slate-500 text-center py-8">
            No contact inquiries recorded yet.
          </p>
        )}
      </div>
    </div>
  );
}
