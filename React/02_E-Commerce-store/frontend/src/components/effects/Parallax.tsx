import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down';
}

export function Parallax({
  children,
  speed = 0.5,
  className = '',
  direction = 'up',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const factor = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * factor]);
  
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Parallax container for sections
interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  bgImage?: string;
  overlay?: boolean;
  speed?: number;
}

export function ParallaxSection({
  children,
  className = '',
  bgImage,
  overlay = true,
  speed = 0.5,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 30}%`]);
  
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {bgImage && (
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          {overlay && (
            <div className="absolute inset-0 bg-dark-950/70" />
          )}
        </motion.div>
      )}
      {children}
    </div>
  );
}

// Scale on scroll
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

export function ScaleOnScroll({ children, className = '' }: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  
  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
