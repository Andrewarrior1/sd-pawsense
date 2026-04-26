"""
SD Pawsense — Centralized Configuration
"""
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ============================
# Flask
# ============================
SECRET_KEY = os.environ.get("SECRET_KEY", "sd-pawsense-dev-key")

# ============================
# Upload
# ============================
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

# ============================
# AI Model
# ============================
MODEL_PATH = os.path.join(BASE_DIR, "best_model.pth")

# ============================
# MongoDB
# ============================
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "sd_pawsense")
