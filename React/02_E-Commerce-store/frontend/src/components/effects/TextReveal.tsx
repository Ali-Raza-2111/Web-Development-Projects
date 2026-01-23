import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  staggerDelay = 0.03,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const words = children.split(' ');
  
  return (
    <span ref={ref} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ y: '100%', opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{
                duration,
                delay: delay + (wordIndex * word.length + charIndex) * staggerDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// Word-by-word reveal
interface WordRevealProps {
  children: string;
  className?: string;
  delay?: number;
  wordClassName?: string;
}

export function WordReveal({
  children,
  className = '',
  delay = 0,
  wordClassName = '',
}: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const words = children.split(' ');
  
  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
