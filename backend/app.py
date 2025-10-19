from flask import Blueprint, request, jsonify
from datetime import datetime
from collections import Counter

reservation_bp = Blueprint("reservation", __name__, url_prefix="/api")

def init_reservation_routes(mongo):
    reservations_collection = mongo.db.reservations
    rooms_collection = mongo.db.rooms  # contains all room types

    @reservation_bp.route("/reservations", methods=["POST"])
    def create_reservation():
        data = request.json
        reservations_collection.insert_one(data)
        return jsonify({"message": "Reservation submitted!"}), 201

    @reservation_bp.route("/check-availability", methods=["POST"])
    def check_availability():
        data = request.json
        checkin = datetime.fromisoformat(data["checkin"])
        checkout = datetime.fromisoformat(data["checkout"])
        requested_type = data["roomType"]
        requested_count = data.get("count", 1)  # default 1 room if not specified

        # --- Find all rooms of requested type ---
        rooms = list(rooms_collection.find({"type": requested_type}))
        available_count = 0

        for room in rooms:
            conflict = reservations_collection.find_one({
                "roomNumber": room["roomNumber"],
                "$or": [
                    {"checkin": {"$lt": checkout}, "checkout": {"$gt": checkin}}
                ]
            })
            if not conflict:
                available_count += 1

        # --- Enough rooms available? ---
        if available_count >= requested_count:
            return jsonify({
                "available": available_count,
                "roomType": requested_type,
                "suggestions": []
            })

        # --- Not enough, suggest alternatives ---
        remaining_needed = requested_count - available_count
        # Count available rooms by type excluding requested type
        other_rooms = list(rooms_collection.find({"type": {"$ne": requested_type}}))
        type_counts = Counter()

        for room in other_rooms:
            conflict = reservations_collection.find_one({
                "roomNumber": room["roomNumber"],
                "$or": [
                    {"checkin": {"$lt": checkout}, "checkout": {"$gt": checkin}}
                ]
            })
            if not conflict and remaining_needed > 0:
                type_counts[room["type"]] += 1
                remaining_needed -= 1

        suggestions = [{"roomType": t, "count": c} for t, c in type_counts.items()]

        return jsonify({
            "available": available_count,
            "roomType": requested_type,
            "suggestions": suggestions
        })
