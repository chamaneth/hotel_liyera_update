from flask import Blueprint, request, jsonify
from db import db

admin_rooms_bp = Blueprint("admin_rooms", __name__)

@admin_rooms_bp.route("/rooms", methods=["GET"])
def get_rooms_status():
    rooms = db.get_all_rooms()
    reservations = db.get_all_reservations()

    # Determine which rooms are occupied right now
    occupied_numbers = {
        str(r.get("roomNumber"))
        for r in reservations
        if r.get("status") in ["Confirmed", "Checked In"] and r.get("roomNumber")
    }

    room_data = []
    for r in rooms:
        r_copy = dict(r)
        room_no = str(r.get("roomNumber"))
        current_status = r.get("status")
        if not current_status:
            current_status = "Occupied" if room_no in occupied_numbers else "Available"
        r_copy["status"] = current_status
        room_data.append(r_copy)

    return jsonify({
        "count": len(room_data),
        "rooms": room_data
    }), 200

@admin_rooms_bp.route("/rooms/<room_number>", methods=["PATCH"])
def update_room(room_number):
    data = request.get_json(silent=True) or {}
    new_status = data.get("status", "Available")
    updated = db.update_room_status(room_number, new_status)

    return jsonify({
        "message": f"Room {room_number} status updated to {new_status}",
        "room": updated
    }), 200
