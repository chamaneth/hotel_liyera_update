// pages/api/create-reservation.js
import clientPromise from "../../lib/mongodb"; // your MongoDB client

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { checkin, checkout, guests, roomType, guest_name, email, phone } = req.body;
    const client = await clientPromise;
    const db = client.db("hotelLiyera");

    // 1️⃣ Find available room
    const availableRoom = await db.collection("rooms").findOne({ room_type: roomType, status: "available" });
    if (!availableRoom) return res.status(400).json({ error: "No rooms available for this type." });

    // 2️⃣ Calculate price
    const checkInDate = new Date(checkin);
    const checkOutDate = new Date(checkout);
    const totalNights = (checkOutDate - checkInDate) / (1000*60*60*24);
    const totalPrice = availableRoom.price_per_night * totalNights;

    // 3️⃣ Insert reservation with pending payment
    const result = await db.collection("reservations").insertOne({
      guest_name,
      email,
      phone,
      room_type: roomType,
      check_in: checkInDate,
      check_out: checkOutDate,
      guests,
      total_price: totalPrice,
      payment_status: "pending",
      payment_id: null,
      assigned_room_number: availableRoom.room_number
    });

    // 4️⃣ Return reservationId + totalPrice for PayHere
    res.status(200).json({
      reservationId: result.insertedId,
      totalPrice
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating reservation" });
  }
}
