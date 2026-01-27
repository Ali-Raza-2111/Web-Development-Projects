import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../../services/api';
import { validateEmail } from '../../utils/validators';
import LoadingSpinner from '../../Components/common/LoadingSpinner/LoadingSpinner';
import './Auth.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      setEmailError(emailResult.error);
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      // Even if email doesn't exist, show success for security
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card animate-fade-in-up">
            <div className="auth-success">
              <div className="success-icon-wrapper">
                <CheckCircle size={48} className="text-success" />
              </div>
              <h1 className="auth-title">Check Your Email</h1>
              <p className="auth-subtitle">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="auth-note">
                Didn't receive the email? Check your spam folder or{' '}
                <button 
                  className="auth-link-btn" 
                  onClick={() => setSuccess(false)}
                >
                  try again
                </button>
              </p>
            </div>

            <div className="auth-footer">
              <Link to="/login" className="btn btn-secondary btn-full">
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/login" className="auth-back">
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </Link>

        <div className="auth-card animate-fade-in-up">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">₦</span>
            </div>
            <h1 className="auth-title">Forgot Password?</h1>
            <p className="auth-subtitle">
              Enter your email and we'll send you instructions to reset your password
            </p>
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${emailError ? 'form-input-error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {emailError && <p className="form-error">{emailError}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
