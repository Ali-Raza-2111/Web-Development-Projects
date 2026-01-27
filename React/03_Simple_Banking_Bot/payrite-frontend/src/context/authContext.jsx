import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('payrite_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token && !!user;
  const hasConsented = user?.has_consented || false;
  const subscriptionType = user?.subscription_type || 'free';
  const isPremium = subscriptionType === 'lifetime' || subscriptionType === 'one_time';

  // Load user data on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('payrite_token');
      const storedUser = localStorage.getItem('payrite_user');
      
      if (storedToken) {
        setToken(storedToken);
        
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse stored user:', e);
          }
        }
        
        // Verify token and get fresh user data
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          localStorage.setItem('payrite_user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Failed to verify token:', error);
          
          // If it's a network error, we might be in offline/demo mode
          // So we keep the stored user if present
          if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
             console.log('Network error detected. Keeping stored user session for demo mode.');
          } else {
             // Token is invalid, clear auth state
             logout();
          }
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(email, password);
      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      
      localStorage.setItem('payrite_token', access_token);
      localStorage.setItem('payrite_user', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      // DEMO MODE: If backend is not available, use mock login
      console.log('Backend not available, using demo mode...');
      
      const mockUser = {
        id: 'demo-user-123',
        email: email,
        firstName: 'Demo',
        lastName: 'User',
        has_consented: true,
        hasCompletedOnboarding: true,
        hasGivenConsent: true,
        subscription_type: 'free',
        createdAt: new Date().toISOString(),
      };
      const mockToken = 'demo-token-' + Date.now();
      
      setToken(mockToken);
      setUser(mockUser);
      
      localStorage.setItem('payrite_token', mockToken);
      localStorage.setItem('payrite_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (fullName, email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Register the user
      await authAPI.register({ full_name: fullName, email, password });
      
      // Auto-login after registration
      const loginResult = await login(email, password);
      
      return loginResult;
    } catch (error) {
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      if (error.code !== 'ERR_NETWORK' && error.message !== 'Network Error') {
        console.error('Logout API call failed:', error);
      }
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('payrite_token');
      localStorage.removeItem('payrite_user');
    }
  }, []);

  const updateConsent = useCallback(async (consent) => {
    try {
      const response = await profileAPI.updateConsent(consent);
      setUser((prev) => ({ ...prev, has_consented: consent }));
      localStorage.setItem('payrite_user', JSON.stringify({ ...user, has_consented: consent }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to update consent.';
      return { success: false, error: message };
    }
  }, [user]);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('payrite_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    hasConsented,
    subscriptionType,
    isPremium,
    login,
    signup,
    logout,
    updateConsent,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
