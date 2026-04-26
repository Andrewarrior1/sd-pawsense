"""
SD Pawsense — Image Utilities
Handles image validation, saving, and transformation.
"""
import os
import uuid
from werkzeug.utils import secure_filename
from torchvision import transforms

from ai_server.config import ALLOWED_EXTENSIONS, UPLOAD_FOLDER


def allowed_file(filename: str) -> bool:
    """Check if the file extension is in the allowed set."""
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_upload(file) -> str:
    """
    Save an uploaded file to the uploads directory with a UUID filename.

    Args:
        file: werkzeug FileStorage object

    Returns:
        The relative path string (e.g. "uploads/abc123.jpg")
    """
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    original = secure_filename(file.filename)
    ext = original.rsplit(".", 1)[1].lower() if "." in original else "jpg"
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, unique_name)

    file.save(filepath)
    return filepath


def get_transform():
    """Return the image preprocessing pipeline for the CNN model."""
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])
