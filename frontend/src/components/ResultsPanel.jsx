import { motion } from 'framer-motion';

/**
 * Normalize disease name: remove underscores, title case
 */
function normalizeName(name) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Get risk level and color for a disease
 */
function getRisk(disease) {
  const name = disease.toLowerCase().replace(/_/g, ' ');
  if (name === 'healthy') return { level: 'Healthy', color: 'green', badge: 'healthy' };
  if (name === 'hypersensitivity') return { level: 'Low Risk', color: 'blue', badge: 'low' };
  if (name === 'demodicosis' || name === 'dermatitis') return { level: 'Moderate Risk', color: 'amber', badge: 'moderate' };
  if (name.includes('fungal') || name === 'ringworm') return { level: 'High Risk', color: 'red', badge: 'high' };
  return { level: 'Unknown', color: 'violet', badge: 'moderate' };
}

export default function ResultsPanel({ status, results, error, onRetry }) {
  if (status === 'idle') return null;

  return (
    <div className="results">
      {/* Loading */}
      {status === 'loading' && (
        <motion.div
          className="results__loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="spinner" />
          <div className="results__loading-text">Analyzing image...</div>
        </motion.div>
      )}

      {/* Error */}
      {status === 'error' && (
        <motion.div
          className="glass-card results__error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="results__error-icon">⚠️</div>
          <div className="results__error-title">Analysis Failed</div>
          <div className="results__error-message">{error}</div>
          <button className="btn btn--primary" onClick={onRetry} id="retry-btn">
            🔄 Retry
          </button>
        </motion.div>
      )}

      {/* Success */}
      {status === 'success' && results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top prediction */}
          <div className="glass-card results__top">
            <div className="results__top-label">Top Prediction</div>
            <div className="results__top-disease">
              {normalizeName(results.top_prediction.disease)}
              {' '}
              <span className={`risk-badge risk-badge--${getRisk(results.top_prediction.disease).badge}`}>
                {getRisk(results.top_prediction.disease).level}
              </span>
            </div>
            <div className="results__top-confidence">
              {results.top_prediction.confidence}%
            </div>
          </div>

          {/* All predictions */}
          <div className="results__all-title">All Predictions</div>
          {results.all_predictions.map((pred, i) => {
            const risk = getRisk(pred.disease);
            return (
              <motion.div
                key={pred.disease}
                className="prediction-row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="prediction-row__name">
                  {normalizeName(pred.disease)}
                </div>
                <div className="prediction-row__bar-wrapper">
                  <motion.div
                    className={`prediction-row__bar prediction-row__bar--${risk.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(pred.confidence, 1)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                  />
                </div>
                <div className="prediction-row__value">{pred.confidence}%</div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
