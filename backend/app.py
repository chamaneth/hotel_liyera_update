from flask import Blueprint, request, jsonify
from datetime import datetime

reservation_bp = Blueprint("reservation", __name__, url_prefix="/api")

def init_reservation_routes(mongo):
    reservations_collection = mongo.db.reservations
    rooms_collection = mongo.db.rooms  # create a collection with rooms data

    @reservation_bp.route("/reservations", methods=["POST"])
    def create_reservation():
        data = request.json
        # Save reservation to DB
        reservations_collection.insert_one(data)
        return jsonify({"message": "Reservation submitted!"}), 201

    @reservation_bp.route("/check-availability", methods=["POST"])
    def check_availability():
        data = request.json
        checkin = datetime.fromisoformat(data["checkin"])
        checkout = datetime.fromisoformat(data["checkout"])
        requested_type = data["roomType"]

        # Find all rooms of requested type
        rooms = list(rooms_collection.find({"type": requested_type}))
        available_count = 0
        available_types = []

        for room in rooms:
            # check if room is reserved in given period
            conflicting = reservations_collection.find_one({
                "roomType": requested_type,
                "$or": [
                    {"checkin": {"$lt": checkout}, "checkout": {"$gt": checkin}}
                ]
            })
            if not conflicting:
                available_count += 1

        # If no rooms of requested type, suggest other types
        if available_count == 0:
            other_rooms = rooms_collection.find({"type": {"$ne": requested_type}})
            for room in other_rooms:
                conflicting = reservations_collection.find_one({
                    "roomType": room["type"],
                    "$or": [
                        {"checkin": {"$lt": checkout}, "checkout": {"$gt": checkin}}
                    ]
                })
                if not conflicting:
                    available_types.append(room["type"])

        return jsonify({
            "available": available_count,
            "suggestions": available_types
        })
