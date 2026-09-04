import os
import json
import uuid
from datetime import datetime
from threading import Lock
from dotenv import load_dotenv

load_dotenv()

# Initial seed data for boutique luxury suites
DEFAULT_ROOMS = [
    # Presidential Suite
    {"roomNumber": "401", "type": "Presidential Suite", "category": "Suites", "pricePerNight": 290, "maxGuests": 4},
    {"roomNumber": "402", "type": "Presidential Suite", "category": "Suites", "pricePerNight": 290, "maxGuests": 4},
    # Deluxe Oceanview Suite
    {"roomNumber": "301", "type": "Deluxe Oceanview Suite", "category": "Oceanview", "pricePerNight": 180, "maxGuests": 3},
    {"roomNumber": "302", "type": "Deluxe Oceanview Suite", "category": "Oceanview", "pricePerNight": 180, "maxGuests": 3},
    {"roomNumber": "303", "type": "Deluxe Oceanview Suite", "category": "Oceanview", "pricePerNight": 180, "maxGuests": 3},
    {"roomNumber": "304", "type": "Deluxe Oceanview Suite", "category": "Oceanview", "pricePerNight": 180, "maxGuests": 3},
    {"roomNumber": "305", "type": "Deluxe Oceanview Suite", "category": "Oceanview", "pricePerNight": 180, "maxGuests": 3},
    # Premier Garden Suite
    {"roomNumber": "201", "type": "Premier Garden Suite", "category": "Garden", "pricePerNight": 140, "maxGuests": 2},
    {"roomNumber": "202", "type": "Premier Garden Suite", "category": "Garden", "pricePerNight": 140, "maxGuests": 2},
    {"roomNumber": "203", "type": "Premier Garden Suite", "category": "Garden", "pricePerNight": 140, "maxGuests": 2},
    {"roomNumber": "204", "type": "Premier Garden Suite", "category": "Garden", "pricePerNight": 140, "maxGuests": 2},
    {"roomNumber": "205", "type": "Premier Garden Suite", "category": "Garden", "pricePerNight": 140, "maxGuests": 2},
    # Standard Deluxe Room
    {"roomNumber": "101", "type": "Standard Deluxe Room", "category": "Deluxe", "pricePerNight": 95, "maxGuests": 2},
    {"roomNumber": "102", "type": "Standard Deluxe Room", "category": "Deluxe", "pricePerNight": 95, "maxGuests": 2},
    {"roomNumber": "103", "type": "Standard Deluxe Room", "category": "Deluxe", "pricePerNight": 95, "maxGuests": 2},
    {"roomNumber": "104", "type": "Standard Deluxe Room", "category": "Deluxe", "pricePerNight": 95, "maxGuests": 2},
    {"roomNumber": "105", "type": "Standard Deluxe Room", "category": "Deluxe", "pricePerNight": 95, "maxGuests": 2},
    {"roomNumber": "106", "type": "Standard Deluxe Room", "category": "Deluxe", "pricePerNight": 95, "maxGuests": 2},
    {"roomNumber": "107", "type": "Standard Deluxe Room", "category": "Deluxe", "pricePerNight": 95, "maxGuests": 2},
    {"roomNumber": "108", "type": "Standard Deluxe Room", "category": "Deluxe", "pricePerNight": 95, "maxGuests": 2},
]

class DatabaseManager:
    """
    Unified database manager with MongoDB support and an automatic local JSON storage fallback.
    Guarantees that the hotel backend never crashes even if MongoDB is offline or misconfigured.
    """
    def __init__(self):
        self.lock = Lock()
        self.using_mongo = False
        self.mongo_client = None
        self.mongo_db = None
        self.data_dir = os.path.join(os.path.dirname(__file__), "data")
        self.data_file = os.path.join(self.data_dir, "store.json")

        self._init_backend()

    def _init_backend(self):
        mongo_uri = os.getenv("MONGO_URI")
        if mongo_uri:
            try:
                from pymongo import MongoClient
                # Quick timeout so startup doesn't hang if cluster is down
                client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2500)
                client.server_info()  # Forces connection check
                self.mongo_client = client
                self.mongo_db = client.get_database("hotel_liyera")
                self.using_mongo = True
                print("[SUCCESS] Successfully connected to MongoDB Atlas!")
                self._seed_mongo_rooms()
                return
            except Exception as e:
                print(f"[WARNING] MongoDB connection unavailable ({e}). Activating local persistence fallback...")

        # Fallback to local file store
        self._init_local_store()

    def _init_local_store(self):
        os.makedirs(self.data_dir, exist_ok=True)
        with self.lock:
            if not os.path.exists(self.data_file):
                initial_data = {
                    "rooms": DEFAULT_ROOMS,
                    "reservations": [],
                    "inquiries": [],
                    "metadata": {
                        "created_at": datetime.utcnow().isoformat(),
                        "version": "1.0.0"
                    }
                }
                with open(self.data_file, "w", encoding="utf-8") as f:
                    json.dump(initial_data, f, indent=2)
                print(f"[INFO] Seeded local database with {len(DEFAULT_ROOMS)} rooms at: {self.data_file}")
            else:
                print(f"[INFO] Loaded local database from: {self.data_file}")

    def _seed_mongo_rooms(self):
        try:
            rooms_col = self.mongo_db.rooms
            if rooms_col.count_documents({}) == 0:
                rooms_col.insert_many(DEFAULT_ROOMS)
                print(f"[INFO] Seeded MongoDB with {len(DEFAULT_ROOMS)} default rooms.")
        except Exception as e:
            print(f"[WARNING] Error seeding MongoDB rooms: {e}")

    # ==================== DATA METHODS ====================

    def get_all_rooms(self):
        if self.using_mongo:
            try:
                rooms = list(self.mongo_db.rooms.find({}, {"_id": 0}))
                return rooms
            except Exception:
                pass
        
        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("rooms", [])

    def get_all_reservations(self):
        if self.using_mongo:
            try:
                reservations = list(self.mongo_db.reservations.find({}, {"_id": 0}))
                return reservations
            except Exception:
                pass

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("reservations", [])

    def check_availability(self, requested_type, checkin_dt, checkout_dt, count=1):
        """
        Find available room numbers of the requested type for the given date range.
        Returns (available_rooms, alternative_suggestions)
        """
        all_rooms = self.get_all_rooms()
        all_reservations = self.get_all_reservations()

        # Helper to check date overlap
        def has_conflict(res):
            try:
                res_in = datetime.fromisoformat(res["checkin"])
                res_out = datetime.fromisoformat(res["checkout"])
                # Overlap condition: start < other_end and end > other_start
                return checkin_dt < res_out and checkout_dt > res_in
            except Exception:
                return False

        # Build list of occupied room numbers during this period
        occupied_room_numbers = set()
        for res in all_reservations:
            if has_conflict(res):
                room_no = res.get("roomNumber")
                if room_no:
                    occupied_room_numbers.add(str(room_no))

        # Check requested room type
        matched_rooms = [r for r in all_rooms if r.get("type", "").lower() == requested_type.lower()]
        available_rooms = [
            r["roomNumber"] for r in matched_rooms if str(r["roomNumber"]) not in occupied_room_numbers
        ]

        suggestions = {}
        if len(available_rooms) < count:
            # Check availability for alternative room types
            other_rooms = [r for r in all_rooms if r.get("type", "").lower() != requested_type.lower()]
            for r in other_rooms:
                if str(r["roomNumber"]) not in occupied_room_numbers:
                    r_type = r["type"]
                    suggestions[r_type] = suggestions.get(r_type, 0) + 1

        return available_rooms, suggestions

    def create_reservation(self, payload):
        """
        Saves a confirmed reservation and assigns an available room number.
        """
        booking_ref = payload.get("bookingReference") or f"LIY-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        # Calculate nights
        nights = 1
        try:
            checkin_dt = datetime.fromisoformat(payload["checkin"])
            checkout_dt = datetime.fromisoformat(payload["checkout"])
            diff = (checkout_dt - checkin_dt).days
            nights = max(diff, 1)
        except Exception:
            nights = 1

        # Calculate or extract total price
        total_price = payload.get("totalPrice")
        if not total_price:
            all_rooms = self.get_all_rooms()
            matched = next((r for r in all_rooms if r.get("type", "").lower() == payload.get("roomType", "").lower()), None)
            base_price = matched.get("pricePerNight", 150) if matched else 150
            total_price = base_price * nights

        # Determine room assignment if not explicitly provided
        room_number = payload.get("roomNumber")
        if not room_number:
            try:
                checkin_dt = datetime.fromisoformat(payload["checkin"])
                checkout_dt = datetime.fromisoformat(payload["checkout"])
                available, _ = self.check_availability(payload.get("roomType", ""), checkin_dt, checkout_dt, 1)
                room_number = available[0] if available else "Pending Allocation"
            except Exception:
                room_number = "Confirmed"

        payment_status = payload.get("paymentStatus", "Pending")
        payment_details = payload.get("paymentDetails", None)

        record = {
            "bookingReference": booking_ref,
            "roomNumber": str(room_number),
            "roomType": payload.get("roomType"),
            "checkin": payload.get("checkin"),
            "checkout": payload.get("checkout"),
            "nights": nights,
            "guests": int(payload.get("guests", 2)),
            "fullName": payload.get("fullName", ""),
            "email": payload.get("email", ""),
            "phone": payload.get("phone", ""),
            "specialRequests": payload.get("specialRequests", ""),
            "totalPrice": float(total_price),
            "paymentStatus": payment_status,
            "paymentDetails": payment_details,
            "status": payload.get("status", "Confirmed"),
            "createdAt": datetime.utcnow().isoformat()
        }

        if self.using_mongo:
            try:
                self.mongo_db.reservations.insert_one(dict(record))
                record.pop("_id", None)
                return record
            except Exception as e:
                print(f"[WARNING] MongoDB write failed ({e}), saving locally...")

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            data.setdefault("reservations", []).append(record)
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        return record

    def update_reservation(self, booking_ref, update_data):
        """
        Updates reservation details or statuses (e.g. status, paymentStatus, roomNumber).
        """
        updated_record = None

        if self.using_mongo:
            try:
                self.mongo_db.reservations.update_one(
                    {"bookingReference": booking_ref},
                    {"$set": update_data}
                )
                updated_record = self.mongo_db.reservations.find_one({"bookingReference": booking_ref}, {"_id": 0})
            except Exception as e:
                print(f"[WARNING] MongoDB update failed ({e})")

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            reservations = data.setdefault("reservations", [])
            for res in reservations:
                if res.get("bookingReference") == booking_ref:
                    res.update(update_data)
                    updated_record = res
                    break
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        return updated_record

    def delete_reservation(self, booking_ref):
        """
        Cancels or deletes a reservation.
        """
        success = False
        if self.using_mongo:
            try:
                res = self.mongo_db.reservations.delete_one({"bookingReference": booking_ref})
                success = res.deleted_count > 0
            except Exception as e:
                print(f"[WARNING] MongoDB delete failed ({e})")

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            initial_count = len(data.get("reservations", []))
            data["reservations"] = [r for r in data.get("reservations", []) if r.get("bookingReference") != booking_ref]
            if len(data["reservations"]) < initial_count:
                success = True
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        return success

    # ==================== PAYMENT METHODS ====================

    def record_payment(self, payment_payload):
        """
        Stores payment transaction logs and marks corresponding reservation as Paid.
        """
        transaction_id = payment_payload.get("transactionId") or f"PAY-LIY-{uuid.uuid4().hex[:10].upper()}"
        
        record = {
            "transactionId": transaction_id,
            "bookingReference": payment_payload.get("bookingReference"),
            "amount": float(payment_payload.get("amount", 0)),
            "currency": payment_payload.get("currency", "USD"),
            "paymentMethod": payment_payload.get("paymentMethod", "Demo PayHere / Card"),
            "cardLast4": payment_payload.get("cardLast4", "4242"),
            "cardBrand": payment_payload.get("cardBrand", "Visa"),
            "guestName": payment_payload.get("guestName", ""),
            "guestEmail": payment_payload.get("guestEmail", ""),
            "status": payment_payload.get("status", "Successful"),
            "isDemo": True,
            "timestamp": datetime.utcnow().isoformat()
        }

        if self.using_mongo:
            try:
                self.mongo_db.payments.insert_one(dict(record))
                record.pop("_id", None)
            except Exception as e:
                print(f"[WARNING] MongoDB payment record failed ({e})")

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            data.setdefault("payments", []).append(record)
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        # Update reservation status to Paid
        if record.get("bookingReference"):
            self.update_reservation(record["bookingReference"], {
                "paymentStatus": "Paid",
                "paymentDetails": {
                    "transactionId": record["transactionId"],
                    "amount": record["amount"],
                    "currency": record["currency"],
                    "method": record["paymentMethod"],
                    "cardLast4": record["cardLast4"],
                    "paidAt": record["timestamp"]
                }
            })

        return record

    def get_all_payments(self):
        if self.using_mongo:
            try:
                return list(self.mongo_db.payments.find({}, {"_id": 0}))
            except Exception:
                pass

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("payments", [])

    def refund_payment(self, transaction_id, reason="Demo Refund Initiated"):
        """
        Simulates a refund for demo payments and updates reservation status.
        """
        updated_payment = None
        booking_ref = None

        if self.using_mongo:
            try:
                self.mongo_db.payments.update_one(
                    {"transactionId": transaction_id},
                    {"$set": {"status": "Refunded", "refundReason": reason, "refundedAt": datetime.utcnow().isoformat()}}
                )
                updated_payment = self.mongo_db.payments.find_one({"transactionId": transaction_id}, {"_id": 0})
            except Exception:
                pass

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            for p in data.setdefault("payments", []):
                if p.get("transactionId") == transaction_id:
                    p["status"] = "Refunded"
                    p["refundReason"] = reason
                    p["refundedAt"] = datetime.utcnow().isoformat()
                    updated_payment = p
                    booking_ref = p.get("bookingReference")
                    break
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        if booking_ref:
            self.update_reservation(booking_ref, {
                "paymentStatus": "Refunded"
            })

        return updated_payment

    # ==================== ROOM & INQUIRY METHODS ====================

    def update_room_status(self, room_number, status):
        """
        Updates the availability/maintenance status of a room.
        """
        room_number_str = str(room_number)
        updated = None

        if self.using_mongo:
            try:
                self.mongo_db.rooms.update_one(
                    {"roomNumber": room_number_str},
                    {"$set": {"status": status}}
                )
                updated = self.mongo_db.rooms.find_one({"roomNumber": room_number_str}, {"_id": 0})
            except Exception:
                pass

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            for r in data.setdefault("rooms", []):
                if str(r.get("roomNumber")) == room_number_str:
                    r["status"] = status
                    updated = r
                    break
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        return updated

    def get_all_inquiries(self):
        if self.using_mongo:
            try:
                return list(self.mongo_db.inquiries.find({}, {"_id": 0}))
            except Exception:
                pass

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return data.get("inquiries", [])

    def save_inquiry(self, payload):
        inquiry_id = f"INQ-{uuid.uuid4().hex[:8].upper()}"
        record = {
            "inquiryId": inquiry_id,
            "name": payload.get("name"),
            "email": payload.get("email"),
            "phone": payload.get("phone", ""),
            "subject": payload.get("subject", "General Inquiry"),
            "message": payload.get("message"),
            "status": "New",
            "receivedAt": datetime.utcnow().isoformat()
        }

        if self.using_mongo:
            try:
                self.mongo_db.inquiries.insert_one(dict(record))
                record.pop("_id", None)
                return record
            except Exception:
                pass

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            data.setdefault("inquiries", []).append(record)
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        return record

    def update_inquiry_status(self, inquiry_id, status):
        updated = None
        if self.using_mongo:
            try:
                self.mongo_db.inquiries.update_one(
                    {"inquiryId": inquiry_id},
                    {"$set": {"status": status}}
                )
                updated = self.mongo_db.inquiries.find_one({"inquiryId": inquiry_id}, {"_id": 0})
            except Exception:
                pass

        with self.lock:
            with open(self.data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            for inq in data.setdefault("inquiries", []):
                if inq.get("inquiryId") == inquiry_id:
                    inq["status"] = status
                    updated = inq
                    break
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        return updated

    # ==================== ADMIN KPI METRICS ====================

    def get_admin_metrics(self):
        reservations = self.get_all_reservations()
        rooms = self.get_all_rooms()
        payments = self.get_all_payments()
        inquiries = self.get_all_inquiries()

        total_bookings = len(reservations)
        
        # Calculate revenue from paid reservations and payments
        total_revenue = 0.0
        for p in payments:
            if p.get("status") == "Successful":
                total_revenue += float(p.get("amount", 0))

        # If no explicit payment objects yet, derive from reservations marked Paid
        if total_revenue == 0.0:
            for r in reservations:
                if r.get("paymentStatus") == "Paid":
                    total_revenue += float(r.get("totalPrice", 0))

        total_rooms = max(len(rooms), 1)
        occupied_rooms = len([r for r in rooms if r.get("status") == "Occupied"])
        occupancy_rate = round((occupied_rooms / total_rooms) * 100, 1)

        pending_inquiries = len([i for i in inquiries if i.get("status", "New") == "New"])

        # Recent 5 reservations
        recent_reservations = sorted(
            reservations,
            key=lambda x: x.get("createdAt", ""),
            reverse=True
        )[:5]

        # Recent 5 payments
        recent_payments = sorted(
            payments,
            key=lambda x: x.get("timestamp", ""),
            reverse=True
        )[:5]

        return {
            "totalBookings": total_bookings,
            "totalRevenue": round(total_revenue, 2),
            "totalRooms": total_rooms,
            "occupiedRooms": occupied_rooms,
            "occupancyRate": occupancy_rate,
            "pendingInquiries": pending_inquiries,
            "recentReservations": recent_reservations,
            "recentPayments": recent_payments
        }

# Singleton database instance
db = DatabaseManager()
