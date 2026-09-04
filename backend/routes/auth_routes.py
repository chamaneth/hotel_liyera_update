import uuid
from flask import Blueprint, request, jsonify
from db import db

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    full_name = data.get("fullName", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    phone = data.get("phone", "").strip()
    preferred_suite = data.get("preferredSuite", "Deluxe Oceanview Suite")
    role = data.get("role", "Guest Member")

    if not full_name or not email or not password:
        return jsonify({"error": "Full name, email, and password are required."}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    existing = db.find_user_by_email(email)
    if existing:
        return jsonify({"error": "An account with this email address already exists. Please sign in."}), 409

    user = db.create_user({
        "fullName": full_name,
        "email": email,
        "password": password,
        "phone": phone,
        "role": role,
        "tier": "Privilege Member" if role == "Guest Member" else "Staff",
        "preferredSuite": preferred_suite
    })

    # Generate session token
    token = f"LIY-AUTH-{uuid.uuid4().hex[:16].upper()}"

    user_clean = {
        "userId": user["userId"],
        "fullName": user["fullName"],
        "email": user["email"],
        "phone": user["phone"],
        "role": user["role"],
        "tier": user["tier"],
        "preferredSuite": user["preferredSuite"],
        "token": token
    }

    return jsonify({
        "message": "Welcome to Hotel Liyera Privilege Club! Your account is active.",
        "user": user_clean
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    is_quick_guest = data.get("quickGuestLogin", False)
    is_quick_admin = data.get("quickAdminLogin", False)

    if is_quick_guest:
        email = "guest@hotelliyera.com"
        password = "guest12345"

    if is_quick_admin:
        email = "admin@hotelliyera.com"
        password = "hoteladmin2026"

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = db.find_user_by_email(email)
    if not user or user.get("password") != password:
        return jsonify({"error": "Invalid email or password. Please verify your credentials."}), 401

    token = f"LIY-AUTH-{uuid.uuid4().hex[:16].upper()}"

    user_clean = {
        "userId": user.get("userId"),
        "fullName": user.get("fullName"),
        "email": user.get("email"),
        "phone": user.get("phone", ""),
        "role": user.get("role", "Guest Member"),
        "tier": user.get("tier", "Privilege Member"),
        "preferredSuite": user.get("preferredSuite", "Deluxe Oceanview Suite"),
        "token": token
    }

    return jsonify({
        "message": f"Welcome back, {user_clean['fullName']}!",
        "user": user_clean
    }), 200

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()

    if not email:
        return jsonify({"error": "Please enter your registered email address."}), 400

    user = db.find_user_by_email(email)
    if not user:
        return jsonify({"error": "No account found with this email address."}), 404

    reset_record = db.create_password_reset_code(email)

    return jsonify({
        "message": f"Password recovery PIN dispatched for {email}.",
        "email": email,
        "demoNotice": "For instant demo evaluation, your 6-digit recovery PIN is provided below:",
        "recoveryCode": reset_record["code"],
        "resetToken": reset_record["token"]
    }), 200

@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    code = data.get("code", "").strip()
    new_password = data.get("newPassword", "")

    if not email or not code or not new_password:
        return jsonify({"error": "Email, verification code, and new password are required."}), 400

    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters long."}), 400

    success = db.verify_and_reset_password(email, code, new_password)
    if not success:
        return jsonify({"error": "Invalid or expired recovery code. Please request a new PIN."}), 400

    return jsonify({
        "success": True,
        "message": "Your password has been successfully updated! You can now sign in with your new credentials."
    }), 200

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "").strip()
    if not token:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify({
        "authenticated": True,
        "token": token
    }), 200
