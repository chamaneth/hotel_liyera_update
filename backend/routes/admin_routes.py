import os
from flask import Blueprint, request, jsonify
from db import db

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# Default demo staff credentials
DEMO_ADMIN_USER = {
    "email": "admin@hotelliyera.com",
    "password": "hoteladmin2026",
    "name": "General Manager & Concierge Director",
    "role": "Super Admin",
    "hotel": "Hotel Liyera Luxury Resort & Spa"
}

@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    is_demo_quick = data.get("demoQuickLogin", False)

    if is_demo_quick:
        return jsonify({
            "authenticated": True,
            "token": "demo-admin-bearer-token-liyera-2026",
            "user": {
                "name": DEMO_ADMIN_USER["name"],
                "email": DEMO_ADMIN_USER["email"],
                "role": DEMO_ADMIN_USER["role"],
                "hotel": DEMO_ADMIN_USER["hotel"]
            }
        }), 200

    if email == DEMO_ADMIN_USER["email"].lower() and password == DEMO_ADMIN_USER["password"]:
        return jsonify({
            "authenticated": True,
            "token": "demo-admin-bearer-token-liyera-2026",
            "user": {
                "name": DEMO_ADMIN_USER["name"],
                "email": DEMO_ADMIN_USER["email"],
                "role": DEMO_ADMIN_USER["role"],
                "hotel": DEMO_ADMIN_USER["hotel"]
            }
        }), 200

    return jsonify({"error": "Invalid email or password. Use demo credentials or quick login."}), 401

@admin_bp.route("/overview", methods=["GET"])
def get_overview():
    """
    Returns high-level hotel management metrics: Revenue, Bookings, Occupancy, Inquiries.
    """
    metrics = db.get_admin_metrics()
    return jsonify(metrics), 200

@admin_bp.route("/reservations", methods=["GET"])
def get_reservations():
    """
    Returns reservations with optional filtering and search query.
    """
    reservations = db.get_all_reservations()
    
    status_filter = request.args.get("status")
    payment_filter = request.args.get("paymentStatus")
    query = request.args.get("q", "").strip().lower()

    if status_filter and status_filter.lower() != "all":
        reservations = [r for r in reservations if r.get("status", "").lower() == status_filter.lower()]

    if payment_filter and payment_filter.lower() != "all":
        reservations = [r for r in reservations if r.get("paymentStatus", "").lower() == payment_filter.lower()]

    if query:
        reservations = [
            r for r in reservations
            if query in r.get("fullName", "").lower()
            or query in r.get("email", "").lower()
            or query in r.get("bookingReference", "").lower()
            or query in r.get("roomType", "").lower()
        ]

    # Sort newest first
    reservations.sort(key=lambda x: x.get("createdAt", ""), reverse=True)

    return jsonify({
        "count": len(reservations),
        "reservations": reservations
    }), 200

@admin_bp.route("/reservations/<booking_ref>", methods=["PATCH"])
def update_reservation(booking_ref):
    """
    Updates booking status (Confirmed, Checked In, Checked Out, Cancelled) or payment status.
    """
    data = request.get_json(silent=True) or {}
    updated = db.update_reservation(booking_ref, data)
    if not updated:
        return jsonify({"error": f"Reservation {booking_ref} not found"}), 404

    return jsonify({
        "message": "Reservation updated successfully",
        "reservation": updated
    }), 200

@admin_bp.route("/reservations/<booking_ref>", methods=["DELETE"])
def cancel_reservation(booking_ref):
    success = db.delete_reservation(booking_ref)
    if not success:
        return jsonify({"error": f"Could not find or delete {booking_ref}"}), 404

    return jsonify({"message": f"Reservation {booking_ref} successfully removed"}), 200

@admin_bp.route("/rooms", methods=["GET"])
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

@admin_bp.route("/rooms/<room_number>", methods=["PATCH"])
def update_room(room_number):
    data = request.get_json(silent=True) or {}
    new_status = data.get("status", "Available")
    updated = db.update_room_status(room_number, new_status)

    return jsonify({
        "message": f"Room {room_number} status updated to {new_status}",
        "room": updated
    }), 200

@admin_bp.route("/payments", methods=["GET"])
def get_payments():
    payments = db.get_all_payments()
    payments.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return jsonify({
        "count": len(payments),
        "payments": payments
    }), 200

@admin_bp.route("/payments/<transaction_id>/refund", methods=["POST"])
def refund_payment(transaction_id):
    data = request.get_json(silent=True) or {}
    reason = data.get("reason", "Admin simulated refund from staff panel")
    refunded = db.refund_payment(transaction_id, reason=reason)
    if not refunded:
        return jsonify({"error": "Payment transaction not found"}), 404

    return jsonify({
        "message": f"Demo refund of transaction {transaction_id} processed successfully.",
        "payment": refunded
    }), 200

@admin_bp.route("/inquiries", methods=["GET"])
def get_inquiries():
    inquiries = db.get_all_inquiries()
    inquiries.sort(key=lambda x: x.get("receivedAt", ""), reverse=True)
    return jsonify({
        "count": len(inquiries),
        "inquiries": inquiries
    }), 200

@admin_bp.route("/inquiries/<inquiry_id>", methods=["PATCH"])
def update_inquiry(inquiry_id):
    data = request.get_json(silent=True) or {}
    status = data.get("status", "Replied")
    updated = db.update_inquiry_status(inquiry_id, status)
    if not updated:
        return jsonify({"error": "Inquiry not found"}), 404

    return jsonify({
        "message": "Inquiry status updated",
        "inquiry": updated
    }), 200
