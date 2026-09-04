from flask import Blueprint, request, jsonify
from db import db

admin_inquiries_bp = Blueprint("admin_inquiries", __name__)

@admin_inquiries_bp.route("/inquiries", methods=["GET"])
def get_inquiries():
    inquiries = db.get_all_inquiries()
    inquiries.sort(key=lambda x: x.get("receivedAt", ""), reverse=True)
    return jsonify({
        "count": len(inquiries),
        "inquiries": inquiries
    }), 200

@admin_inquiries_bp.route("/inquiries/<inquiry_id>", methods=["PATCH"])
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
