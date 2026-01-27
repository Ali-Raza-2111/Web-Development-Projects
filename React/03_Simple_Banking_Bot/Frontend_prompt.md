# Frontend Development Prompt

> Use this prompt to generate a modern, professional React frontend with a glassmorphism design system, authentication, protected routes, and a clean folder structure.

---

## Prompt

Create a modern React frontend application with the following specifications:

### 1. Technology Stack

- **Build Tool:** Vite (latest version)
- **Framework:** React 19+ with functional components and hooks
- **Routing:** React Router DOM v7+
- **HTTP Client:** Axios for API calls
- **Icons:** Lucide React for consistent iconography
- **Styling:** Vanilla CSS with CSS Variables (no Tailwind or CSS-in-JS)

### 2. Project Structure

Create the following folder structure:

```
src/
├── main.jsx                    # App entry point with BrowserRouter
├── App.jsx                     # Main app with routes
├── assets/
│   └── styles/
│       └── global.css          # Global styles and CSS variables
├── Components/
│   ├── ProtectedRoute.jsx      # Route guard for authenticated pages
│   ├── ErrorBoundary/
│   │   ├── ErrorBoundary.jsx   # Class-based error boundary
│   │   ├── ErrorBoundary.css
│   │   └── index.js            # Barrel export
│   ├── FloatingChat/           # Optional floating widget component
│   │   ├── FloatingChat.jsx
│   │   └── FloatingChat.css
│   └── Layout/
│       ├── AppLayout.jsx       # Main app layout with sidebar/header
│       └── AppLayout.css
├── context/
│   └── authContext.jsx         # Authentication context with login/logout/signup
├── hooks/
│   └── useAxios.js             # Custom axios hook (optional)
├── pages/
│   ├── landingPage.jsx         # Public landing page
│   ├── landingPage.css
│   ├── Auth/
│   │   ├── loginPage.jsx
│   │   ├── signupPage.jsx
│   │   └── Auth.css
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.css
│   ├── Error/
│   │   ├── NotFound.jsx        # 404 page
│   │   └── NotFound.css
│   └── [Feature]/              # Additional feature pages
│       ├── [Feature].jsx
│       └── [Feature].css
├── services/
│   └── api.js                  # Centralized API service with axios instance
└── utils/
    ├── formatters.js           # Text/data formatting utilities
    └── validator.js            # Form validation utilities
```

### 3. Design System - Deep Ocean & Glassmorphism Theme

Create a CSS variables system in `global.css` with:

#### Color Palette

```css
:root {
  /* Primary Ocean Colors */
  --ocean-darkest: #0a0e1a;
  --ocean-darker: #0d1321;
  --ocean-dark: #1a2332;
  --ocean-deep: #1e3a5f;
  --ocean-mid: #2563eb;
  --ocean-light: #3b82f6;
  --ocean-glow: #60a5fa;
  --ocean-shimmer: #93c5fd;

  /* Glass Colors */
  --glass-white: rgba(255, 255, 255, 0.1);
  --glass-white-light: rgba(255, 255, 255, 0.05);
  --glass-white-strong: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-shadow: rgba(0, 0, 0, 0.3);

  /* Accent Colors */
  --accent-cyan: #06b6d4;
  --accent-teal: #14b8a6;
  --accent-purple: #8b5cf6;
  --accent-pink: #ec4899;
  --accent-success: #10b981;
  --accent-warning: #f59e0b;
  --accent-error: #ef4444;

  /* Text Colors */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --text-dark: #1e293b;

  /* Gradients */
  --gradient-ocean: linear-gradient(135deg, var(--ocean-darkest) 0%, var(--ocean-dark) 50%, var(--ocean-deep) 100%);
  --gradient-glass: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  --gradient-glow: linear-gradient(135deg, var(--ocean-mid) 0%, var(--accent-cyan) 100%);
  --gradient-hero: radial-gradient(ellipse at top, var(--ocean-dark) 0%, var(--ocean-darkest) 70%);

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 40px rgba(59, 130, 246, 0.3);
  --shadow-glow-strong: 0 0 60px rgba(59, 130, 246, 0.5);

  /* Font Families */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

#### Glassmorphism Card Component

```css
.glass-card {
  background: var(--glass-white);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.glass-card-hover {
  transition: all var(--transition-base);
}

.glass-card-hover:hover {
  background: var(--glass-white-strong);
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
}
```

#### Button Styles

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  font-family: var(--font-primary);
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary {
  background: var(--gradient-glow);
  color: var(--text-primary);
  box-shadow: var(--shadow-md), 0 0 20px rgba(37, 99, 235, 0.4);
}

.btn-secondary {
  background: var(--glass-white);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
}
```

### 4. Core Components Implementation

#### main.jsx

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './assets/styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

#### App.jsx Structure

```jsx
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './Components/ProtectedRoute'
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary'

// Public Pages
import LandingPage from './pages/landingPage'
import LoginPage from './pages/Auth/loginPage'
import SignupPage from './pages/Auth/signupPage'

// Protected Pages
import Dashboard from './pages/Dashboard/Dashboard'

// Error Pages
import NotFound from './pages/Error/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* 404 Catch-All Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
```

### 5. Authentication System

#### authContext.jsx

Implement an authentication context with:

- `user` state (object with name, email, avatar)
- `token` state (JWT token from localStorage)
- `isLoading` state (for initial auth check)
- `isAuthenticated` computed from token
- `login(email, password)` - POST to `/token` with FormData
- `signup(name, email, password)` - POST to `/user` then auto-login
- `logout()` - Clear localStorage and state
- Store token and user in localStorage for persistence
- Set Authorization header on axios instance

#### ProtectedRoute.jsx

```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />; // Show loading state
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
```

### 6. API Service Layer

#### api.js

```jsx
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Configure for your backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export specific API functions
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Add more API functions as needed

export default api;
```

### 7. Page Patterns

#### Landing Page Pattern

- Full-height hero section with gradient background
- Animated background orbs (CSS animations)
- Sticky navbar that changes on scroll
- Feature cards with icons
- Testimonials section
- Stats display
- CTA sections

#### Auth Pages Pattern

- Centered card on gradient background
- Form with icon-prefixed inputs
- Password visibility toggle
- Error message display
- Loading state on submit
- Link to switch between login/signup
- Back to home link

#### Dashboard Pattern

- AppLayout wrapper with sidebar navigation
- Welcome header with user name
- Stats grid with icon cards
- Quick action buttons
- Recent items list
- Glass card styling throughout

#### Error Pages Pattern

- Full-screen centered content
- Animated error icon with pulse rings
- Error code display (404, etc.)
- Helpful message and suggested actions
- Navigation buttons (Go Home, Go Back)
- Floating particle animations

### 8. Animation Patterns

#### Background Orbs

```css
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}
```

#### Fade In Animations

```css
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 9. Mobile Responsiveness

- Use `clamp()` for responsive typography: `font-size: clamp(2rem, 5vw, 4rem)`
- Mobile-first media queries
- Collapsible sidebar with hamburger menu on mobile
- Touch-friendly tap targets (min 44px)
- Safe area insets for notched devices
- Disable user scaling for app-like feel

### 10. index.html Configuration

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0a0e1a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <title>App Name - Tagline</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 11. package.json Dependencies

```json
{
  "dependencies": {
    "axios": "^1.x",
    "lucide-react": "^0.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "react-router-dom": "^7.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.x",
    "vite": "^7.x"
  }
}
```

---

## Key Features Checklist

- [ ] Vite + React 19 setup
- [ ] React Router DOM with nested routes
- [ ] Authentication context with JWT token handling
- [ ] Protected routes with redirect to login
- [ ] Error boundary for crash handling
- [ ] 404 Not Found page
- [ ] Glassmorphism design system
- [ ] CSS variables for theming
- [ ] Responsive design (mobile-first)
- [ ] Form handling with validation
- [ ] API service layer with axios
- [ ] Loading states and error handling
- [ ] Animated backgrounds and transitions
- [ ] Icon system with Lucide React
- [ ] Clean folder structure with separation of concerns

---

## Usage Notes

1. Replace `API_URL` in `api.js` with your backend URL
2. Adjust the color palette CSS variables to match your brand
3. Add additional pages following the established patterns
4. Each page should have its own CSS file in the same folder
5. Use the `glass-card` class for consistent card styling
6. Wrap protected pages with `<ProtectedRoute>` component
7. Use `<AppLayout>` for consistent dashboard-style pages
8. Import icons from `lucide-react` for consistency
