from flask import Blueprint, request, jsonify
from datetime import datetime
from db import db

reservation_bp = Blueprint("reservation", __name__, url_prefix="/api")

@reservation_bp.route("/check-availability", methods=["POST"])
def check_availability():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing JSON request body"}), 400

    checkin_raw = data.get("checkin")
    checkout_raw = data.get("checkout")
    requested_type = data.get("roomType")
    requested_count = int(data.get("count", 1))

    if not checkin_raw or not checkout_raw or not requested_type:
        return jsonify({"error": "checkin, checkout, and roomType are required fields"}), 400

    try:
        checkin_dt = datetime.fromisoformat(checkin_raw)
        checkout_dt = datetime.fromisoformat(checkout_raw)
    except ValueError:
        return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD or ISO 8601 string"}), 400

    if checkout_dt <= checkin_dt:
        return jsonify({"error": "Check-out date must be after check-in date"}), 400

    available_rooms, suggestions = db.check_availability(
        requested_type=requested_type,
        checkin_dt=checkin_dt,
        checkout_dt=checkout_dt,
        count=requested_count
    )

    return jsonify({
        "available": len(available_rooms),
        "roomType": requested_type,
        "roomNumbers": available_rooms,
        "suggestions": suggestions
    }), 200

@reservation_bp.route("/reservations", methods=["POST"])
def create_reservation():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing JSON request body"}), 400

    required_fields = ["checkin", "checkout", "roomType", "fullName"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        checkin_dt = datetime.fromisoformat(data["checkin"])
        checkout_dt = datetime.fromisoformat(data["checkout"])
    except ValueError:
        return jsonify({"error": "Invalid date format. Expected YYYY-MM-DD or ISO 8601"}), 400

    if checkout_dt <= checkin_dt:
        return jsonify({"error": "Check-out date must be after check-in date"}), 400

    reservation = db.create_reservation(data)

    return jsonify({
        "message": "Reservation confirmed!",
        "bookingReference": reservation["bookingReference"],
        "assignedRoom": reservation["roomNumber"],
        "reservation": reservation
    }), 201

@reservation_bp.route("/reservations", methods=["GET"])
def list_reservations():
    reservations = db.get_all_reservations()
    return jsonify({
        "count": len(reservations),
        "reservations": reservations
    }), 200
