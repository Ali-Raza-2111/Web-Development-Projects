import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.3 }}
      className={clsx(
        'bg-dark-800/50 backdrop-blur-xl border border-dark-700/50 rounded-2xl overflow-hidden',
        'transition-all duration-500',
        hover && 'hover:border-primary-500/30',
        glow && 'hover:shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
