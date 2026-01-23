import { useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });
    
    lenisRef.current = lenis;
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);
  
  return <>{children}</>;
}

// Hook to access Lenis instance
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  
  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;
    
    return () => lenis.destroy();
  }, []);
  
  return lenisRef.current;
}
