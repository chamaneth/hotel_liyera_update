"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  AdminUser,
  Reservation,
  PaymentTransaction,
  RoomRecord,
  Inquiry,
  Metrics,
  AdminTab,
} from "@/components/admin/types";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminOverviewTab from "@/components/admin/AdminOverviewTab";
import AdminReservationsTab from "@/components/admin/AdminReservationsTab";
import AdminPaymentsTab from "@/components/admin/AdminPaymentsTab";
import AdminRoomsTab from "@/components/admin/AdminRoomsTab";
import AdminInquiriesTab from "@/components/admin/AdminInquiriesTab";
import AdminGatewayTab from "@/components/admin/AdminGatewayTab";
import ReservationDetailModal from "@/components/admin/ReservationDetailModal";

export default function AdminPortal() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Dashboard Data State
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [, setLoadingData] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  // Modal State
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

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(""), 4000);
  };

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
      // Offline fallback state for preview
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

  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    localStorage.setItem("liyera_admin_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("liyera_admin_user");
  };

  // Actions
  const handleUpdateReservationStatus = async (bookingRef: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/reservations/${bookingRef}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        triggerNotice(`Booking ${bookingRef} status changed to ${newStatus}`);
        fetchDashboardData();
      }
    } catch {
      setReservations((prev) =>
        prev.map((r) => (r.bookingReference === bookingRef ? { ...r, status: newStatus } : r))
      );
      triggerNotice(`Booking ${bookingRef} updated locally to ${newStatus}`);
    }
  };

  const handleMarkAsPaid = async (bookingRef: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/reservations/${bookingRef}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "Paid" }),
      });
      if (res.ok) {
        triggerNotice(`Booking ${bookingRef} marked as Paid in Full.`);
        fetchDashboardData();
      }
    } catch {
      setReservations((prev) =>
        prev.map((r) => (r.bookingReference === bookingRef ? { ...r, paymentStatus: "Paid" } : r))
      );
      triggerNotice(`Booking ${bookingRef} marked as Paid locally.`);
    }
  };

  const handleDeleteReservation = async (bookingRef: string) => {
    if (!confirm(`Are you sure you want to cancel reservation ${bookingRef}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/reservations/${bookingRef}`, {
        method: "DELETE",
      });
      if (res.ok) {
        triggerNotice(`Reservation ${bookingRef} cancelled.`);
        fetchDashboardData();
      }
    } catch {
      setReservations((prev) => prev.filter((r) => r.bookingReference !== bookingRef));
      triggerNotice(`Reservation ${bookingRef} removed.`);
    }
  };

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

  const handleSimulateRefund = async (transactionId: string) => {
    if (!confirm(`Simulate demo refund for payment transaction ${transactionId}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/payments/${transactionId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Admin concierge manual demo reversal" }),
      });
      if (res.ok) {
        triggerNotice(`Demo refund processed for ${transactionId}.`);
        fetchDashboardData();
      }
    } catch {
      triggerNotice(`Demo refund simulated for ${transactionId}.`);
    }
  };

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

  // Login view if unauthenticated
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} apiBase={API_BASE} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-900 border border-emerald-500 text-emerald-100 rounded-2xl shadow-2xl text-xs flex items-center gap-3">
          <span>✅</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Header & Tabs */}
      <AdminHeader
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
        reservationCount={reservations.length}
        paymentCount={payments.length}
        roomCount={rooms.length || 20}
        inquiryCount={inquiries.length}
      />

      {/* Tab Panels */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === "overview" && (
          <AdminOverviewTab
            metrics={metrics}
            reservations={reservations}
            onSelectTab={setActiveTab}
            onRefresh={fetchDashboardData}
          />
        )}

        {activeTab === "reservations" && (
          <AdminReservationsTab
            reservations={reservations}
            onUpdateStatus={handleUpdateReservationStatus}
            onMarkPaid={handleMarkAsPaid}
            onDeleteReservation={handleDeleteReservation}
            onSelectReservation={setSelectedReservation}
          />
        )}

        {activeTab === "payments" && (
          <AdminPaymentsTab payments={payments} onRefund={handleSimulateRefund} />
        )}

        {activeTab === "rooms" && (
          <AdminRoomsTab rooms={rooms} onToggleStatus={handleToggleRoomStatus} />
        )}

        {activeTab === "inquiries" && (
          <AdminInquiriesTab
            inquiries={inquiries}
            onUpdateStatus={handleUpdateInquiryStatus}
          />
        )}

        {activeTab === "gateway" && (
          <AdminGatewayTab
            reservations={reservations}
            apiBase={API_BASE}
            onRefresh={fetchDashboardData}
            onNotice={triggerNotice}
          />
        )}
      </main>

      {/* Reservation Details Modal */}
      <ReservationDetailModal
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
      />
    </div>
  );
}
