"use client";

import type { PaymentTransaction } from "./types";

interface AdminPaymentsTabProps {
  payments: PaymentTransaction[];
  onRefund: (transactionId: string) => void;
}

export default function AdminPaymentsTab({ payments, onRefund }: AdminPaymentsTabProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-serif font-bold text-white">
            Payment Gateway Transactions
          </h3>
          <p className="text-xs text-slate-400">
            Real-time log of simulated PayHere & Card authorizations
          </p>
        </div>
        <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
          ● Sandbox Gateway Online
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Guest</th>
              <th className="py-3 px-4">Method & Card</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payments.map((p) => (
              <tr key={p.transactionId} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                  {p.transactionId}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300">
                  {p.bookingReference}
                </td>
                <td className="py-3.5 px-4 font-medium text-white">
                  {p.guestName || "Guest"}
                </td>
                <td className="py-3.5 px-4">
                  <span className="block text-slate-200">{p.paymentMethod}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {p.cardBrand} •••• {p.cardLast4}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-white">
                  ${p.amount.toLocaleString()} {p.currency}
                </td>
                <td className="py-3.5 px-4 text-[11px] text-slate-400">
                  {new Date(p.timestamp).toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      p.status === "Successful"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {p.status === "Successful" && (
                    <button
                      onClick={() => onRefund(p.transactionId)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-purple-900/50 text-purple-300 border border-slate-700 text-[10px] font-semibold transition cursor-pointer"
                    >
                      Demo Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No transactions recorded yet. Complete a reservation via the demo gateway to populate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
