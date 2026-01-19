import { useState, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { animate } from 'animejs';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('dark');
  const buttonRef = useRef(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Animate the button
    animate(buttonRef.current, {
      rotate: '+=360',
      scale: [1, 0.8, 1],
      duration: 600,
      easing: 'easeInOutBack'
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-secondary/80 transition-colors relative overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative z-10">
        {theme === 'dark' ? (
          <Sun size={20} className="text-yellow-400" />
        ) : (
          <Moon size={20} className="text-slate-700" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
