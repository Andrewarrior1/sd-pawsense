from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import transforms, models
from PIL import Image
import os

print("🚀 Starting AI Server...")

# ======================
# INIT APP
# ======================
app = Flask(__name__)
CORS(app)

# ======================
# DEVICE
# ======================
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# ======================
# LOAD MODEL
# ======================
try:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_PATH = os.path.join(BASE_DIR, "best_model.pth")

    print("📂 Loading model from:", MODEL_PATH)

    checkpoint = torch.load(MODEL_PATH, map_location=device)
    class_names = checkpoint["classes"]

    model = models.resnet18()
    model.fc = torch.nn.Sequential(
        torch.nn.Dropout(0.5),
        torch.nn.Linear(model.fc.in_features, len(class_names))
    )

    model.load_state_dict(checkpoint["model_state"])
    model.to(device)
    model.eval()

    print("✅ Model loaded successfully!")

except Exception as e:
    print("❌ ERROR loading model:", e)

# ======================
# TRANSFORM
# ======================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# ======================
# ROUTES
# ======================
@app.route("/")
def home():
    return jsonify({"message": "SD Pawsense API Running 🚀"})

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        image = Image.open(file.stream).convert("RGB")
        image = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image)
            probs = torch.nn.functional.softmax(outputs, dim=1)[0]

        confidence, pred = torch.max(probs, 0)

        return jsonify({
            "disease": class_names[pred.item()],
            "confidence": round(float(confidence.item()) * 100, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ======================
# RUN SERVER
# ======================
if __name__ == "__main__":
    print("🔥 Running Flask server on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)