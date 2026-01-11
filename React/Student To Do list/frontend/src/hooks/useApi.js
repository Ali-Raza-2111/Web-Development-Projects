import { useState, useCallback } from 'react';
import { todoApi, statsApi, settingsApi } from '../services/api';

// Hook for todos
export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await todoApi.getAll(params);
      setTodos(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (text, priority = 'medium') => {
    try {
      const response = await todoApi.create({ text, priority });
      setTodos(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const toggleTodo = useCallback(async (id) => {
    try {
      const response = await todoApi.toggle(id);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? response.data : todo
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id, data) => {
    try {
      const response = await todoApi.update(id, data);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? response.data : todo
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id) => {
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const clearCompleted = useCallback(async () => {
    try {
      await todoApi.clearCompleted();
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
  };
};

// Hook for stats
export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [streakData, setStreakData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOverallStats = useCallback(async () => {
    try {
      const response = await statsApi.getOverall();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const fetchWeeklyStats = useCallback(async () => {
    try {
      const response = await statsApi.getWeekly();
      setWeeklyData(response.data);
    } catch (err) {
      console.error('Error fetching weekly stats:', err);
    }
  }, []);

  const fetchMonthlyStats = useCallback(async () => {
    try {
      const response = await statsApi.getMonthly();
      setMonthlyData(response.data);
    } catch (err) {
      console.error('Error fetching monthly stats:', err);
    }
  }, []);

  const fetchStreakData = useCallback(async () => {
    try {
      const response = await statsApi.getStreaks();
      setStreakData(response.data);
    } catch (err) {
      console.error('Error fetching streak data:', err);
    }
  }, []);

  const fetchPriorityDistribution = useCallback(async () => {
    try {
      const response = await statsApi.getPriorityDistribution();
      setPriorityData(response.data);
    } catch (err) {
      console.error('Error fetching priority data:', err);
    }
  }, []);

  const fetchAllStats = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchOverallStats(),
      fetchWeeklyStats(),
      fetchMonthlyStats(),
      fetchStreakData(),
      fetchPriorityDistribution(),
    ]);
    setLoading(false);
  }, [fetchOverallStats, fetchWeeklyStats, fetchMonthlyStats, fetchStreakData, fetchPriorityDistribution]);

  return {
    stats,
    weeklyData,
    monthlyData,
    streakData,
    priorityData,
    loading,
    fetchAllStats,
    fetchOverallStats,
    fetchWeeklyStats,
    fetchStreakData,
  };
};

// Hook for settings
export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await settingsApi.get();
      setSettings(response.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data) => {
    try {
      const response = await settingsApi.update(data);
      setSettings(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      const response = await settingsApi.reset();
      setSettings(response.data);
      return response.data;
    } catch (err) {
      console.error('Error resetting settings:', err);
      throw err;
    }
  }, []);

  return {
    settings,
    loading,
    fetchSettings,
    updateSettings,
    resetSettings,
  };
};
