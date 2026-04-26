"""
SD Pawsense — AI Model Loader & Inference
Handles loading the trained ResNet18 model and running predictions.
"""
import torch
from torchvision import models
from PIL import Image

from ai_server.utils.image_utils import get_transform


# Module-level cache
_model = None
_class_names = None
_device = None
_transform = None


def load_model(model_path: str):
    """
    Load the trained model from a checkpoint file.
    Caches the model so it is only loaded once.

    Args:
        model_path: absolute path to best_model.pth
    """
    global _model, _class_names, _device, _transform

    if _model is not None:
        return  # Already loaded

    print("[INFO] Loading AI model...")

    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"   Using device: {_device}")

    checkpoint = torch.load(model_path, map_location=_device)
    _class_names = checkpoint["classes"]

    _model = models.resnet18()
    _model.fc = torch.nn.Sequential(
        torch.nn.Dropout(0.5),
        torch.nn.Linear(_model.fc.in_features, len(_class_names))
    )

    _model.load_state_dict(checkpoint["model_state"])
    _model.to(_device)
    _model.eval()

    _transform = get_transform()

    print(f"[OK] Model loaded - {len(_class_names)} classes: {_class_names}")


def predict(image_path: str) -> dict:
    """
    Run inference on an image file.

    Args:
        image_path: path to the saved image on disk

    Returns:
        dict with "top_prediction" and "all_predictions"
    """
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    image = Image.open(image_path).convert("RGB")
    tensor = _transform(image).unsqueeze(0).to(_device)

    with torch.no_grad():
        outputs = _model(tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)[0]

    # Build all predictions (sorted by confidence descending)
    all_predictions = []
    for i, class_name in enumerate(_class_names):
        all_predictions.append({
            "disease": class_name,
            "confidence": round(float(probs[i].item()) * 100, 2)
        })
    all_predictions.sort(key=lambda x: x["confidence"], reverse=True)

    # Top prediction
    top = all_predictions[0]

    return {
        "top_prediction": {
            "disease": top["disease"],
            "confidence": top["confidence"]
        },
        "all_predictions": all_predictions
    }
