import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <motion.div
        className={clsx(
          'rounded-full border-2 border-dark-600 border-t-primary-500',
          sizes[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-dark-300"
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-dark-800/50 rounded-2xl overflow-hidden border border-dark-700/50">
      <div className="aspect-[3/4] bg-dark-700/50 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark-700/50 rounded animate-pulse" />
        <div className="h-4 bg-dark-700/50 rounded w-2/3 animate-pulse" />
        <div className="h-6 bg-dark-700/50 rounded w-1/3 animate-pulse" />
      </div>
    </div>
  );
}
