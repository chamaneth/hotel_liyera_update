from flask import Blueprint, jsonify
from db import db

admin_overview_bp = Blueprint("admin_overview", __name__)

@admin_overview_bp.route("/overview", methods=["GET"])
def get_overview():
    """
    Returns high-level hotel management metrics: Revenue, Bookings, Occupancy, Inquiries.
    """
    metrics = db.get_admin_metrics()
    return jsonify(metrics), 200
