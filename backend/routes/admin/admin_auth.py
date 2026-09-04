from flask import Blueprint, request, jsonify

admin_auth_bp = Blueprint("admin_auth", __name__)

DEMO_ADMIN_USER = {
    "email": "admin@hotelliyera.com",
    "password": "hoteladmin2026",
    "name": "General Manager & Concierge Director",
    "role": "Super Admin",
    "hotel": "Hotel Liyera Luxury Resort & Spa"
}

@admin_auth_bp.route("/login", methods=["POST"])
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
