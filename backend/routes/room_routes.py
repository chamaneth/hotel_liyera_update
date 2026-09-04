from flask import Blueprint, jsonify
from db import db

room_bp = Blueprint("rooms", __name__, url_prefix="/api")

@room_bp.route("/rooms", methods=["GET"])
def get_rooms():
    rooms = db.get_all_rooms()
    return jsonify({
        "count": len(rooms),
        "rooms": rooms
    }), 200
