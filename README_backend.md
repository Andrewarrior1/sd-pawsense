# SD Pawsense — Backend Documentation

Flask-based REST API serving the CNN model for dog skin disease detection.

---

## 📁 Folder Structure

```
backend/
├── ai_server/
│   ├── __init__.py       # Flask app factory (create_app)
│   ├── app.py            # Entry point — run this to start server
│   ├── config.py         # All configuration (DB, paths, limits)
│   ├── routes/
│   │   ├── health.py     # GET /health, GET /
│   │   └── predict.py    # POST /predict-image, POST /predict-symptoms
│   ├── model/
│   │   └── loader.py     # Model loading + inference
│   └── utils/
│       ├── image_utils.py  # Image validation, UUID saving, transforms
│       └── normalize.py    # Disease name normalization
│
├── database/
│   └── mongo.py          # MongoDB connection + storage
│
├── uploads/              # Saved images (UUID filenames)
└── best_model.pth        # Trained model weights
```

## 🔧 Setup

### Prerequisites
- Python 3.9+
- MongoDB running locally on `mongodb://localhost:27017`

### Installation
```bash
cd sd_pawsense

# Create/activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install flask flask-cors torch torchvision Pillow pymongo
```

### Running the Server
```bash
cd backend/ai_server
python app.py
```

Output:
```
🚀 Loading AI model...
✅ Model loaded — 6 classes: [...]
🔥 SD Pawsense AI initialized successfully!
==================================================
  🐾 SD Pawsense AI Server
  📍 http://localhost:5000
==================================================
```

## 📡 API Reference

### `GET /health`

Health check — verify backend is alive.

**Response:**
```json
{ "status": "running" }
```

---

### `GET /`

API overview.

**Response:**
```json
{
  "message": "SD Pawsense API Running 🚀",
  "status": "running",
  "endpoints": {
    "health": "GET /health",
    "predict_image": "POST /predict-image",
    "predict_symptoms": "POST /predict-symptoms"
  }
}
```

---

### `POST /predict-image`

Run CNN inference on an uploaded image.

**Request:**
- `Content-Type: multipart/form-data`
- Key: `file` — image file (PNG, JPG, JPEG, WEBP)
- Max size: 16 MB

**Example (curl):**
```bash
curl -X POST http://localhost:5000/predict-image \
  -F "file=@dog_photo.jpg"
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append("file", imageFile);

const res = await fetch("http://localhost:5000/predict-image", {
  method: "POST",
  body: formData
});
const data = await res.json();
```

**Success Response (200):**
```json
{
  "top_prediction": {
    "disease": "Dermatitis",
    "confidence": 92.34
  },
  "all_predictions": [
    { "disease": "Dermatitis", "confidence": 92.34 },
    { "disease": "Fungal_infections", "confidence": 5.21 },
    { "disease": "Healthy", "confidence": 2.45 },
    { "disease": "Hypersensitivity", "confidence": 0.00 },
    { "disease": "demodicosis", "confidence": 0.00 },
    { "disease": "ringworm", "confidence": 0.00 }
  ],
  "image_id": "680c...",
  "timestamp": "2026-04-26T03:00:00+00:00"
}
```

**Error Responses:**

| Code | Condition | Body |
|------|-----------|------|
| 400 | No file uploaded | `{ "error": "No file uploaded", "message": "..." }` |
| 400 | Empty filename | `{ "error": "Empty filename", "message": "..." }` |
| 400 | Invalid file type | `{ "error": "Invalid file type", "message": "Allowed types: PNG, JPG, JPEG, WEBP" }` |
| 500 | Model/server error | `{ "error": "Prediction failed", "message": "..." }` |

---

### `POST /predict-symptoms`

RNN-based symptom analysis (not yet implemented).

**Response (200):**
```json
{
  "message": "Symptom-based model coming soon",
  "status": "coming_soon"
}
```

## 🧠 Model Details

| Property | Value |
|----------|-------|
| Architecture | ResNet18 |
| Fine-tuned | Yes (from ImageNet pretrained weights) |
| Dropout | 0.5 |
| Input size | 224 × 224 pixels |
| Accuracy | ~94% |
| Framework | PyTorch |

**Classes:**
1. Dermatitis
2. Fungal_infections
3. Healthy
4. Hypersensitivity
5. demodicosis
6. ringworm

## 💾 MongoDB Schema

**Database:** `sd_pawsense`
**Collection:** `predictions`

```json
{
  "_id": "ObjectId",
  "image_path": "C:/projects/sd_pawsense/backend/uploads/abc123.jpg",
  "top_prediction": {
    "disease": "Dermatitis",
    "confidence": 92.34
  },
  "all_predictions": [ ... ],
  "timestamp": "2026-04-26T03:00:00+00:00"
}
```

## ⚙️ Configuration

All config is in `config.py` and can be overridden via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017` | MongoDB connection string |
| `DB_NAME` | `sd_pawsense` | Database name |
| `SECRET_KEY` | `sd-pawsense-dev-key` | Flask secret key |
