import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { paymentAPI } from '../services/api';
import { useAuth } from './authContext';

const PaymentContext = createContext(null);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

// Payment prices in Naira
const PAYMENT_PRICES = {
  one_time: 1500,
  lifetime: 10000,
};

export const PaymentProvider = ({ children }) => {
  const { updateUser, isPremium, subscriptionType } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPayment, setCurrentPayment] = useState(null);

  // Check payment status on mount
  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = useCallback(async () => {
    try {
      const response = await paymentAPI.getPaymentStatus();
      if (response.data.subscription_type) {
        updateUser({ subscription_type: response.data.subscription_type });
      }
    } catch (error) {
      // Silently ignore network errors (backend offline/demo mode)
      if (error.code !== 'ERR_NETWORK' && error.message !== 'Network Error') {
        console.error('Failed to check payment status:', error);
      }
    }
  }, [updateUser]);

  const fetchPaymentHistory = useCallback(async () => {
    try {
      const response = await paymentAPI.getPaymentHistory();
      setPaymentHistory(response.data);
      return response.data;
    } catch (error) {
      // Silently ignore network errors (backend offline/demo mode)
      if (error.code !== 'ERR_NETWORK' && error.message !== 'Network Error') {
        console.error('Failed to fetch payment history:', error);
      }
      return [];
    }
  }, []);

  const initializePayment = useCallback(async (paymentType, analysisId = null) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const response = await paymentAPI.initializePayment(paymentType, analysisId);
      const { authorization_url, reference } = response.data;

      setCurrentPayment({
        type: paymentType,
        reference,
        amount: PAYMENT_PRICES[paymentType],
        analysisId,
      });

      // Redirect to payment gateway
      window.location.href = authorization_url;

      return { success: true, authorization_url, reference };
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to initialize payment';
      setPaymentError(message);
      setIsProcessing(false);
      return { success: false, error: message };
    }
  }, []);

  const verifyPayment = useCallback(async (reference) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const response = await paymentAPI.verifyPayment(reference);
      
      if (response.data.status === 'success') {
        updateUser({ subscription_type: response.data.subscription_type });
        setCurrentPayment(null);
        return { success: true, data: response.data };
      } else {
        setPaymentError('Payment verification failed');
        return { success: false, error: 'Payment verification failed' };
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Payment verification failed';
      setPaymentError(message);
      return { success: false, error: message };
    } finally {
      setIsProcessing(false);
    }
  }, [updateUser]);

  const canAccessReport = useCallback((analysisId) => {
    if (subscriptionType === 'lifetime') return true;
    
    // Check if this specific analysis is paid for
    const paidAnalysis = paymentHistory.find(
      (p) => p.analysis_id === analysisId && p.status === 'success'
    );
    
    return !!paidAnalysis;
  }, [subscriptionType, paymentHistory]);

  const getPrice = useCallback((paymentType) => {
    return PAYMENT_PRICES[paymentType] || 0;
  }, []);

  const formatPrice = useCallback((amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const value = {
    isProcessing,
    paymentError,
    paymentHistory,
    currentPayment,
    prices: PAYMENT_PRICES,
    isPremium,
    subscriptionType,
    initializePayment,
    verifyPayment,
    checkPaymentStatus,
    fetchPaymentHistory,
    canAccessReport,
    getPrice,
    formatPrice,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

export default PaymentContext;
