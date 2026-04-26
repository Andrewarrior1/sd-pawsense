/**
 * SD Pawsense — Centralized API Client
 * All backend communication goes through here.
 */

const API_BASE = "http://localhost:5000";

/**
 * Health check — verify backend is alive
 * GET /health → { "status": "running" }
 */
export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Backend not responding");
  return res.json();
}

/**
 * Predict disease from image (CNN)
 * POST /predict-image
 *
 * @param {File} imageFile - The image file to analyze
 * @returns {{ top_prediction, all_predictions, image_id?, timestamp }}
 */
export async function predictImage(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const res = await fetch(`${API_BASE}/predict-image`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || "Prediction failed");
  }

  return data;
}

/**
 * Predict from symptoms (RNN — coming soon)
 * POST /predict-symptoms
 *
 * @param {string} symptoms - Plain text description of symptoms
 * @returns {{ message, status }}
 */
export async function predictSymptoms(symptoms) {
  const res = await fetch(`${API_BASE}/predict-symptoms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms }),
  });

  return res.json();
}
