import { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX, clientY } = e;
      
      // Immediate movement for the dot
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
      }

      // Smooth movement for the follower
      if (followerRef.current) {
        animate(followerRef.current, {
          translateX: clientX - 16, // Center the 32px circle
          translateY: clientY - 16,
          duration: 800,
          easing: 'easeOutExpo'
        });
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button') || e.target.classList.contains('cursor-hover')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    if (followerRef.current) {
      animate(followerRef.current, {
        scale: isHovering ? 2.5 : 1,
        opacity: isHovering ? 0.5 : 0.3,
        backgroundColor: isHovering ? '#ffffff' : 'transparent',
        borderColor: isHovering ? 'transparent' : '#ffffff',
        duration: 300,
        easing: 'easeOutQuad'
      });
    }
  }, [isHovering]);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference hidden md:block"
      />
    </>
  );
};

export default CustomCursor;
