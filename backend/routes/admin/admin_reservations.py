from flask import Blueprint, request, jsonify
from db import db

admin_reservations_bp = Blueprint("admin_reservations", __name__)

@admin_reservations_bp.route("/reservations", methods=["GET"])
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

@admin_reservations_bp.route("/reservations/<booking_ref>", methods=["PATCH"])
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

@admin_reservations_bp.route("/reservations/<booking_ref>", methods=["DELETE"])
def cancel_reservation(booking_ref):
    success = db.delete_reservation(booking_ref)
    if not success:
        return jsonify({"error": f"Could not find or delete {booking_ref}"}), 404

    return jsonify({"message": f"Reservation {booking_ref} successfully removed"}), 200
