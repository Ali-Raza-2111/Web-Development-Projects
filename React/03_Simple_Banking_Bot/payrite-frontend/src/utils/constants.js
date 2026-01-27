// App constants
export const APP_NAME = 'Payrite';
export const APP_TAGLINE = 'AI-Powered Tax Health Check for Nigeria';

// API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// File upload limits
export const MAX_FILES = 5;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf'];

// Payment prices (in Naira)
export const PAYMENT_PRICES = {
  one_time: 1500,
  lifetime: 10000,
};

// Tax rates (Nigerian tax brackets)
export const TAX_BRACKETS = [
  { min: 0, max: 300000, rate: 0.07 },
  { min: 300001, max: 600000, rate: 0.11 },
  { min: 600001, max: 1100000, rate: 0.15 },
  { min: 1100001, max: 1600000, rate: 0.19 },
  { min: 1600001, max: 3200000, rate: 0.21 },
  { min: 3200001, max: Infinity, rate: 0.24 },
];

// VAT rate
export const VAT_RATE = 0.075; // 7.5%

// Withholding tax rates
export const WITHHOLDING_RATES = {
  contracts: 0.05,
  dividends: 0.10,
  professional_fees: 0.10,
};

// Tax health score thresholds
export const SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40,
  poor: 0,
};

// Risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Transaction categories
export const TRANSACTION_CATEGORIES = {
  SALARY: 'salary',
  BUSINESS_INCOME: 'business_income',
  INVESTMENT: 'investment',
  TRANSFER: 'transfer',
  UTILITIES: 'utilities',
  ENTERTAINMENT: 'entertainment',
  FOOD: 'food',
  TRANSPORT: 'transport',
  HEALTHCARE: 'healthcare',
  EDUCATION: 'education',
  RENT: 'rent',
  OTHER: 'other',
};

// Subscription types
export const SUBSCRIPTION_TYPES = {
  FREE: 'free',
  ONE_TIME: 'one_time',
  LIFETIME: 'lifetime',
};

// Analysis status
export const ANALYSIS_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// Upload status
export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'payrite_token',
  USER: 'payrite_user',
  CONSENT: 'payrite_consent',
  THEME: 'payrite_theme',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ONBOARDING: '/onboarding',
  CONSENT: '/consent',
  UPLOAD: '/upload',
  PROCESSING: '/processing',
  DASHBOARD: '/dashboard',
  REPORT: '/report',
  PAYMENT: '/payment',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILED: '/payment/failed',
  PROFILE: '/profile',
  HISTORY: '/history',
  SETTINGS: '/settings',
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FILE_TYPE: 'Only PDF files are allowed.',
  FILE_SIZE: 'File size exceeds the 10MB limit.',
  MAX_FILES: 'Maximum 5 files allowed per analysis.',
};
