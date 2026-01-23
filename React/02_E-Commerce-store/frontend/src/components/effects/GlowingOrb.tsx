import { motion } from 'framer-motion';

interface GlowingOrbProps {
  color?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const colorMap = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  accent: 'bg-amber-500',
};

const sizeMap = {
  sm: 'w-32 h-32',
  md: 'w-64 h-64',
  lg: 'w-96 h-96',
  xl: 'w-[500px] h-[500px]',
};

const blurMap = {
  sm: 'blur-[60px]',
  md: 'blur-[100px]',
  lg: 'blur-[150px]',
  xl: 'blur-[200px]',
};

export function GlowingOrb({
  color = 'primary',
  size = 'md',
  className = '',
  animate = true,
}: GlowingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-30 ${colorMap[color]} ${sizeMap[size]} ${blurMap[size]} ${className}`}
      animate={
        animate
          ? {
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }
          : undefined
      }
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Multiple orbs background
export function OrbBackground() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <GlowingOrb
        color="primary"
        size="xl"
        className="-top-48 -left-48"
      />
      <GlowingOrb
        color="secondary"
        size="lg"
        className="top-1/3 -right-32"
      />
      <GlowingOrb
        color="primary"
        size="md"
        className="bottom-0 left-1/4"
      />
      <GlowingOrb
        color="accent"
        size="sm"
        className="top-2/3 right-1/4"
      />
    </div>
  );
}
