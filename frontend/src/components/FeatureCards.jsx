import { motion } from 'framer-motion';

const features = [
  {
    icon: '🛡️',
    title: '5 Types',
    sub: 'Disease Classes',
    detail: '+ Healthy detection',
  },
  {
    icon: '🧠',
    title: 'CNN + RNN',
    sub: 'Detection Methods',
    detail: 'Dual AI modules',
  },
  {
    icon: '❤️',
    title: 'Pet Health',
    sub: 'Early Detection',
    detail: 'Accessible guidance',
  },
];

export default function FeatureCards() {
  return (
    <div className="feature-cards">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          className="glass-card feature-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="feature-card__icon">{f.icon}</div>
          <div>
            <div className="feature-card__title">{f.title}</div>
            <div className="feature-card__sub">
              {f.sub}
              <span>{f.detail}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
