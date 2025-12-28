import { useRef, useState } from 'react';
import { animate } from 'animejs';

const Tilt = ({ children, className = "" }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
    const rotateY = ((x - centerX) / centerX) * 10;

    animate(element, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.05,
      duration: 400,
      easing: 'easeOutQuad'
    });
  };

  const handleMouseLeave = () => {
    const element = ref.current;
    if (!element) return;

    animate(element, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 600,
      easing: 'easeOutElastic(1, .6)'
    });
  };

  return (
    <div 
      ref={ref} 
      className={`perspective-1000 transform-style-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {children}
    </div>
  );
};

export default Tilt;
