import { motion } from 'framer-motion';
import { HiSun, HiMoon } from 'react-icons/hi';
import './ThemeToggle.css';

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="toggle-icon"
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {isDark ? <HiMoon /> : <HiSun />}
      </motion.div>
      <div className="toggle-glow"></div>
    </motion.button>
  );
};

export default ThemeToggle;
