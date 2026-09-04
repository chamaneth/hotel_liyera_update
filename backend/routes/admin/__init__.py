from flask import Blueprint
from .admin_auth import admin_auth_bp
from .admin_overview import admin_overview_bp
from .admin_reservations import admin_reservations_bp
from .admin_rooms import admin_rooms_bp
from .admin_payments import admin_payments_bp
from .admin_inquiries import admin_inquiries_bp

# Master Admin Blueprint
admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# Register modular sub-blueprints
admin_bp.register_blueprint(admin_auth_bp)
admin_bp.register_blueprint(admin_overview_bp)
admin_bp.register_blueprint(admin_reservations_bp)
admin_bp.register_blueprint(admin_rooms_bp)
admin_bp.register_blueprint(admin_payments_bp)
admin_bp.register_blueprint(admin_inquiries_bp)
