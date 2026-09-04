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

const TEST_CARDS = [
  {
    brand: "Visa",
    label: "Visa Sandbox (Instant Success)",
    number: "4242 4242 4242 4242",
    exp: "12/28",
    cvv: "123",
  },
  {
    brand: "MasterCard",
    label: "MasterCard VIP (3D-Secure Demo)",
    number: "5555 5555 5555 4444",
    exp: "10/27",
    cvv: "456",
  },
  {
    brand: "AMEX",
    label: "Amex Centurion Demo",
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
  const [activeTab, setActiveTab] = useState<"payhere" | "card">("payhere");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardHolder, setCardHolder] = useState(order.fullName || "Taylor Smith");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [selectedPayHereMethod, setSelectedPayHereMethod] = useState("VISA / MasterCard");

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  const handleFillTestCard = (testCard: typeof TEST_CARDS[0]) => {
    setCardNumber(testCard.number);
    setCardExp(testCard.exp);
    setCardCvv(testCard.cvv);
  };

  const executePayment = async (methodName: string) => {
    setIsProcessing(true);
    setErrorMsg("");

    try {
      setProcessingStage("Initializing Secure Gateway Tunnel (SSL 256-bit)...");
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStage("Verifying Demo Sandbox Authorization with Bank...");
      await new Promise((r) => setTimeout(r, 900));

      setProcessingStage("Processing Transaction & Assigning Luxury Suite...");

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
        setProcessingStage("Payment Authorized! Generating Confirmed Voucher...");
        await new Promise((r) => setTimeout(r, 500));
        onSuccess(data.receipt);
      } else {
        setErrorMsg(data.error || "Payment simulation failed. Please try again.");
        setIsProcessing(false);
      }
    } catch {
      // Offline fallback: generate client-side confirmed demo receipt
      const fallbackTransactionId = `PAY-LIY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const fallbackReceipt: PaymentReceipt = {
        receiptNumber: `REC-${fallbackTransactionId}`,
        transactionId: fallbackTransactionId,
        bookingReference: order.bookingReference || `LIY-${Date.now().toString().slice(-6)}`,
        amount: order.totalPrice,
        currency: order.currency || "USD",
        paymentMethod: methodName,
        cardBrand: "Visa",
        cardLast4: cardNumber.replace(/\s+/g, "").slice(-4) || "4242",
        status: "Paid & Confirmed (Demo)",
        paidAt: new Date().toISOString(),
        guestName: order.fullName,
        guestEmail: order.email,
        suite: order.roomType,
        assignedRoom: "302",
        checkin: order.checkin,
        checkout: order.checkout,
      };
      setProcessingStage("Payment Authorized (Demo Fallback)!");
      await new Promise((r) => setTimeout(r, 400));
      onSuccess(fallbackReceipt);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-white"
      >
        {/* Top Luxury Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-950">
                Hotel Liyera Gateway Demo
              </span>
              <p className="text-[11px] text-slate-900 font-medium">
                Sandbox Environment • 100% Simulated Funds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-900 hover:text-black font-bold text-xl leading-none px-2 py-1 rounded-lg hover:bg-black/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Order Summary Ribbon */}
        <div className="bg-slate-950/80 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400">Suite: </span>
            <span className="text-amber-400 font-semibold">{order.roomType}</span>
            <span className="text-slate-500"> ({order.nights} night{order.nights > 1 ? "s" : ""})</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Total Payable: </span>
            <span className="text-base font-bold text-white tracking-wide">
              ${order.totalPrice.toLocaleString()} {order.currency || "USD"}
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("payhere")}
            className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === "payhere"
                ? "border-amber-400 text-amber-300 bg-slate-800/50"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="font-serif tracking-wider font-bold">PayHere</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Sri Lanka & Global
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("card")}
            className={`py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === "card"
                ? "border-amber-400 text-amber-300 bg-slate-800/50"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>💳 Direct Card Simulation</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Visa/Master/Amex
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

          {/* Quick Demo Fill Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-amber-400/90 uppercase tracking-wider">
                ⚡ 1-Click Demo Test Cards:
              </span>
              <span>No real card needed</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TEST_CARDS.map((tc) => (
                <button
                  key={tc.brand}
                  type="button"
                  onClick={() => handleFillTestCard(tc)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 hover:border-amber-500/40 border border-slate-700 text-[11px] text-slate-300 font-medium transition cursor-pointer"
                >
                  {tc.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "payhere" ? (
            /* PAYHERE TAB */
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select PayHere Payment Method:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Sandbox Active</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    "VISA / MasterCard",
                    "American Express",
                    "Genie Wallet",
                    "eZ Cash",
                    "FriMi Mobile",
                    "Sampath Vishwa",
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedPayHereMethod(m)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        selectedPayHereMethod === m
                          ? "border-amber-400 bg-amber-500/10 text-amber-300 font-bold"
                          : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* PayHere Credentials Notice */}
              <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                <strong>Simulated PayHere Flow:</strong> Emulates PayHere IPN and merchant checkout token generation. Clicking the button will simulate authorization and generate an authenticated hotel reservation receipt.
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => executePayment(`PayHere Demo (${selectedPayHereMethod})`)}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 transition transform active:scale-[0.99] cursor-pointer"
              >
                {isProcessing ? "Processing via PayHere..." : `Pay $${order.totalPrice.toLocaleString()} with PayHere Demo`}
              </button>
            </div>
          ) : (
            /* DIRECT CARD TAB */
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-400 outline-none"
                    placeholder="4242 4242 4242 4242"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                      Expires (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-400 outline-none"
                      placeholder="12/28"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      maxLength={4}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-amber-400 outline-none"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
                    placeholder="Guest Full Name"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => executePayment("Direct Card Demo Gateway")}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 transition transform active:scale-[0.99] cursor-pointer"
              >
                {isProcessing ? "Authorizing Card..." : `Authorize Demo Payment ($${order.totalPrice.toLocaleString()})`}
              </button>
            </div>
          )}

          {/* Security & Processing Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20"
              >
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-serif font-bold text-amber-300">LIY</span>
                  </div>
                </div>
                <h4 className="text-base font-serif font-bold text-white mb-2">
                  Processing Demo Transaction
                </h4>
                <p className="text-xs text-amber-300/90 font-mono max-w-sm animate-pulse">
                  {processingStage}
                </p>
                <span className="mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
                  Secure Demo Sandbox • Do not refresh
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1">
              🔒 End-to-End SSL 256-Bit Sandbox
            </span>
            <span>Hotel Liyera Official Payment Demo</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
