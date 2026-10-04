// api/stripe-webhook.js
// Example Next.js / Node.js API Webhook Route for Stripe events

import Stripe from "stripe";
import { buffer } from "micro";
import clientPromise from "../../lib/mongodb"; // Optional MongoDB client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Stripe webhook requires raw body for signature verification
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } else {
      event = JSON.parse(buf.toString());
    }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout / payment event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const bookingRef = paymentIntent.metadata?.bookingReference;

      if (bookingRef) {
        try {
          const client = await clientPromise;
          const db = client.db("hotelLiyera");

          await db.collection("reservations").updateOne(
            { bookingReference: bookingRef },
            {
              $set: {
                paymentStatus: "Paid",
                paymentId: paymentIntent.id,
                paidAt: new Date().toISOString(),
              },
            }
          );
        } catch (dbErr) {
          console.warn("Database update error:", dbErr.message);
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const bookingRef = paymentIntent.metadata?.bookingReference;
      console.warn(`Payment failed for booking ${bookingRef}`);
      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
