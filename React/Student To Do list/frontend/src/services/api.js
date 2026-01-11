import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Todo API
export const todoApi = {
  getAll: (params = {}) => api.get('/todos', { params }),
  getById: (id) => api.get(`/todos/${id}`),
  create: (data) => api.post('/todos', data),
  update: (id, data) => api.put(`/todos/${id}`, data),
  toggle: (id) => api.patch(`/todos/${id}/toggle`),
  delete: (id) => api.delete(`/todos/${id}`),
  clearCompleted: () => api.delete('/todos/completed/clear'),
};

// Stats API
export const statsApi = {
  getOverall: () => api.get('/stats'),
  getWeekly: () => api.get('/stats/weekly'),
  getMonthly: () => api.get('/stats/monthly'),
  getStreaks: () => api.get('/stats/streaks'),
  getPriorityDistribution: () => api.get('/stats/priority-distribution'),
};

// Settings API
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  reset: () => api.post('/settings/reset'),
};

export default api;
