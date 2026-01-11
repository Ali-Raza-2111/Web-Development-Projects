import { useState, useEffect } from 'react';
import { Header } from './components/Layout';
import { TodoList } from './components/TodoList';
import { PomodoroTimer } from './components/Timer';
import { ProgressChart, StreakCalendar } from './components/Stats';
import { useSettings } from './hooks/useApi';
import './App.css';

function App() {
  const { settings, fetchSettings, updateSettings } = useSettings();
  const [theme, setTheme] = useState('dark');
  const [refreshStats, setRefreshStats] = useState(0);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme);
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings]);

  const handleThemeToggle = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    await updateSettings({ theme: newTheme });
  };

  const handleTodoChange = () => {
    // Trigger stats refresh
    setRefreshStats(prev => prev + 1);
  };

  return (
    <div className="app">
      <Header theme={theme} onThemeToggle={handleThemeToggle} />
      
      <main className="main-layout">
        <div className="dashboard-grid">
          <div className="left-column">
            <TodoList onTodoChange={handleTodoChange} />
            <StreakCalendar key={`streak-${refreshStats}`} />
          </div>
          
          <div className="right-column">
            <PomodoroTimer />
            <ProgressChart key={`chart-${refreshStats}`} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
