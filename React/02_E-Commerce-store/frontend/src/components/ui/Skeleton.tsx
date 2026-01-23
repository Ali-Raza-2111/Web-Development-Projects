import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  style?: CSSProperties;
}

export function Skeleton({
  className = '',
  variant = 'default',
  width,
  height,
  animation = 'wave',
  style,
}: SkeletonProps) {
  const baseStyles = 'bg-dark-700/50 rounded';
  
  const variantStyles = {
    default: 'rounded-lg',
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${baseStyles} ${variantStyles[variant]} ${animationClasses[animation]} ${className}`}
      style={{ width, height, ...style }}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-dark-800/50 rounded-2xl overflow-hidden border border-dark-700/50">
      {/* Image */}
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Text Block Skeleton
export function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

// Avatar Skeleton
export function AvatarSkeleton({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
    />
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

// Hero Section Skeleton
export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-16 w-96 mb-4" />
      <Skeleton className="h-16 w-80 mb-8" />
      <Skeleton className="h-6 w-[600px] mb-2" />
      <Skeleton className="h-6 w-[500px] mb-12" />
      <div className="flex gap-4">
        <Skeleton className="h-14 w-48 rounded-2xl" />
        <Skeleton className="h-14 w-48 rounded-2xl" />
      </div>
    </div>
  );
}
