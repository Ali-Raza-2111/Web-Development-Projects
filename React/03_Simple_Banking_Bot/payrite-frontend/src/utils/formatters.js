// Format currency in Nigerian Naira
export const formatNaira = (amount) => {
  if (amount === null || amount === undefined) return '₦0';
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Alias for formatNaira
export const formatCurrency = formatNaira;

// Format large numbers with K, M, B suffixes
export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

// Format date
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', { ...defaultOptions, ...options });
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text with ellipsis
export const truncate = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Format tax health score with color indicator
export const getTaxHealthInfo = (score) => {
  if (score >= 80) {
    return {
      label: 'Excellent',
      color: 'success',
      description: 'Your tax health is excellent. Keep up the good work!',
    };
  }
  if (score >= 60) {
    return {
      label: 'Good',
      color: 'info',
      description: 'Your tax health is good with minor areas for improvement.',
    };
  }
  if (score >= 40) {
    return {
      label: 'Fair',
      color: 'warning',
      description: 'Your tax health needs attention. Review the recommendations.',
    };
  }
  return {
    label: 'Needs Attention',
    color: 'error',
    description: 'Your tax health requires immediate attention. Please review the detailed report.',
  };
};

// Format risk level
export const getRiskInfo = (level) => {
  const levels = {
    low: { label: 'Low Risk', color: 'success' },
    medium: { label: 'Medium Risk', color: 'warning' },
    high: { label: 'High Risk', color: 'error' },
  };
  return levels[level?.toLowerCase()] || levels.low;
};
