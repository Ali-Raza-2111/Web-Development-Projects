import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import './NotFound.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-visual">
          <span className="error-code">404</span>
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
        
        <h1>Page Not Found</h1>
        <p>
          Oops! The page you're looking for seems to have drifted away into 
          the deep ocean. Let's get you back on track.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary btn-icon">
            <Home size={18} />
            <span>Go Home</span>
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary btn-icon">
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>

        <div className="helpful-links">
          <h4>Helpful Links</h4>
          <div className="links-grid">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/upload">Upload Statements</Link>
            <Link to="/history">Analysis History</Link>
            <Link to="/profile">Profile Settings</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
