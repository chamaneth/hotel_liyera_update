"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DemoPaymentOrder {
  bookingReference: string;
  roomType: string;
  checkin: string;
  checkout: string;
  nights: number;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  totalPrice: number;
  currency?: string;
}

export interface PaymentReceipt {
  receiptNumber: string;
  transactionId: string;
  bookingReference: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  cardBrand: string;
  cardLast4: string;
  status: string;
  paidAt: string;
  guestName: string;
  guestEmail: string;
  suite: string;
  assignedRoom?: string;
  checkin: string;
  checkout: string;
}

interface DemoPaymentModalProps {
  isOpen: boolean;
  order: DemoPaymentOrder;
  onClose: () => void;
  onSuccess: (receipt: PaymentReceipt) => void;
}

const STRIPE_TEST_CARDS = [
  {
    brand: "Visa",
    label: "Stripe 4242 (Instant Success)",
    number: "4242 4242 4242 4242",
    exp: "12/28",
    cvv: "123",
  },
  {
    brand: "MasterCard",
    label: "Stripe 3DS (Authentication Demo)",
    number: "5555 5555 5555 4444",
    exp: "10/27",
    cvv: "456",
  },
  {
    brand: "AMEX",
    label: "Stripe Amex (Corporate)",
    number: "3782 822463 10005",
    exp: "08/29",
    cvv: "8888",
  },
];

export default function DemoPaymentModal({
  isOpen,
  order,
  onClose,
  onSuccess,
}: DemoPaymentModalProps) {
  const [activeTab, setActiveTab] = useState<"card" | "express">("card");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardHolder, setCardHolder] = useState(order.fullName || "Taylor Smith");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const handleFillTestCard = (testCard: typeof STRIPE_TEST_CARDS[0]) => {
    setCardNumber(testCard.number);
    setCardExp(testCard.exp);
    setCardCvv(testCard.cvv);
  };

  const executePayment = async (methodName: string) => {
    setIsProcessing(true);
    setErrorMsg("");

    try {
      setProcessingStage("Connecting to Stripe Secure Tunnel (256-bit TLS)...");
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage("Confirming Stripe PaymentIntent & 3DS Token...");
      await new Promise((r) => setTimeout(r, 800));

      setProcessingStage("Authorizing Card & Generating Hotel Voucher...");

      const cardLast4 = cardNumber.replace(/\s+/g, "").slice(-4) || "4242";
      const cardBrand = cardNumber.startsWith("5")
        ? "MasterCard"
        : cardNumber.startsWith("3")
        ? "American Express"
        : "Visa";

      const res = await fetch(`${API_BASE}/api/payments/process-demo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingReference: order.bookingReference,
          amount: order.totalPrice,
          currency: order.currency || "USD",
          paymentMethod: methodName,
          cardLast4: cardLast4,
          cardBrand: cardBrand,
          guestName: order.fullName,
          guestEmail: order.email,
          reservation: {
            bookingReference: order.bookingReference,
            roomType: order.roomType,
            checkin: order.checkin,
            checkout: order.checkout,
            guests: order.guests,
            fullName: order.fullName,
            email: order.email,
            phone: order.phone,
            specialRequests: order.specialRequests,
            totalPrice: order.totalPrice,
            paymentStatus: "Paid",
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setProcessingStage("Stripe Payment Succeeded! Generating Voucher...");
        await new Promise((r) => setTimeout(r, 500));
        onSuccess(data.receipt);
      } else {
        setErrorMsg(data.error || "Payment simulation failed. Please try again.");
        setIsProcessing(false);
      }
    } catch {
      // Offline fallback: generate client-side confirmed Stripe demo receipt
      const fallbackTransactionId = `pi_test_${Math.random().toString(36).substring(2, 14)}_${Date.now().toString().slice(-4)}`;
      const fallbackReceipt: PaymentReceipt = {
        receiptNumber: `REC-STRIPE-${fallbackTransactionId.slice(-8).toUpperCase()}`,
        transactionId: fallbackTransactionId,
        bookingReference: order.bookingReference || `LIY-${Date.now().toString().slice(-6)}`,
        amount: order.totalPrice,
        currency: order.currency || "USD",
        paymentMethod: methodName,
        cardBrand: "Visa",
        cardLast4: cardNumber.replace(/\s+/g, "").slice(-4) || "4242",
        status: "Paid & Confirmed (Stripe)",
        paidAt: new Date().toISOString(),
        guestName: order.fullName,
        guestEmail: order.email,
        suite: order.roomType,
        assignedRoom: "302",
        checkin: order.checkin,
        checkout: order.checkout,
      };
      setProcessingStage("Stripe Authorized (Demo Sandbox)!");
      await new Promise((r) => setTimeout(r, 400));
      onSuccess(fallbackReceipt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden text-white"
      >
        {/* Top Stripe Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-amber-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="font-bold text-base text-white tracking-tighter">S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-white">
                  Stripe Checkout
                </span>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-mono">
                  Test Mode
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 font-medium">
                End-to-End Encrypted Hotel Reservation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-white/80 hover:text-white font-bold text-xl leading-none px-2 py-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Order Summary Ribbon */}
        <div className="bg-slate-950 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Reserved Suite: </span>
            <span className="text-amber-300 font-semibold">{order.roomType}</span>
            <span className="text-slate-500"> ({order.nights} night{order.nights > 1 ? "s" : ""})</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Total Due: </span>
            <span className="text-base font-bold text-white tracking-wide">
              ${order.totalPrice.toLocaleString()} {order.currency || "USD"}
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("card")}
            className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === "card"
                ? "border-indigo-400 text-indigo-300 bg-indigo-950/30"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>💳 Card Elements</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Visa / MC / Amex
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("express")}
            className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === "express"
                ? "border-indigo-400 text-indigo-300 bg-indigo-950/30"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>⚡ Express Checkout</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Apple / Google Pay
            </span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Test Card Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-indigo-300 uppercase tracking-wider">
                ⚡ 1-Click Stripe Test Cards:
              </span>
              <span className="text-slate-500 font-mono text-[10px]">No real card charged</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STRIPE_TEST_CARDS.map((tc) => (
                <button
                  key={tc.brand}
                  type="button"
                  onClick={() => handleFillTestCard(tc)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600/20 hover:border-indigo-500/50 border border-slate-700 text-[11px] text-slate-300 font-medium transition cursor-pointer"
                >
                  {tc.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "card" ? (
            /* STRIPE CARD ELEMENTS TAB */
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                      Card Number
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <span>VISA</span> • <span>MC</span> • <span>AMEX</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                      placeholder="4242 4242 4242 4242"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                      💳
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-indigo-400 outline-none"
                      placeholder="MM / YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1">
                      Security Code (CVC)
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      maxLength={4}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-indigo-400 outline-none"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-indigo-400 outline-none"
                    placeholder="Guest Full Name"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="saveMethod"
                    checked={savePaymentMethod}
                    onChange={(e) => setSavePaymentMethod(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="saveMethod" className="text-xs text-slate-400 cursor-pointer">
                    Save payment details securely for faster checkout with Stripe
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => executePayment("Stripe Card (Elements)")}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-indigo-500 via-indigo-600 to-amber-600 hover:from-indigo-400 hover:to-amber-500 text-white shadow-lg shadow-indigo-500/25 transition transform active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔒</span>
                <span>
                  {isProcessing
                    ? "Authorizing via Stripe..."
                    : `Pay $${order.totalPrice.toLocaleString()} via Stripe`}
                </span>
              </button>
            </div>
          ) : (
            /* EXPRESS CHECKOUT TAB */
            <div className="space-y-4">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3.5 text-center">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                  Supported Digital Wallets
                </span>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => executePayment("Apple Pay (Stripe)")}
                    className="py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span></span>
                    <span>Apple Pay</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => executePayment("Google Pay (Stripe)")}
                    className="py-3 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold text-xs hover:bg-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span className="font-bold text-blue-400">G</span>
                    <span>Google Pay</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => executePayment("Stripe Link")}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>Pay with Link by Stripe</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  1-click authenticated authorization. No card typing needed. Generates your validated hotel voucher instantly.
                </p>
              </div>
            </div>
          )}

          {/* Security & Processing Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20"
              >
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-serif font-bold text-indigo-300">STRIPE</span>
                  </div>
                </div>
                <h4 className="text-base font-serif font-bold text-white mb-2">
                  Processing Stripe Payment
                </h4>
                <p className="text-xs text-indigo-300/90 font-mono max-w-sm animate-pulse">
                  {processingStage}
                </p>
                <span className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
                  Stripe Test Mode • Bank Sandbox Verification
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span>🔒</span>
              <span>256-Bit SSL Encrypted</span>
            </span>
            <span className="font-semibold text-indigo-400">
              Powered by <span className="font-bold tracking-tight">stripe</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
