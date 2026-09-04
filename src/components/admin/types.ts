export interface AdminUser {
  name: string;
  email: string;
  role: string;
  hotel: string;
}

export interface Reservation {
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

export interface PaymentTransaction {
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

export interface RoomRecord {
  roomNumber: string;
  type: string;
  category: string;
  pricePerNight: number;
  maxGuests: number;
  status?: "Available" | "Occupied" | "Maintenance" | string;
}

export interface Inquiry {
  inquiryId: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  receivedAt: string;
}

export interface Metrics {
  totalBookings: number;
  totalRevenue: number;
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  pendingInquiries: number;
  recentReservations?: Reservation[];
  recentPayments?: PaymentTransaction[];
}

export type AdminTab =
  | "overview"
  | "reservations"
  | "payments"
  | "rooms"
  | "inquiries"
  | "gateway";
