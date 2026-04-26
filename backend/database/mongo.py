"""
SD Pawsense — MongoDB Integration
Handles connection and prediction storage.
"""
from datetime import datetime, timezone
from pymongo import MongoClient

from ai_server.config import MONGO_URI, DB_NAME


# Lazy-initialized connection
_client = None
_db = None


def get_db():
    """
    Get the MongoDB database instance.
    Connection is created on first call and reused afterwards.
    """
    global _client, _db

    if _db is None:
        print(f"[DB] Connecting to MongoDB at {MONGO_URI}...")
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        _db = _client[DB_NAME]
        print(f"[OK] Connected to database: {DB_NAME}")

    return _db


def store_prediction(image_path: str, top_prediction: dict, all_predictions: list) -> str:
    """
    Store a prediction result in MongoDB.

    Args:
        image_path: path to the saved image file
        top_prediction: dict with "disease" and "confidence"
        all_predictions: list of dicts for all classes

    Returns:
        The inserted document's ID as a string
    """
    db = get_db()

    document = {
        "image_path": image_path,
        "top_prediction": top_prediction,
        "all_predictions": all_predictions,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    result = db.predictions.insert_one(document)
    print(f"[DB] Prediction stored - ID: {result.inserted_id}")

    return str(result.inserted_id)
