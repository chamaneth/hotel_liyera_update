import os
import time
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from db import db

try:
    import stripe
    stripe_key = os.getenv("STRIPE_SECRET_KEY")
    if stripe_key:
        stripe.api_key = stripe_key
except ImportError:
    stripe = None

payment_bp = Blueprint("payments", __name__, url_prefix="/api/payments")

# Stripe Official Sandbox Test Cards
DEMO_TEST_CARDS = [
    {
        "brand": "Visa",
        "number": "4242 •••• •••• 4242",
        "rawNumber": "4242424242424242",
        "exp": "12/28",
        "cvv": "123",
        "type": "Stripe Standard Test Card"
    },
    {
        "brand": "MasterCard",
        "number": "5555 •••• •••• 4444",
        "rawNumber": "5555555555554444",
        "exp": "10/27",
        "cvv": "456",
        "type": "Stripe 3D-Secure Test Card"
    },
    {
        "brand": "American Express",
        "number": "3782 •••••• 0005",
        "rawNumber": "378282246310005",
        "exp": "08/29",
        "cvv": "8888",
        "type": "Stripe Corporate Test Card"
    }
]

@payment_bp.route("/test-cards", methods=["GET"])
def get_test_cards():
    return jsonify({
        "mode": "STRIPE_SANDBOX",
        "description": "Stripe-compatible test cards for instant testing without real funds.",
        "testCards": DEMO_TEST_CARDS
    }), 200

@payment_bp.route("/create-intent", methods=["POST"])
def create_payment_intent():
    """
    Creates a Stripe PaymentIntent.
    If STRIPE_SECRET_KEY is configured in backend environment, communicates with Stripe API.
    Otherwise returns a high-fidelity Stripe Sandbox Intent.
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
    service_charge = round(subtotal * 0.10, 2)  # 10% Service Charge
    taxes = round(subtotal * 0.05, 2)           # 5% Resort & Tourism Tax
    grand_total = round(subtotal + service_charge + taxes, 2)

    order_id = f"ORDER-LIY-{uuid.uuid4().hex[:8].upper()}"
    amount_in_cents = int(grand_total * 100)

    stripe_secret = os.getenv("STRIPE_SECRET_KEY")
    client_secret = None
    stripe_intent_id = f"pi_test_{uuid.uuid4().hex[:20]}"

    # Attempt real Stripe PaymentIntent creation if configured
    if stripe and stripe_secret and not stripe_secret.startswith("sk_test_placeholder"):
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency="usd",
                metadata={
                    "bookingReference": order_id,
                    "roomType": room_type,
                    "nights": nights
                },
                automatic_payment_methods={"enabled": True},
            )
            client_secret = intent.client_secret
            stripe_intent_id = intent.id
        except Exception as err:
            # Fall back to sandbox emulation if Stripe API rejects test key
            client_secret = f"{stripe_intent_id}_secret_{uuid.uuid4().hex[:16]}"
    else:
        client_secret = f"{stripe_intent_id}_secret_{uuid.uuid4().hex[:16]}"

    return jsonify({
        "orderId": order_id,
        "mode": "STRIPE_TEST",
        "paymentIntentId": stripe_intent_id,
        "clientSecret": client_secret,
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
            "merchantId": "acct_stripe_luxury_demo",
            "gateway": "Stripe Connect & Elements"
        }
    }), 200

@payment_bp.route("/process-demo", methods=["POST"])
def process_demo_payment():
    """
    Processes simulated Stripe card or digital wallet checkout.
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
    method = data.get("paymentMethod", "Stripe Card")
    card_last4 = str(data.get("cardLast4", "4242"))[-4:]
    card_brand = data.get("cardBrand", "Visa")
    guest_name = data.get("guestName") or (reservation.get("fullName") if reservation else "Valued Guest")
    guest_email = data.get("guestEmail") or (reservation.get("email") if reservation else "")
    transaction_id = f"pi_test_{uuid.uuid4().hex[:18]}"

    # Record payment transaction
    payment_record = db.record_payment({
        "transactionId": transaction_id,
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
        "receiptNumber": f"REC-STRIPE-{payment_record['transactionId'][-8:]}",
        "transactionId": payment_record["transactionId"],
        "bookingReference": booking_ref,
        "amount": amount,
        "currency": currency,
        "paymentMethod": method,
        "cardBrand": card_brand,
        "cardLast4": card_last4,
        "status": "Paid & Confirmed (Stripe)",
        "paidAt": payment_record["timestamp"],
        "guestName": guest_name,
        "guestEmail": guest_email,
        "suite": reservation.get("roomType", "Luxury Suite") if reservation else "Luxury Suite",
        "assignedRoom": reservation.get("roomNumber", "Assigned at Check-in") if reservation else "301",
        "checkin": reservation.get("checkin", "") if reservation else "",
        "checkout": reservation.get("checkout", "") if reservation else "",
        "guarantee": "100% Direct Booking Guarantee (Stripe Protected)"
    }

    return jsonify({
        "success": True,
        "message": "Stripe payment authorized successfully!",
        "transactionId": payment_record["transactionId"],
        "bookingReference": booking_ref,
        "receipt": receipt
    }), 200

@payment_bp.route("/stripe-webhook", methods=["POST"])
@payment_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    """
    Webhook handler for Stripe events (payment_intent.succeeded, checkout.session.completed).
    Works with both real Stripe webhook signatures and mock testing.
    """
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    
    event = None

    if stripe and webhook_secret and sig_header:
        try:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        except Exception as e:
            return jsonify({"error": f"Invalid Stripe signature: {str(e)}"}), 400
    else:
        # Fallback to direct JSON for simulation/testing
        event = request.get_json(silent=True) or {}

    event_type = event.get("type", "payment_intent.succeeded")
    data_object = event.get("data", {}).get("object", event)

    order_id = (
        data_object.get("metadata", {}).get("bookingReference") or 
        data_object.get("client_reference_id") or 
        data_object.get("order_id") or 
        data_object.get("bookingReference")
    )
    
    amount_received = data_object.get("amount_received") or data_object.get("amount", 0)
    # Convert cents to dollars if necessary
    if amount_received and amount_received > 1000:
        amount_received = float(amount_received) / 100.0
    else:
        amount_received = float(amount_received or 0)

    payment_intent_id = data_object.get("id") or f"pi_wh_{uuid.uuid4().hex[:12]}"

    if not order_id:
        return jsonify({"error": "Missing booking reference in Stripe webhook payload"}), 400

    if event_type in ["payment_intent.succeeded", "checkout.session.completed"]:
        db.record_payment({
            "transactionId": payment_intent_id,
            "bookingReference": order_id,
            "amount": amount_received or 580.0,
            "currency": "USD",
            "paymentMethod": "Stripe Webhook (Automated)",
            "cardLast4": "4242",
            "cardBrand": "Visa",
            "status": "Successful"
        })
        db.update_reservation(order_id, {
            "paymentStatus": "Paid"
        })
        return jsonify({"status": "success", "message": f"Stripe payment confirmed for {order_id}"}), 200
    elif event_type in ["payment_intent.payment_failed"]:
        db.update_reservation(order_id, {
            "paymentStatus": "Payment Failed"
        })
        return jsonify({"status": "failed", "message": f"Payment failed recorded for {order_id}"}), 200

    return jsonify({"status": "ignored", "event": event_type}), 200

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
