from datetime import datetime

class Reservation:
    def __init__(self, checkin, checkout, guests, room_type):
        self.checkin = checkin
        self.checkout = checkout
        self.guests = guests
        self.room_type = room_type
        self.created_at = datetime.utcnow()

    def to_dict(self):
        return {
            "checkin": self.checkin,
            "checkout": self.checkout,
            "guests": self.guests,
            "room_type": self.room_type,
            "created_at": self.created_at,
        }
