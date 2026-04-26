"""
SD Pawsense — Health Check Route
"""
from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint — verifies backend is alive."""
    return jsonify({"status": "running"})


@health_bp.route("/", methods=["GET"])
def home():
    """Root endpoint — API info."""
    return jsonify({
        "message": "SD Pawsense API Running",
        "status": "running",
        "endpoints": {
            "health": "GET /health",
            "predict_image": "POST /predict-image",
            "predict_symptoms": "POST /predict-symptoms"
        }
    })
