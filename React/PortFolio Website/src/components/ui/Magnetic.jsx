import { useRef, useState, useEffect } from 'react';
import { animate } from 'animejs';

const Magnetic = ({ children }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      // Only move if close enough (optional, but good for performance/UX)
      // For now, let's just move it.
      
      animate(element, {
        translateX: x * 0.3, // Strength of magnetic effect
        translateY: y * 0.3,
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      });
    };

    const handleMouseLeave = () => {
      animate(element, {
        translateX: 0,
        translateY: 0,
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
};

export default Magnetic;
