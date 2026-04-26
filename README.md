# SD Pawsense

**AI-Powered Dog Skin Disease Detection System**

An end-to-end web application that uses deep learning (CNN) to detect skin diseases in dogs from uploaded photos. Built with a Flask backend and React frontend.

---

## 🏗️ Architecture

```
sd_pawsense/
│
├── backend/                  # Flask API + AI Model
│   ├── ai_server/            # Flask app (factory pattern)
│   │   ├── __init__.py       # App factory (create_app)
│   │   ├── app.py            # Entry point
│   │   ├── config.py         # Centralized config
│   │   ├── routes/           # API endpoints (Blueprints)
│   │   ├── model/            # AI model loading & inference
│   │   └── utils/            # Image utils, name normalization
│   ├── database/             # MongoDB integration
│   ├── uploads/              # Saved uploaded images
│   └── best_model.pth        # Trained model weights (~94% accuracy)
│
├── frontend/                 # React + Vite
│   └── src/
│       ├── components/       # 8 React components
│       └── services/         # API client
│
├── venv/                     # Python virtual environment
├── README.md                 # ← You are here
├── README_backend.md         # Backend docs
└── README_frontend.md        # Frontend docs
```

## 🧠 AI Model

| Property | Value |
|----------|-------|
| Architecture | ResNet18 (pretrained, fine-tuned) |
| Accuracy | ~94% |
| Input | 224×224 RGB image |
| Classes | 6 (5 diseases + Healthy) |

**Disease Classes:**
- Demodicosis
- Dermatitis
- Fungal Infections
- Hypersensitivity
- Ringworm
- Healthy

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend
```bash
# Activate virtual environment
cd sd_pawsense
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install flask flask-cors torch torchvision Pillow pymongo

# Start server
cd backend/ai_server
python app.py
```
Server runs at: `http://localhost:5000`

### 2. Frontend
```bash
cd sd_pawsense/frontend
npm install
npm run dev
```
App runs at: `http://localhost:5173`

### 3. MongoDB
- Install [MongoDB Community](https://www.mongodb.com/try/download/community) or use MongoDB Compass
- Default connection: `mongodb://localhost:27017`
- Database: `sd_pawsense`
- Collection: `predictions` (auto-created on first prediction)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/` | API info |
| `POST` | `/predict-image` | CNN image prediction |
| `POST` | `/predict-symptoms` | RNN symptom analysis (coming soon) |

## 🗺️ Roadmap

- [x] CNN image detection (ResNet18)
- [x] React frontend with glassmorphic UI
- [x] MongoDB prediction storage
- [ ] RNN symptom-based analysis
- [ ] Cloud image storage (Cloudinary / AWS S3)
- [ ] User authentication & history
- [ ] Production deployment

## ⚠️ Disclaimer

SD Pawsense is for **educational and early detection purposes only**. Always consult a licensed veterinarian for diagnosis and treatment.
