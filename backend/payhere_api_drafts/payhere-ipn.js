import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { order_id, status, payment_id } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db("hotelLiyera");

    if (status === "paid") {
      await db.collection("reservations").updateOne(
        { _id: new ObjectId(order_id) },
        { $set: { payment_status: "paid", payment_id } }
      );

      const reservation = await db.collection("reservations").findOne({ _id: new ObjectId(order_id) });
      await db.collection("rooms").updateOne(
        { room_number: reservation.assigned_room_number },
        { $set: { status: "booked" } }
      );
    } else {
      await db.collection("reservations").updateOne(
        { _id: new ObjectId(order_id) },
        { $set: { payment_status: "failed" } }
      );
    }

    res.status(200).send("IPN received");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
