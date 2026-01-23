import { motion } from 'framer-motion';
import { GlowingOrb } from '../effects/GlowingOrb';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-dark-950 flex items-center justify-center"
    >
      {/* Background Effects */}
      <GlowingOrb color="primary" size="xl" className="-top-32 -left-32" />
      <GlowingOrb color="secondary" size="lg" className="bottom-1/4 right-1/4" />
      
      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          className="relative mb-8"
          animate={{ 
            rotateY: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-5xl">L</span>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur-xl opacity-50 -z-10" />
        </motion.div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-dark-800 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ width: '50%' }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          className="text-dark-400 text-sm uppercase tracking-widest"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>

        {/* Floating Dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary-500"
              animate={{ 
                y: [-5, 5, -5],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Inline loading spinner
export function LoadingSpinner({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-primary-500"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.2"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

// Button loading state
export function ButtonLoader() {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size={16} />
      <span>Processing...</span>
    </div>
  );
}
