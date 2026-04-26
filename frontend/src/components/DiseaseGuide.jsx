import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const diseases = [
  {
    name: 'Demodicosis',
    badge: 'Moderate Risk',
    badgeClass: 'moderate',
    subtitle: 'Demodectic Mange',
    icon: '⚙️',
    iconClass: 'amber',
    desc: 'Caused by an overpopulation of Demodex mites in the hair follicles, leading to notable hair loss and skin irritation. Often appears in young or immunocompromised dogs.',
  },
  {
    name: 'Dermatitis',
    badge: 'Moderate Risk',
    badgeClass: 'moderate',
    subtitle: 'Skin Inflammation',
    icon: '🔥',
    iconClass: 'amber',
    desc: 'Inflammation of the skin due to allergies, infections, or external irritants. Causes persistent redness, itching, and discomfort in affected areas.',
  },
  {
    name: 'Fungal Infections',
    badge: 'High Risk',
    badgeClass: 'high',
    subtitle: 'Fungal Overgrowth',
    icon: '🦠',
    iconClass: 'red',
    desc: 'Skin conditions caused by fungal overgrowth on or beneath the skin surface, leading to progressive scaling, crusting, and hair loss.',
  },
  {
    name: 'Hypersensitivity',
    badge: 'Low Risk',
    badgeClass: 'low',
    subtitle: 'Allergic Reactions',
    icon: '💧',
    iconClass: 'blue',
    desc: 'An overreaction of the immune system to allergens such as fleas, pollen, certain foods, or environmental triggers — causing itching and inflammation.',
  },
  {
    name: 'Ringworm',
    badge: 'High Risk',
    badgeClass: 'high',
    subtitle: 'Dermatophytosis',
    icon: '⭕',
    iconClass: 'red',
    desc: 'A highly contagious fungal infection (Dermatophytosis) that creates characteristic circular, scaly bald patches on the skin. Can spread to other pets and humans.',
  },
];

export default function DiseaseGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="disease-guide">
      <button
        className="disease-guide__toggle"
        onClick={() => setIsOpen(!isOpen)}
        id="disease-guide-toggle"
      >
        <span className={`disease-guide__chevron ${isOpen ? 'disease-guide__chevron--open' : ''}`}>
          ▼
        </span>
        Included Skin Diseases ({diseases.length} classes)
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="disease-guide__grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            {diseases.map((d, i) => (
              <motion.div
                key={d.name}
                className="glass-card disease-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="disease-card__header">
                  <div className={`disease-card__icon disease-card__icon--${d.iconClass}`}>
                    {d.icon}
                  </div>
                  <div>
                    <div className="disease-card__name">
                      {d.name}{' '}
                      <span className={`risk-badge risk-badge--${d.badgeClass}`}>
                        {d.badge}
                      </span>
                    </div>
                    <div className="disease-card__subtitle">{d.subtitle}</div>
                  </div>
                </div>
                <div className="disease-card__desc">{d.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
