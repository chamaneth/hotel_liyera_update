from flask import Blueprint, request, jsonify
from models.reservation import Reservation

reservation_bp = Blueprint("reservation_bp", __name__)

def init_reservation_routes(mongo):
    reservations = mongo.db.reservations

    @reservation_bp.route("/api/reservations", methods=["POST"])
    def create_reservation():
        data = request.json
        required = ["checkin", "checkout", "guests", "roomType"]

        if not all(key in data for key in required):
            return jsonify({"error": "Missing fields"}), 400

        new_res = Reservation(
            data["checkin"], data["checkout"], data["guests"], data["roomType"]
        )
        reservations.insert_one(new_res.to_dict())

        return jsonify({"message": "Reservation saved successfully!"}), 201

    @reservation_bp.route("/api/reservations", methods=["GET"])
    def get_reservations():
        all_res = list(reservations.find({}, {"_id": 0}))
        return jsonify(all_res)
