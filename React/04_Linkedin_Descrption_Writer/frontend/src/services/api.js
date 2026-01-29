import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Configure for your backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

// Export specific API functions
export const generateDescription = async (data) => {
  const response = await api.post('/generate', data);
  return response.data;
};

export const refineDescription = async (data) => {
  const response = await api.post('/refine', data);
  return response.data;
};

export const login = async (credentials) => {
    // Mock login since backend doesn't support it yet
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    user: { name: 'Demo User', email: credentials.email },
                    token: 'mock-jwt-token-12345'
                }
            })
        }, 1000);
    });
};

export const signup = async (userData) => {
    // Mock signup
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    user: { name: userData.name, email: userData.email },
                    token: 'mock-jwt-token-12345'
                }
            })
        }, 1000);
    });
};

export default api;
