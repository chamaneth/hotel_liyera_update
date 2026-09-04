from flask import Blueprint, request, jsonify
from db import db

contact_bp = Blueprint("contact", __name__, url_prefix="/api")

@contact_bp.route("/contact", methods=["POST"])
def submit_inquiry():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing JSON request body"}), 400

    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required."}), 400

    record = db.save_inquiry(data)
    return jsonify({
        "message": "Thank you for contacting Hotel Liyera. Our concierge will be in touch shortly.",
        "inquiry": record
    }), 201
