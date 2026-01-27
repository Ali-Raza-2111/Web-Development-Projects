import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('payrite_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('payrite_token');
      localStorage.removeItem('payrite_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  
  register: (data) => api.post('/auth/register', data),
  
  logout: () => api.post('/auth/logout'),
  
  forgotPassword: (email) => api.post('/auth/forgot', { email }),
  
  resetPassword: (token, password) => api.post('/auth/reset', { token, password }),
  
  getCurrentUser: () => api.get('/auth/me'),
  
  refreshToken: () => api.post('/auth/refresh'),
};

// Upload endpoints
export const uploadAPI = {
  uploadFiles: (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) onProgress(percentCompleted);
      },
    });
  },
  
  getUploadStatus: (uploadId) => api.get(`/upload/${uploadId}`),
  
  deleteUpload: (uploadId) => api.delete(`/upload/${uploadId}`),
};

// Analysis endpoints
export const analysisAPI = {
  startAnalysis: (uploadIds) => api.post('/analysis', { upload_ids: uploadIds }),
  
  getAnalysis: (analysisId) => api.get(`/analysis/${analysisId}`),
  
  getAnalysisHistory: () => api.get('/analysis/history'),
  
  deleteAnalysis: (analysisId) => api.delete(`/analysis/${analysisId}`),
  
  downloadReport: (analysisId) => api.get(`/analysis/${analysisId}/report`, {
    responseType: 'blob',
  }),
};

// Payment endpoints
export const paymentAPI = {
  initializePayment: (paymentType, analysisId = null) => 
    api.post('/payment/init', { payment_type: paymentType, analysis_id: analysisId }),
  
  verifyPayment: (reference) => api.post('/payment/verify', { reference }),
  
  getPaymentStatus: () => api.get('/payment/status'),
  
  getPaymentHistory: () => api.get('/payment/history'),
};

// Profile endpoints
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  
  updateProfile: (data) => api.put('/profile', data),
  
  changePassword: (currentPassword, newPassword) => 
    api.put('/profile/password', { current_password: currentPassword, new_password: newPassword }),
  
  deleteAccount: () => api.delete('/profile'),
  
  updateConsent: (consent) => api.put('/profile/consent', { consent }),
};

export default api;
