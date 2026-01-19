import { useState, useEffect, useCallback, useRef } from 'react';

const useTimer = (initialMinutes = 25) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleho1IZaOu8h8SzI5G1uY0vKYVyY2IU9xkLfJg0wqOTEaYJzV6o9XLjQfTXOWuMF7TCo7MBhim9fnj1cwNyBNcpa3wXpMKjwxGWKb1+ePVzA3IE1ylrfBekwqPDEZYpvX549XMDcgTXKWt8F6TCo8MRlim9fnj1cwNw==');
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Play notification sound
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((minutes) => {
    setIsRunning(false);
    setTimeLeft(minutes * 60);
  }, []);

  const setWorkMode = useCallback((workDuration) => {
    setMode('work');
    setIsRunning(false);
    setTimeLeft(workDuration * 60);
  }, []);

  const setShortBreakMode = useCallback((shortBreakDuration) => {
    setMode('shortBreak');
    setIsRunning(false);
    setTimeLeft(shortBreakDuration * 60);
  }, []);

  const setLongBreakMode = useCallback((longBreakDuration) => {
    setMode('longBreak');
    setIsRunning(false);
    setTimeLeft(longBreakDuration * 60);
  }, []);

  const completeSession = useCallback(() => {
    setSessionsCompleted((prev) => prev + 1);
  }, []);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  const getProgress = useCallback((totalMinutes) => {
    const totalSeconds = totalMinutes * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  }, [timeLeft]);

  return {
    timeLeft,
    isRunning,
    mode,
    sessionsCompleted,
    start,
    pause,
    reset,
    setWorkMode,
    setShortBreakMode,
    setLongBreakMode,
    completeSession,
    formatTime,
    getProgress,
  };
};

export default useTimer;
