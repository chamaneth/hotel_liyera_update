from flask import Flask
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

from reservation_routes import reservation_bp, init_reservation_routes
init_reservation_routes(mongo)
app.register_blueprint(reservation_bp)

if __name__ == "__main__":
    app.run(debug=True)
