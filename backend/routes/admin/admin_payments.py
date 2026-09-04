from flask import Blueprint, request, jsonify
from db import db

admin_payments_bp = Blueprint("admin_payments", __name__)

@admin_payments_bp.route("/payments", methods=["GET"])
def get_payments():
    payments = db.get_all_payments()
    payments.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return jsonify({
        "count": len(payments),
        "payments": payments
    }), 200

@admin_payments_bp.route("/payments/<transaction_id>/refund", methods=["POST"])
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
