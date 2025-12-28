import { useEffect, useRef } from 'react';
import anime from 'animejs';

export const useAnime = (callback, deps = []) => {
  const ref = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (ref.current) {
      // Pass the element and anime instance to the callback
      animationRef.current = callback(ref.current, anime);
    }

    return () => {
      if (animationRef.current && animationRef.current.pause) {
        animationRef.current.pause();
      }
    };
  }, deps);

  return ref;
};
