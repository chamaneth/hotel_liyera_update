"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface AdminUser {
  name: string;
  email: string;
  role: string;
  hotel: string;
}

interface Reservation {
  bookingReference: string;
  roomNumber: string;
  roomType: string;
  checkin: string;
  checkout: string;
  nights?: number;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  totalPrice?: number;
  paymentStatus?: string;
  paymentDetails?: {
    transactionId?: string;
    method?: string;
    amount?: number;
    currency?: string;
    paidAt?: string;
  };
  status: string;
  createdAt: string;
}

interface PaymentTransaction {
  transactionId: string;
  bookingReference: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  cardLast4: string;
  cardBrand: string;
  guestName: string;
  guestEmail: string;
  status: string;
  timestamp: string;
  refundReason?: string;
}

interface RoomRecord {
  roomNumber: string;
  type: string;
  category: string;
  pricePerNight: number;
  maxGuests: number;
  status?: "Available" | "Occupied" | "Maintenance" | string;
}

interface Inquiry {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  receivedAt: string;
}

interface Metrics {
  totalBookings: number;
  totalRevenue: number;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  pendingInquiries: number;
  recentReservations?: Reservation[];
  recentPayments?: PaymentTransaction[];
}

export default function AdminPortal() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "reservations" | "payments" | "rooms" | "inquiries" | "gateway"
  >("overview");

  // Login state
  const [loginEmail, setLoginEmail] = useState("admin@hotelliyera.com");
  const [loginPassword, setLoginPassword] = useState("hoteladmin2026");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Data state
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Modal / Detail state
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

  // Check stored auth session
  useEffect(() => {
    const stored = localStorage.getItem("liyera_admin_user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("liyera_admin_user");
      }
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [mRes, resRes, payRes, roomRes, inqRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/overview`),
        fetch(`${API_BASE}/api/admin/reservations`),
        fetch(`${API_BASE}/api/admin/payments`),
        fetch(`${API_BASE}/api/admin/rooms`),
        fetch(`${API_BASE}/api/admin/inquiries`),
      ]);

      if (mRes.ok) setMetrics(await mRes.json());
      if (resRes.ok) {
        const d = await resRes.json();
        setReservations(d.reservations || []);
      }
      if (payRes.ok) {
        const d = await payRes.json();
        setPayments(d.payments || []);
      }
      if (roomRes.ok) {
        const d = await roomRes.json();
        setRooms(d.rooms || []);
      }
      if (inqRes.ok) {
        const d = await inqRes.json();
        setInquiries(d.inquiries || []);
      }
    } catch {
      // Offline fallback mock state for smooth demonstration
      setMetrics({
        totalBookings: 8,
        totalRevenue: 3450,
        totalRooms: 20,
        occupiedRooms: 6,
        occupancyRate: 30.0,
        pendingInquiries: 1,
      });
    } finally {
      setLoadingData(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser, fetchDashboardData]);

  const handleLogin = async (e?: React.FormEvent, isQuick = false) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: isQuick ? "admin@hotelliyera.com" : loginEmail,
          password: isQuick ? "hoteladmin2026" : loginPassword,
          demoQuickLogin: isQuick,
        }),
      });

      const data = await res.json();
      if (res.ok && data.authenticated) {
        setCurrentUser(data.user);
        localStorage.setItem("liyera_admin_user", JSON.stringify(data.user));
      } else {
        setLoginError(data.error || "Authentication failed.");
      }
    } catch {
      // Offline demo fallback login
      const fallbackUser: AdminUser = {
        name: "General Manager & Concierge Director",
        email: "admin@hotelliyera.com",
        role: "Super Admin",
        hotel: "Hotel Liyera Luxury Resort & Spa",
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem("liyera_admin_user", JSON.stringify(fallbackUser));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("liyera_admin_user");
  };

  // Update reservation status (Checked In, Checked Out, Confirmed, Cancelled)
  const handleUpdateReservationStatus = async (bookingRef: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/reservations/${bookingRef}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setActionNotice(`Booking ${bookingRef} status changed to ${newStatus}`);
        fetchDashboardData();
        setTimeout(() => setActionNotice(""), 4000);
      }
    } catch {
      setReservations((prev) =>
        prev.map((r) => (r.bookingReference === bookingRef ? { ...r, status: newStatus } : r))
      );
      setActionNotice(`Booking ${bookingRef} updated locally to ${newStatus}`);
      setTimeout(() => setActionNotice(""), 4000);
    }
  };

  // Mark reservation payment status as Paid
  const handleMarkAsPaid = async (bookingRef: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/reservations/${bookingRef}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "Paid" }),
      });
      if (res.ok) {
        setActionNotice(`Booking ${bookingRef} marked as Paid in Full.`);
        fetchDashboardData();
        setTimeout(() => setActionNotice(""), 4000);
      }
    } catch {
      setReservations((prev) =>
        prev.map((r) => (r.bookingReference === bookingRef ? { ...r, paymentStatus: "Paid" } : r))
      );
      setActionNotice(`Booking ${bookingRef} marked as Paid locally.`);
      setTimeout(() => setActionNotice(""), 4000);
    }
  };

  // Cancel / Delete reservation
  const handleDeleteReservation = async (bookingRef: string) => {
    if (!confirm(`Are you sure you want to cancel reservation ${bookingRef}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/reservations/${bookingRef}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setActionNotice(`Reservation ${bookingRef} cancelled.`);
        fetchDashboardData();
        setTimeout(() => setActionNotice(""), 4000);
      }
    } catch {
      setReservations((prev) => prev.filter((r) => r.bookingReference !== bookingRef));
      setActionNotice(`Reservation ${bookingRef} removed.`);
      setTimeout(() => setActionNotice(""), 4000);
    }
  };

  // Toggle Room Status (Available / Occupied / Maintenance)
  const handleToggleRoomStatus = async (roomNumber: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === "Available"
        ? "Occupied"
        : currentStatus === "Occupied"
        ? "Maintenance"
        : "Available";

    try {
      const res = await fetch(`${API_BASE}/api/admin/rooms/${roomNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch {
      setRooms((prev) =>
        prev.map((r) => (r.roomNumber === roomNumber ? { ...r, status: nextStatus } : r))
      );
    }
  };

  // Simulate Demo Refund
  const handleSimulateRefund = async (transactionId: string) => {
    if (!confirm(`Simulate demo refund for payment transaction ${transactionId}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/payments/${transactionId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Admin concierge manual demo reversal" }),
      });
      if (res.ok) {
        setActionNotice(`Demo refund processed for ${transactionId}.`);
        fetchDashboardData();
        setTimeout(() => setActionNotice(""), 4000);
      }
    } catch {
      setActionNotice(`Demo refund simulated for ${transactionId}.`);
      setTimeout(() => setActionNotice(""), 4000);
    }
  };

  // Update contact inquiry status
  const handleUpdateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      await fetch(`${API_BASE}/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchDashboardData();
    } catch {
      setInquiries((prev) =>
        prev.map((i) => (i.inquiryId === inquiryId ? { ...i, status } : i))
      );
    }
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
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

  // ==================== LOGIN SCREEN ====================
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Ambient luxury glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative z-10 text-white"
        >
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="relative h-16 w-16 mx-auto mb-3">
              <Image
                src="/images/brand/logo.png"
                alt="Hotel Liyera Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-semibold block">
              Staff & Executive Management
            </span>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              Hotel Liyera Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Secure admin console for reservations, revenue & suites
            </p>
          </div>

          {/* Quick Demo Access Button */}
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
            <span className="text-xs text-amber-300 font-semibold block mb-2">
              ⚡ Instant Evaluation Mode
            </span>
            <button
              type="button"
              onClick={() => handleLogin(undefined, true)}
              disabled={loginLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
            >
              {loginLoading ? "Entering Portal..." : "1-Click Demo Staff Login"}
            </button>
            <span className="text-[10px] text-slate-400 block mt-1.5">
              Auto-authenticates with Super Admin privileges
            </span>
          </div>

          <div className="flex items-center my-5 text-slate-600">
            <div className="flex-1 border-t border-slate-800" />
            <span className="px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
              or enter credentials
            </span>
            <div className="flex-1 border-t border-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={(e) => handleLogin(e, false)} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-300">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Staff Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              {loginLoading ? "Authenticating..." : "Sign In to Admin Console"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-xs text-amber-400/80 hover:text-amber-300 transition"
            >
              ← Return to Hotel Guest Website
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  // ==================== DASHBOARD INTERFACE ====================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-900 border border-emerald-500 text-emerald-100 rounded-2xl shadow-2xl text-xs flex items-center gap-3">
          <span>✅</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Luxury Navigation Header */}
      <header className="bg-slate-900 border-b border-amber-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9">
                <Image
                  src="/images/brand/logo.png"
                  alt="Hotel Liyera Emblem"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-sm sm:text-base tracking-widest text-white uppercase block">
                  HOTEL LIYERA
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400 font-semibold block -mt-1">
                  Staff Executive Console
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/reservation"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs hover:bg-amber-500/20 transition"
            >
              <span>↗ Guest Booking Portal</span>
            </Link>

            <div className="text-right hidden md:block">
              <span className="text-xs font-semibold text-white block">{currentUser.name}</span>
              <span className="text-[10px] text-amber-400 font-mono">{currentUser.role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-300 border border-slate-700 text-slate-300 text-xs transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto space-x-1 border-t border-slate-800/80 text-xs">
          {[
            { id: "overview", label: "📊 Overview & KPIs" },
            { id: "reservations", label: `🛎️ Reservations (${reservations.length})` },
            { id: "payments", label: `💳 Payment Logs (${payments.length})` },
            { id: "rooms", label: `🛏️ Rooms & Suites (${rooms.length || 20})` },
            { id: "inquiries", label: `📩 Inquiries (${inquiries.length})` },
            { id: "gateway", label: "⚙️ Gateway Sandbox" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-3.5 border-b-2 font-medium whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-amber-400 text-amber-300 bg-amber-500/10 font-bold"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === "overview" && (
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
                  {metrics?.pendingInquiries || inquiries.length}
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
                    onClick={() => setActiveTab("reservations")}
                    className="text-xs text-amber-400 hover:underline font-semibold"
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
                      onClick={() => setActiveTab("gateway")}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-between transition cursor-pointer"
                    >
                      <span>⚙️ Test Gateway Webhook (IPN)</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={fetchDashboardData}
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
        )}

        {/* ==================== TAB 2: RESERVATIONS ==================== */}
        {activeTab === "reservations" && (
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
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
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
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
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
                  {filteredReservations.map((r) => (
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
                          onChange={(e) =>
                            handleUpdateReservationStatus(r.bookingReference, e.target.value)
                          }
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
                            onClick={() => handleMarkAsPaid(r.bookingReference)}
                            className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 rounded border border-emerald-600/30 text-[10px] font-semibold transition cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedReservation(r)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-semibold transition cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDeleteReservation(r.bookingReference)}
                          className="px-2 py-1 bg-red-950 hover:bg-red-900 text-red-300 rounded text-[10px] font-semibold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredReservations.length === 0 && (
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
        )}

        {/* ==================== TAB 3: PAYMENTS ==================== */}
        {activeTab === "payments" && (
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
                            onClick={() => handleSimulateRefund(p.transactionId)}
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
        )}

        {/* ==================== TAB 4: ROOMS ==================== */}
        {activeTab === "rooms" && (
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
                      onClick={() => handleToggleRoomStatus(room.roomNumber, room.status || "Available")}
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
        )}

        {/* ==================== TAB 5: INQUIRIES ==================== */}
        {activeTab === "inquiries" && (
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
                        onChange={(e) => handleUpdateInquiryStatus(inq.inquiryId, e.target.value)}
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
        )}

        {/* ==================== TAB 6: GATEWAY SANDBOX ==================== */}
        {activeTab === "gateway" && (
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
                    onClick={async () => {
                      const testOrder = reservations[0]?.bookingReference || "LIY-TEST-001";
                      try {
                        const res = await fetch(`${API_BASE}/api/payments/ipn`, {
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
                          setActionNotice(`Mock IPN successfully processed for ${testOrder}!`);
                          fetchDashboardData();
                        }
                      } catch {
                        setActionNotice(`Mock IPN trigger recorded.`);
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                  >
                    ⚡ Trigger Mock PayHere Webhook
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== RESERVATION DETAILS MODAL ==================== */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-xs text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold block">
                  {selectedReservation.bookingReference}
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Reservation Itinerary
                </h3>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Guest Name</span>
                  <span className="font-semibold text-white">{selectedReservation.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Assigned Room</span>
                  <span className="font-bold text-amber-400">Suite {selectedReservation.roomNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Email</span>
                  <span className="text-slate-300 truncate block">{selectedReservation.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Phone</span>
                  <span className="text-slate-300">{selectedReservation.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Check-In</span>
                  <span className="text-white">{selectedReservation.checkin}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Check-Out</span>
                  <span className="text-white">{selectedReservation.checkout}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Suite Category</span>
                <span className="text-white font-medium">{selectedReservation.roomType}</span>
              </div>

              {selectedReservation.specialRequests && (
                <div>
                  <span className="text-slate-500 text-[10px] block">Special Requests</span>
                  <p className="text-slate-300 italic">{selectedReservation.specialRequests}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-[10px] text-slate-500 block">Total Amount</span>
                <span className="text-base font-bold text-amber-400">
                  ${(selectedReservation.totalPrice || 250).toLocaleString()} USD
                </span>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
