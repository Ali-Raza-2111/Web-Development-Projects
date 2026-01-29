import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary'
import AppLayout from './Components/Layout/AppLayout'

// Pages
import LandingPage from './pages/landingPage'
import Dashboard from './pages/Dashboard/Dashboard'
import Generator from './pages/Generator/Generator'
import Result from './pages/Generator/Result'

// Error Pages
import NotFound from './pages/Error/NotFound'

function App() {
  return (
    <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Main App Layout */}
          <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generate" element={<Generator />} />
              <Route path="/result" element={<Result />} />
          </Route>

          {/* 404 Catch-All Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </ErrorBoundary>
  )
}

export default App
