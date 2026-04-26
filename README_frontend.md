# SD Pawsense — Frontend Documentation

React + Vite frontend with glassmorphic dark theme and Framer Motion animations.

---

## 📁 Folder Structure

```
frontend/
├── index.html              # HTML entry point (Inter font, meta tags)
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # React DOM render
    ├── App.jsx             # Root component (composes all sections)
    ├── App.css             # Complete design system (CSS variables, glass cards, animations)
    ├── components/
    │   ├── Header.jsx       # Brand badge + gradient title + subtitle
    │   ├── FeatureCards.jsx  # 3 info cards (5 Types, CNN+RNN, Pet Health)
    │   ├── ControlCenter.jsx # Tabbed hub (Image Detection / Symptom Analysis)
    │   ├── ImageUploader.jsx # Dropzone + file input + preview
    │   ├── CameraModal.jsx   # Camera capture with front/back switch
    │   ├── ResultsPanel.jsx  # Loading/error/success states + progress bars
    │   ├── DiseaseGuide.jsx  # Collapsible accordion with 5 disease cards
    │   └── Footer.jsx        # Disclaimer text
    └── services/
        └── api.js           # Centralized API client (fetch wrappers)
```

## 🔧 Setup

### Prerequisites
- Node.js 18+

### Installation & Run
```bash
cd sd_pawsense/frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

## 🧩 Component Map

```
App
 ├── Header          — Animated badge, gradient "SD Pawsense" title
 ├── FeatureCards     — 3-column grid of glass cards
 ├── ControlCenter    — Main interaction hub
 │    ├── [Tab: Image Detection CNN]
 │    │    ├── ImageUploader  — Drag-drop / file picker / preview
 │    │    ├── CameraModal    — Live camera capture overlay
 │    │    └── ResultsPanel   — Predictions with animated bars
 │    └── [Tab: Symptom Analysis RNN]
 │         └── Textarea + suggestion chips + "Coming Soon"
 ├── DiseaseGuide    — Collapsible 5-disease reference
 └── Footer          — Disclaimer
```

## 🎨 Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#030014` | Page background |
| `--violet-600` | `#7c3aed` | Primary accent |
| `--fuchsia-500` | `#d946ef` | Gradient secondary |
| `--bg-card` | `rgba(255,255,255,0.04)` | Glass card background |
| `--border-card` | `rgba(255,255,255,0.08)` | Card borders |

### Typography
- **Font**: Inter (Google Fonts) — weights 400, 500, 600, 700, 800
- **Scale**: xs (0.75rem) → 4xl (2.25rem)

### Effects
- **Glassmorphism**: `backdrop-filter: blur(16px)` + semi-transparent bg + subtle border
- **Animations**: Framer Motion `initial/animate` for all components, CSS keyframes for spinner

## 📡 API Integration

All API calls go through `services/api.js`:

```javascript
import { predictImage, predictSymptoms, healthCheck } from './services/api';

// Image prediction
const result = await predictImage(imageFile);
// → { top_prediction, all_predictions, image_id, timestamp }

// Symptom analysis (returns "coming soon")
const result = await predictSymptoms("itching, red spots");
// → { message, status: "coming_soon" }

// Health check
const status = await healthCheck();
// → { status: "running" }
```

**Backend base URL:** `http://localhost:5000` (hardcoded in `api.js`)

## 📱 Responsive Design

- **Desktop** (>1024px): 3-column feature cards, 2-column disease guide
- **Tablet** (768–1024px): 2-column layouts
- **Mobile** (<768px): Single column, stacked tabs, full-width buttons

## 🔮 Camera API

The `CameraModal` component uses `navigator.mediaDevices.getUserMedia()`:
- Supports front (`user`) and back (`environment`) cameras
- Captures frames via hidden `<canvas>`
- Handles permission denied gracefully with error message
- Auto-closes stream on unmount
