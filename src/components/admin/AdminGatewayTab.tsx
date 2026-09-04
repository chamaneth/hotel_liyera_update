"use client";

import { useState } from "react";
import type { Reservation } from "./types";

interface AdminGatewayTabProps {
  reservations: Reservation[];
  apiBase: string;
  onRefresh: () => void;
  onNotice: (msg: string) => void;
}

export default function AdminGatewayTab({
  reservations,
  apiBase,
  onRefresh,
  onNotice,
}: AdminGatewayTabProps) {
  const [triggeringIpn, setTriggeringIpn] = useState(false);

  const handleTriggerMockIpn = async () => {
    setTriggeringIpn(true);
    const testOrder = reservations[0]?.bookingReference || "LIY-TEST-001";
    try {
      const res = await fetch(`${apiBase}/api/payments/ipn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: testOrder,
          status_code: "2",
          payhere_amount: "580.00",
          payment_id: `PH-IPN-${Date.now().toString().slice(-6)}`,
        }),
      });
      if (res.ok) {
        onNotice(`Mock IPN successfully processed for ${testOrder}!`);
        onRefresh();
      } else {
        onNotice(`IPN simulation finished with status ${res.status}`);
      }
    } catch {
      onNotice(`Mock IPN trigger recorded (offline preview).`);
    } finally {
      setTriggeringIpn(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
            Payment Gateway Configuration
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            PayHere & Direct Checkout Simulator
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure and verify the hotel payment gateway and test webhook IPN integrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Gateway Details */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              PayHere Sandbox Profile
            </h4>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Merchant ID:</span>
                <span className="text-white">DEMO_LIYERA_MERCHANT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IPN Endpoint:</span>
                <span className="text-amber-300">/api/payments/ipn</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Environment:</span>
                <span className="text-emerald-400">Sandbox / Demo Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Currency:</span>
                <span className="text-white">USD / LKR Supported</span>
              </div>
            </div>
          </div>

          {/* Instant IPN Simulator */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              Simulate PayHere IPN Webhook
            </h4>
            <p className="text-slate-400 text-[11px]">
              Sends a mock Instant Payment Notification callback to the Flask backend to verify automated order confirmation.
            </p>
            <button
              type="button"
              disabled={triggeringIpn}
              onClick={handleTriggerMockIpn}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
            >
              {triggeringIpn ? "Triggering IPN..." : "⚡ Trigger Mock PayHere Webhook"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
