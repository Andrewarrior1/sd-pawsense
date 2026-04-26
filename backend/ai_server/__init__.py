"""
SD Pawsense — Flask App Factory
Creates and configures the Flask application.
"""
import os
from flask import Flask
from flask_cors import CORS

from ai_server.config import UPLOAD_FOLDER, MAX_CONTENT_LENGTH, MODEL_PATH


def create_app():
    """
    Create and configure the Flask application.
    Registers all blueprints and loads the AI model.
    """
    app = Flask(__name__)

    # --- Configuration ---
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

    # --- CORS ---
    CORS(app)

    # --- Ensure upload directory exists ---
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # --- Load AI Model ---
    from ai_server.model.loader import load_model
    try:
        load_model(MODEL_PATH)
    except Exception as e:
        print(f"[ERROR] Could not load model: {e}")
        print("   The /predict-image endpoint will not work until the model is loaded.")

    # --- Register Blueprints ---
    from ai_server.routes.health import health_bp
    from ai_server.routes.predict import predict_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(predict_bp)

    print("[OK] SD Pawsense API initialized successfully!")
    return app
