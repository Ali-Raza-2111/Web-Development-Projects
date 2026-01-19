import React, { useState, useEffect } from 'react';
import styles from './TimeFlickerClock.module.css';

export const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const TimeFlickerClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [flickerIntensity, setFlickerIntensity] = useState(0);

  useEffect(() => {
    let secondTimerId;
    let flickerFrameId;

    const updateSecond = () => {
      const now = new Date();
      setCurrentTime(now);

      // Schedule next second update
      const delay = 1000 - now.getMilliseconds();
      secondTimerId = setTimeout(updateSecond, delay);
    };

    const updateFlicker = () => {
      setFlickerIntensity(Math.random());
      flickerFrameId = requestAnimationFrame(updateFlicker);
    };

    const startClock = () => {
      clearTimeout(secondTimerId);
      cancelAnimationFrame(flickerFrameId);
      updateSecond(); // First update to immediately synchronize
      flickerFrameId = requestAnimationFrame(updateFlicker);
    };

    // Initial setup
    startClock();

    // Handle visibility changes for resynchronization
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        startClock();
      } else {
        clearTimeout(secondTimerId);
        cancelAnimationFrame(flickerFrameId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(secondTimerId);
      cancelAnimationFrame(flickerFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <div
      className={styles['time-flicker-clock']}
      style={{ opacity: 0.8 + (flickerIntensity * 0.2) }} // Flicker between 0.8 and 1.0 opacity
      role="timer"
      aria-live="off"
    >
      {formatTime(currentTime)}
    </div>
  );
};

export default TimeFlickerClock;
