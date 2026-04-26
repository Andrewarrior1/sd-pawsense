"""
SD Pawsense — Prediction Routes
POST /predict-image   - CNN image-based prediction
POST /predict-symptoms - RNN symptom-based prediction (coming soon)
"""
from flask import Blueprint, request, jsonify

from ai_server.model.loader import predict
from ai_server.utils.image_utils import allowed_file, save_upload
from database.mongo import store_prediction

predict_bp = Blueprint("predict", __name__)


# ============================================================
# POST /predict-image — CNN Model (Working)
# ============================================================
@predict_bp.route("/predict-image", methods=["POST"])
def predict_image():
    """
    Accept an image file and return disease predictions.

    Request:
        Content-Type: multipart/form-data
        Key: file (image file - PNG, JPG, JPEG, WEBP)

    Response (200):
        {
            "top_prediction": { "disease": "...", "confidence": 92.34 },
            "all_predictions": [ ... ],
            "image_id": "...",
            "timestamp": "..."
        }

    Errors:
        400 — No file uploaded / invalid file type
        500 - Model or server error
    """

    # --- Validate: file present ---
    if "file" not in request.files:
        return jsonify({
            "error": "No file uploaded",
            "message": "Please send an image file with key 'file'"
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "error": "Empty filename",
            "message": "The uploaded file has no filename"
        }), 400

    # --- Validate: allowed extension ---
    if not allowed_file(file.filename):
        return jsonify({
            "error": "Invalid file type",
            "message": "Allowed types: PNG, JPG, JPEG, WEBP"
        }), 400

    try:
        # Save image to uploads/ with UUID name
        image_path = save_upload(file)

        # Run CNN inference
        result = predict(image_path)

        # Store in MongoDB
        try:
            doc_id = store_prediction(
                image_path=image_path,
                top_prediction=result["top_prediction"],
                all_predictions=result["all_predictions"]
            )
        except Exception as db_err:
            # Don't fail the prediction if DB is down - just log it
            print(f"[WARN] MongoDB storage failed: {db_err}")
            doc_id = None

        # Build response
        from datetime import datetime, timezone
        response = {
            "top_prediction": result["top_prediction"],
            "all_predictions": result["all_predictions"],
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        if doc_id:
            response["image_id"] = doc_id

        return jsonify(response), 200

    except Exception as e:
        print(f"[ERROR] Prediction error: {e}")
        return jsonify({
            "error": "Prediction failed",
            "message": str(e)
        }), 500


# ============================================================
# POST /predict-symptoms — RNN Model (Coming Soon)
# ============================================================
@predict_bp.route("/predict-symptoms", methods=["POST"])
def predict_symptoms():
    """
    Placeholder for future RNN-based symptom analysis.
    Returns a 'coming soon' response — does NOT fake predictions.
    """
    return jsonify({
        "message": "Symptom-based model coming soon",
        "status": "coming_soon"
    }), 200
