import { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiSettings, FiX } from 'react-icons/fi';
import useTimer from '../../hooks/useTimer';
import { useSettings } from '../../hooks/useApi';
import './Timer.css';

const PomodoroTimer = () => {
  const { settings, fetchSettings, updateSettings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    work_duration: 25,
    short_break: 5,
    long_break: 15,
    sessions_before_long_break: 4,
  });

  const {
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
    formatTime,
    getProgress,
  } = useTimer(localSettings.work_duration);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setLocalSettings({
        work_duration: settings.work_duration,
        short_break: settings.short_break,
        long_break: settings.long_break,
        sessions_before_long_break: settings.sessions_before_long_break,
      });
    }
  }, [settings]);

  const getCurrentDuration = () => {
    switch (mode) {
      case 'shortBreak':
        return localSettings.short_break;
      case 'longBreak':
        return localSettings.long_break;
      default:
        return localSettings.work_duration;
    }
  };

  const progress = getProgress(getCurrentDuration());

  const handleModeChange = (newMode) => {
    switch (newMode) {
      case 'work':
        setWorkMode(localSettings.work_duration);
        break;
      case 'shortBreak':
        setShortBreakMode(localSettings.short_break);
        break;
      case 'longBreak':
        setLongBreakMode(localSettings.long_break);
        break;
    }
  };

  const handleReset = () => {
    reset(getCurrentDuration());
  };

  const handleSaveSettings = async () => {
    await updateSettings(localSettings);
    setShowSettings(false);
    // Reset timer with new duration if in work mode
    if (mode === 'work') {
      reset(localSettings.work_duration);
    }
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const modeLabels = {
    work: 'Focus Time',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  const modeColors = {
    work: 'var(--accent)',
    shortBreak: 'var(--success)',
    longBreak: 'var(--info)',
  };

  return (
    <div className="timer-container">
      <div className="timer-header">
        <h2>System Status: {isRunning ? 'Running' : 'Standby'}</h2>
        <button 
          className="settings-btn"
          onClick={() => setShowSettings(!showSettings)}
        >
          <FiSettings />
        </button>
      </div>

      {showSettings ? (
        <div className="timer-settings">
          <div className="settings-header">
            <h3>Timer Configuration</h3>
            <button className="close-btn" onClick={() => setShowSettings(false)}>
              <FiX />
            </button>
          </div>
          
          <div className="settings-form">
            <div className="setting-group">
              <label>Work Duration (min)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={localSettings.work_duration}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  work_duration: parseInt(e.target.value) || 25
                })}
              />
            </div>
            
            <div className="setting-group">
              <label>Short Break (min)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={localSettings.short_break}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  short_break: parseInt(e.target.value) || 5
                })}
              />
            </div>
            
            <div className="setting-group">
              <label>Long Break (min)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={localSettings.long_break}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  long_break: parseInt(e.target.value) || 15
                })}
              />
            </div>
            
            <div className="setting-group">
              <label>Cycle Length</label>
              <input
                type="number"
                min="1"
                max="10"
                value={localSettings.sessions_before_long_break}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  sessions_before_long_break: parseInt(e.target.value) || 4
                })}
              />
            </div>
            
            <button className="save-settings-btn" onClick={handleSaveSettings}>
              Initialize Settings
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="timer-display">
            <svg className="timer-svg" viewBox="0 0 260 260">
              <circle
                className="timer-bg"
                cx="130"
                cy="130"
                r="120"
              />
              <circle
                className="timer-progress"
                cx="130"
                cy="130"
                r="120"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ stroke: modeColors[mode] }}
              />
            </svg>
            <div className="timer-content">
              <span className="timer-mode">{modeLabels[mode]}</span>
              <span className="timer-time">{formatTime(timeLeft)}</span>
              <div className="timer-sessions">
                Session {sessionsCompleted % localSettings.sessions_before_long_break + 1} / {localSettings.sessions_before_long_break}
              </div>
            </div>
          </div>

          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === 'work' ? 'active' : ''}`}
              onClick={() => handleModeChange('work')}
            >
              Focus
            </button>
            <button
              className={`mode-tab ${mode === 'shortBreak' ? 'active' : ''}`}
              onClick={() => handleModeChange('shortBreak')}
            >
              Rest
            </button>
            <button
              className={`mode-tab ${mode === 'longBreak' ? 'active' : ''}`}
              onClick={() => handleModeChange('longBreak')}
            >
              Long Break
            </button>
          </div>

          <div className="timer-display">
            <svg className="timer-svg" viewBox="0 0 260 260">
              <circle
                className="timer-bg"
                cx="130"
                cy="130"
                r="120"
              />
              <circle
                className="timer-progress"
                cx="130"
                cy="130"
                r="120"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  stroke: modeColors[mode],
                }}
              />
            </svg>
            <div className="timer-content">
              <span className="timer-mode">{modeLabels[mode]}</span>
              <span className="timer-time">{formatTime()}</span>
              <span className="timer-sessions">
                Session {sessionsCompleted + 1}
              </span>
            </div>
          </div>

          <div className="timer-controls">
            {!isRunning ? (
              <button className="control-btn play" onClick={start}>
                <FiPlay />
                Start
              </button>
            ) : (
              <button className="control-btn pause" onClick={pause}>
                <FiPause />
                Pause
              </button>
            )}
            <button className="control-btn reset" onClick={handleReset}>
              <FiRotateCcw />
              Reset
            </button>
          </div>

          <div className="session-dots">
            {Array.from({ length: localSettings.sessions_before_long_break }).map((_, i) => (
              <span
                key={i}
                className={`session-dot ${i < sessionsCompleted % localSettings.sessions_before_long_break ? 'completed' : ''}`}
              />
            ))}
          </div>

          {timeLeft === 0 && (
            <div className="timer-complete">
              {mode === 'work' ? (
                <p>🎉 Great work! Time for a break.</p>
              ) : (
                <p>Break's over! Ready to focus?</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PomodoroTimer;
