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
  const [triggeringWebhook, setTriggeringWebhook] = useState(false);

  const handleTriggerMockWebhook = async () => {
    setTriggeringWebhook(true);
    const testOrder = reservations[0]?.bookingReference || "LIY-TEST-001";
    try {
      const res = await fetch(`${apiBase}/api/payments/stripe-webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `evt_test_${Date.now().toString().slice(-8)}`,
          type: "payment_intent.succeeded",
          data: {
            object: {
              id: `pi_wh_${Date.now().toString().slice(-8)}`,
              amount_received: 58000,
              currency: "usd",
              metadata: {
                bookingReference: testOrder,
              },
            },
          },
        }),
      });
      if (res.ok) {
        onNotice(`Stripe webhook successfully processed for booking ${testOrder}!`);
        onRefresh();
      } else {
        onNotice(`Stripe webhook returned status ${res.status}`);
      }
    } catch {
      onNotice(`Stripe webhook simulated (offline preview).`);
    } finally {
      setTriggeringWebhook(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block mb-1">
              Payment Gateway Integration
            </span>
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <span>Stripe Gateway & Checkout Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify Stripe PaymentIntent creation, card tokenization, and automated webhook event handlers
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
            ● Stripe Test Mode Online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Stripe Account & Key Configuration */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>🔑</span> Stripe API Configuration
              </h4>
              <span className="text-[10px] text-indigo-400 font-mono">v2024-11</span>
            </div>
            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Publishable Key:</span>
                <span className="text-slate-300 truncate max-w-[200px]">pk_test_hotel_liyera_...</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Secret Key:</span>
                <span className="text-slate-300">sk_test_••••••••</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">Webhook Endpoint:</span>
                <span className="text-indigo-300">/api/payments/stripe-webhook</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supported Methods:</span>
                <span className="text-amber-400">Cards, Apple Pay, Google Pay</span>
              </div>
            </div>
          </div>

          {/* Instant Stripe Webhook Simulator */}
          <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3.5 text-xs">
            <h4 className="font-bold text-indigo-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>⚡</span> Simulate Stripe Webhook
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Dispatches a simulated <code className="text-amber-300 font-mono">payment_intent.succeeded</code> event to test real-time booking confirmation and automated room assignment.
            </p>
            <button
              type="button"
              disabled={triggeringWebhook}
              onClick={handleTriggerMockWebhook}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              {triggeringWebhook ? "Triggering Stripe Webhook..." : "⚡ Trigger Stripe Webhook Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
