import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Ensure backend directory is in python search path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

load_dotenv()

from db import db
from routes.reservation_routes import reservation_bp
from routes.room_routes import room_bp
from routes.contact_routes import contact_bp

def create_app():
    app = Flask(__name__)

    # Enable Cross-Origin Resource Sharing (CORS) for Next.js frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register Blueprints
    app.register_blueprint(reservation_bp)
    app.register_blueprint(room_bp)
    app.register_blueprint(contact_bp)

    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "service": "Hotel Liyera Backend API",
            "version": "1.0.0",
            "status": "online",
            "endpoints": [
                "/api/health",
                "/api/rooms",
                "/api/check-availability",
                "/api/reservations",
                "/api/contact"
            ]
        }), 200

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "database": "mongodb" if db.using_mongo else "local_store",
            "activeRoomsCount": len(db.get_all_rooms()),
            "totalReservations": len(db.get_all_reservations())
        }), 200

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"[START] Starting Hotel Liyera Flask API on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
