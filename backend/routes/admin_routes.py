"""
Hotel Liyera Admin Routes.
Modularized into sub-blueprints in `backend/routes/admin/`:
- admin_auth.py
- admin_overview.py
- admin_reservations.py
- admin_rooms.py
- admin_payments.py
- admin_inquiries.py
"""
from .admin import admin_bp

__all__ = ["admin_bp"]
