// api/create-stripe-payment-intent.js
// Example Next.js / Node.js API Route for Stripe PaymentIntent

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, currency = "usd", bookingReference, roomType, guestEmail } = req.body;

    if (!amount || !bookingReference) {
      return res.status(400).json({ error: "Missing required booking details" });
    }

    // Amount in cents (e.g. $450.00 -> 45000)
    const amountInCents = Math.round(Number(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      receipt_email: guestEmail,
      metadata: {
        bookingReference,
        roomType: roomType || "Luxury Suite",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error);
    res.status(500).json({ error: error.message });
  }
}
