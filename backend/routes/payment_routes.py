import time
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from db import db

payment_bp = Blueprint("payments", __name__, url_prefix="/api/payments")

# Demo test cards supported in sandbox mode
DEMO_TEST_CARDS = [
    {
        "brand": "Visa",
        "number": "4242 •••• •••• 4242",
        "rawNumber": "4242424242424242",
        "exp": "12/28",
        "cvv": "123",
        "type": "Demo Successful Authorization"
    },
    {
        "brand": "MasterCard",
        "number": "5555 •••• •••• 4444",
        "rawNumber": "5555555555554444",
        "exp": "10/27",
        "cvv": "456",
        "type": "Demo 3D Secure Verified"
    },
    {
        "brand": "American Express",
        "number": "3782 •••••• 0005",
        "rawNumber": "378282246310005",
        "exp": "08/29",
        "cvv": "8888",
        "type": "Demo Corporate Luxury Card"
    }
]

@payment_bp.route("/test-cards", methods=["GET"])
def get_test_cards():
    return jsonify({
        "mode": "SANDBOX_DEMO",
        "description": "Pre-configured test cards for instant testing without real funds.",
        "testCards": DEMO_TEST_CARDS
    }), 200

@payment_bp.route("/create-intent", methods=["POST"])
def create_payment_intent():
    """
    Prepares a payment intent for direct reservation checkout or PayHere gateway.
    """
    data = request.get_json(silent=True) or {}
    
    room_type = data.get("roomType", "Deluxe Oceanview Suite")
    checkin_str = data.get("checkin")
    checkout_str = data.get("checkout")

    # Calculate nights
    nights = 1
    if checkin_str and checkout_str:
        try:
            d_in = datetime.fromisoformat(checkin_str)
            d_out = datetime.fromisoformat(checkout_str)
            nights = max((d_out - d_in).days, 1)
        except Exception:
            nights = 1

    # Find room price
    all_rooms = db.get_all_rooms()
    matched = next((r for r in all_rooms if r.get("type", "").lower() == room_type.lower()), None)
    unit_price = matched.get("pricePerNight", 180) if matched else 180

    subtotal = unit_price * nights
    service_charge = round(subtotal * 0.10, 2) # 10% Luxury Service Charge
    taxes = round(subtotal * 0.05, 2)          # 5% Resort & Tourism Tax
    grand_total = round(subtotal + service_charge + taxes, 2)

    order_id = f"ORDER-LIY-{uuid.uuid4().hex[:8].upper()}"

    return jsonify({
        "orderId": order_id,
        "mode": "DEMO_SANDBOX",
        "roomType": room_type,
        "unitPrice": unit_price,
        "nights": nights,
        "subtotal": subtotal,
        "serviceCharge": service_charge,
        "taxes": taxes,
        "grandTotal": grand_total,
        "currency": "USD",
        "merchantInfo": {
            "merchantName": "Hotel Liyera Luxury Resort & Spa",
            "merchantId": "DEMO_LIYERA_MERCHANT",
            "gateway": "PayHere Sandbox / Luxury Direct"
        }
    }), 200

@payment_bp.route("/process-demo", methods=["POST"])
def process_demo_payment():
    """
    Processes simulated instant card or PayHere checkout.
    Creates or finalizes the reservation and creates a verifiable transaction log.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing payment request body"}), 400

    booking_ref = data.get("bookingReference")
    reservation_payload = data.get("reservation")

    # If reservation payload is included, create or ensure reservation exists
    reservation = None
    if reservation_payload:
        reservation = db.create_reservation(reservation_payload)
        booking_ref = reservation["bookingReference"]
    elif booking_ref:
        reservations = db.get_all_reservations()
        reservation = next((r for r in reservations if r.get("bookingReference") == booking_ref), None)

    if not booking_ref:
        booking_ref = f"LIY-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

    amount = float(data.get("amount", reservation.get("totalPrice", 250) if reservation else 250))
    currency = data.get("currency", "USD")
    method = data.get("paymentMethod", "Demo PayHere / Card")
    card_last4 = str(data.get("cardLast4", "4242"))[-4:]
    card_brand = data.get("cardBrand", "Visa")
    guest_name = data.get("guestName") or (reservation.get("fullName") if reservation else "Valued Guest")
    guest_email = data.get("guestEmail") or (reservation.get("email") if reservation else "")

    # Record payment transaction
    payment_record = db.record_payment({
        "bookingReference": booking_ref,
        "amount": amount,
        "currency": currency,
        "paymentMethod": method,
        "cardLast4": card_last4,
        "cardBrand": card_brand,
        "guestName": guest_name,
        "guestEmail": guest_email,
        "status": "Successful"
    })

    # Prepare detailed receipt
    receipt = {
        "receiptNumber": f"REC-{payment_record['transactionId']}",
        "transactionId": payment_record["transactionId"],
        "bookingReference": booking_ref,
        "amount": amount,
        "currency": currency,
        "paymentMethod": method,
        "cardBrand": card_brand,
        "cardLast4": card_last4,
        "status": "Paid & Confirmed",
        "paidAt": payment_record["timestamp"],
        "guestName": guest_name,
        "guestEmail": guest_email,
        "suite": reservation.get("roomType", "Luxury Suite") if reservation else "Luxury Suite",
        "assignedRoom": reservation.get("roomNumber", "Assigned at Check-in") if reservation else "301",
        "checkin": reservation.get("checkin", "") if reservation else "",
        "checkout": reservation.get("checkout", "") if reservation else "",
        "guarantee": "100% Direct Booking Guarantee"
    }

    return jsonify({
        "success": True,
        "message": "Demo payment authorized successfully!",
        "transactionId": payment_record["transactionId"],
        "bookingReference": booking_ref,
        "receipt": receipt
    }), 200

@payment_bp.route("/ipn", methods=["POST"])
def payhere_ipn():
    """
    Webhook handler for PayHere Instant Payment Notification (IPN).
    Works with both real sandbox callbacks and simulated IPN postbacks.
    """
    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})
    
    order_id = data.get("order_id") or data.get("bookingReference")
    status_code = str(data.get("status_code", data.get("status", ""))).lower()
    payment_id = data.get("payment_id") or f"PH-{uuid.uuid4().hex[:8].upper()}"
    payhere_amount = float(data.get("payhere_amount", data.get("amount", 0)))

    if not order_id:
        return jsonify({"error": "Missing order_id"}), 400

    # In PayHere, status_code '2' or 'paid' indicates successful payment
    if status_code in ["2", "paid", "success", "successful"]:
        db.record_payment({
            "transactionId": payment_id,
            "bookingReference": order_id,
            "amount": payhere_amount,
            "paymentMethod": "PayHere Gateway (IPN)",
            "cardLast4": "PayHere",
            "cardBrand": "PayHere",
            "status": "Successful"
        })
        return "IPN received and verified", 200
    else:
        # Mark reservation as failed or pending
        db.update_reservation(order_id, {
            "paymentStatus": "Payment Failed"
        })
        return "IPN recorded (failed)", 200

@payment_bp.route("/verify/<transaction_id>", methods=["GET"])
def verify_payment(transaction_id):
    payments = db.get_all_payments()
    matched = next((p for p in payments if p.get("transactionId") == transaction_id), None)
    if not matched:
        return jsonify({"error": "Transaction not found"}), 404

    return jsonify({
        "status": "verified",
        "payment": matched
    }), 200
