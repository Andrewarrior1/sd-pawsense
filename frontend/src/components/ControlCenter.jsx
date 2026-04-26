import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageUploader from './ImageUploader';
import CameraModal from './CameraModal';
import ResultsPanel from './ResultsPanel';
import { predictImage, predictSymptoms } from '../services/api';

const SUGGESTIONS = [
  'itching, red spots, hair loss',
  'circular bald patches, scaly skin',
  'swelling and redness, allergy',
  'crusting, fungal, discharge',
];

export default function ControlCenter() {
  const [activeTab, setActiveTab] = useState('image');

  // Image tab state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Symptom tab state
  const [symptoms, setSymptoms] = useState('');
  const [symptomResult, setSymptomResult] = useState(null);

  const handleImageSelected = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setStatus('idle');
    setResults(null);
    setError(null);
  };

  const handleCameraCapture = (file) => {
    handleImageSelected(file);
    setCameraOpen(false);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setStatus('loading');
    setResults(null);
    setError(null);

    try {
      const data = await predictImage(imageFile);
      setResults(data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Failed to connect to backend. Is the server running?');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    handleAnalyze();
  };

  const handleSymptomAnalyze = async () => {
    if (!symptoms.trim()) return;
    try {
      const data = await predictSymptoms(symptoms);
      setSymptomResult(data);
    } catch {
      setSymptomResult({ message: 'Failed to connect to backend', status: 'error' });
    }
  };

  return (
    <>
      <motion.div
        className="glass-card control-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="control-center__inner">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'image' ? 'tab--active' : ''}`}
              onClick={() => setActiveTab('image')}
              id="tab-image"
            >
              <span className="tab__icon">📷</span>
              Image Detection
              <span className="tab__badge">CNN</span>
            </button>
            <button
              className={`tab ${activeTab === 'symptom' ? 'tab--active' : ''}`}
              onClick={() => setActiveTab('symptom')}
              id="tab-symptom"
            >
              <span className="tab__icon">🔍</span>
              Symptom Analysis
              <span className="tab__badge">RNN</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'image' ? (
              <>
                {/* Server Selector */}
                <div className="server-selector">
                  <span className="server-selector__icon">⚙️</span>
                  Backend Server
                  <span className="server-selector__pill">localhost ✓</span>
                </div>

                <ImageUploader
                  onImageSelected={handleImageSelected}
                  hasImage={!!imageFile}
                  imagePreview={imagePreview}
                  onCameraOpen={() => setCameraOpen(true)}
                />

                {/* Analyze Button */}
                {imageFile && (
                  <motion.button
                    className="btn btn--primary btn--full"
                    onClick={handleAnalyze}
                    disabled={status === 'loading'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="analyze-btn"
                  >
                    {status === 'loading' ? (
                      <>⏳ Analyzing...</>
                    ) : (
                      <>🔬 Analyze Image</>
                    )}
                  </motion.button>
                )}

                <ResultsPanel
                  status={status}
                  results={results}
                  error={error}
                  onRetry={handleRetry}
                />
              </>
            ) : (
              /* Symptom Analysis Tab */
              <div className="symptom-tab">
                <div className="symptom-tab__label">Describe your dog's symptoms</div>
                <textarea
                  className="symptom-tab__textarea"
                  placeholder={`Enter symptoms in plain language...\ne.g. itching, red spots on belly, some hair loss around ears`}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  id="symptom-textarea"
                />

                <div className="symptom-tab__suggestions">
                  <div className="symptom-tab__suggestions-label">Quick suggestions:</div>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="suggestion-chip"
                      onClick={() => setSymptoms(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  className="btn btn--primary btn--full"
                  onClick={handleSymptomAnalyze}
                  disabled={!symptoms.trim()}
                  id="analyze-symptoms-btn"
                >
                  🔍 Analyze Symptoms
                </button>

                {symptomResult && (
                  <div className="coming-soon">
                    <div className="coming-soon__icon">🧠</div>
                    <div className="coming-soon__title">
                      {symptomResult.status === 'coming_soon' ? 'Coming Soon' : 'Error'}
                    </div>
                    <div className="coming-soon__text">{symptomResult.message}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </>
  );
}
