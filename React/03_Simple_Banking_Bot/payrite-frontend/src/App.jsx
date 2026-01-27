import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext';

// Layout
import AppLayout from './Components/Layout/AppLayout';

// Error Boundary
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

// Protected Route
import ProtectedRoute from './Components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';

// Protected Pages
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import ConsentPage from './pages/Consent/ConsentPage';
import Dashboard from './pages/Dashboard/Dashboard';
import UploadPage from './pages/Upload/UploadPage';
import ProcessingPage from './pages/Processing/ProcessingPage';
import ReportPage from './pages/Report/ReportPage';
import PaymentPage from './pages/Payment/PaymentPage';
import ProfilePage from './pages/Profile/ProfilePage';
import HistoryPage from './pages/History/HistoryPage';

// Error Pages
import NotFoundPage from './pages/NotFound/NotFoundPage';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
        />
        <Route 
          path="/forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} 
        />

        {/* Onboarding Flow - Protected but no layout */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              {user?.hasCompletedOnboarding ? <Navigate to="/dashboard" replace /> : <OnboardingPage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/consent"
          element={
            <ProtectedRoute>
              {user?.hasGivenConsent ? <Navigate to="/dashboard" replace /> : <ConsentPage />}
            </ProtectedRoute>
          }
        />

        {/* Main App Routes - Protected with Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UploadPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/processing"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProcessingPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReportPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/report/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReportPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PaymentPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <AppLayout>
                <HistoryPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
