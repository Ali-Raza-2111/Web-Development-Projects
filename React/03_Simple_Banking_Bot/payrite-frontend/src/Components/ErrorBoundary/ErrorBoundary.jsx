import { Component } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error to console (in production, send to error tracking service)
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="bg-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
          
          <div className="error-boundary-content">
            <div className="error-icon-wrapper">
              <div className="error-icon-ring"></div>
              <div className="error-icon-ring delay"></div>
              <AlertTriangle className="error-icon" size={48} />
            </div>
            
            <h1 className="error-title">Oops! Something went wrong</h1>
            
            <p className="error-message">
              We apologize for the inconvenience. An unexpected error has occurred.
              Please try refreshing the page or go back to the home page.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
            
            <div className="error-actions">
              <button className="btn btn-primary" onClick={this.handleRefresh}>
                <RefreshCw size={20} />
                Refresh Page
              </button>
              <button className="btn btn-secondary" onClick={this.handleGoHome}>
                <Home size={20} />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
