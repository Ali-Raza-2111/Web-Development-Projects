import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function AnimatedCursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springX = useSpring(cursorX, { damping: 20, stiffness: 400 });
  const springY = useSpring(cursorY, { damping: 20, stiffness: 400 });
  
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a');
      setIsHovering(!!isClickable);
    };
    
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);
  
  // Hide on touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);
  
  if (isTouchDevice) return null;
  
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500"
        animate={{
          width: isHovering ? 24 : 8,
          height: isHovering ? 24 : 8,
          opacity: isHovering ? 0.6 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </motion.div>
  );
}
