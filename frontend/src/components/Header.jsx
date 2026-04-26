import { motion } from 'framer-motion';

export default function Header() {
  return (
    <header className="header">
      <motion.div
        className="header__badge"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="header__badge-dot" />
        AI-Powered Skin Disease Detection
      </motion.div>

      <motion.h1
        className="header__title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        SD <span className="gradient-text">Pawsense</span>
      </motion.h1>

      <motion.p
        className="header__subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Advanced AI-powered skin disease recognition and symptom analysis to make
        veterinary guidance faster and more accessible.
      </motion.p>
    </header>
  );
}
