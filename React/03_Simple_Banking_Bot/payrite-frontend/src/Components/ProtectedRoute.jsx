import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import LoadingSpinner from './common/LoadingSpinner/LoadingSpinner';

const ProtectedRoute = ({ children, requireConsent = true }) => {
  const { isAuthenticated, isLoading, hasConsented } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireConsent && !hasConsented) {
    return <Navigate to="/consent" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
