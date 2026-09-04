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
        booking_ref = f"LIY-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
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

        record = {
            "bookingReference": booking_ref,
            "roomNumber": room_number,
            "roomType": payload.get("roomType"),
            "checkin": payload.get("checkin"),
            "checkout": payload.get("checkout"),
            "guests": payload.get("guests", 2),
            "fullName": payload.get("fullName", ""),
            "email": payload.get("email", ""),
            "phone": payload.get("phone", ""),
            "specialRequests": payload.get("specialRequests", ""),
            "status": "Confirmed",
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
            data["reservations"].append(record)
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        return record

    def save_inquiry(self, payload):
        inquiry_id = f"INQ-{uuid.uuid4().hex[:8].upper()}"
        record = {
            "inquiryId": inquiry_id,
            "name": payload.get("name"),
            "email": payload.get("email"),
            "phone": payload.get("phone"),
            "subject": payload.get("subject", "General Inquiry"),
            "message": payload.get("message"),
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
            data["inquiries"].append(record)
            with open(self.data_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)

        return record

# Singleton database instance
db = DatabaseManager()
