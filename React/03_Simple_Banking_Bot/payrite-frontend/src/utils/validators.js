// Email validation
export const validateEmail = (email) => {
  if (!email) return { valid: false, error: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  
  return { valid: true, error: null };
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const { minLength = 8, requireUppercase = true, requireNumber = true, requireSpecial = false } = options;
  
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  
  if (password.length < minLength) {
    return { valid: false, error: `Password must be at least ${minLength} characters` };
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (requireNumber && !/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }
  
  return { valid: true, error: null };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  
  return { valid: true, error: null };
};

// Name validation
export const validateName = (name) => {
  if (!name) {
    return { valid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (name.trim().length > 100) {
    return { valid: false, error: 'Name must not exceed 100 characters' };
  }
  
  return { valid: true, error: null };
};

// Phone validation (Nigerian format)
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: true, error: null }; // Phone is optional
  }
  
  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  // Nigerian phone number patterns
  const nigerianPhoneRegex = /^(\+234|234|0)[789]\d{9}$/;
  
  if (!nigerianPhoneRegex.test(cleanPhone)) {
    return { valid: false, error: 'Please enter a valid Nigerian phone number' };
  }
  
  return { valid: true, error: null };
};

// File validation
export const validateFile = (file, options = {}) => {
  const { 
    allowedTypes = ['application/pdf'], 
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxSizeLabel = '10MB'
  } = options;
  
  if (!file) {
    return { valid: false, error: 'File is required' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only PDF files are allowed.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size exceeds ${maxSizeLabel} limit` };
  }
  
  return { valid: true, error: null };
};

// Validate multiple files
export const validateFiles = (files, options = {}) => {
  const { maxFiles = 5 } = options;
  
  if (!files || files.length === 0) {
    return { valid: false, errors: ['At least one file is required'] };
  }
  
  if (files.length > maxFiles) {
    return { valid: false, errors: [`Maximum ${maxFiles} files allowed`] };
  }
  
  const errors = [];
  
  files.forEach((file) => {
    const result = validateFile(file, options);
    if (!result.valid) {
      errors.push(`${file.name}: ${result.error}`);
    }
  });
  
  return { valid: errors.length === 0, errors };
};

// Required field validation
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  return { valid: true, error: null };
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach((field) => {
    const value = values[field];
    const fieldRules = rules[field];
    
    for (const rule of fieldRules) {
      const result = rule(value, values);
      if (!result.valid) {
        errors[field] = result.error;
        isValid = false;
        break;
      }
    }
  });
  
  return { isValid, errors };
};
