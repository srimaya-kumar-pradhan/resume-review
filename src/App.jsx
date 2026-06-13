import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileSetup from './components/profile/ProfileSetup';

/**
 * Root application component.
 * Wraps all routes in AuthProvider and ProfileProvider.
 *
 * Route structure:
 * - /login         → Google Sign-In page (public)
 * - /profile/setup → Profile wizard (auth required, no profile check)
 * - /dashboard     → Main dashboard (auth + profile required)
 * - /advisor       → Career Advisor AI feature
 * - /skill-gap     → Skill Gap Analysis AI feature
 * - /projects      → Project Generator AI feature
 * - /resume        → Resume Review AI feature
 *
 * ProtectedRoute handles:
 * 1. Redirect to /login if not authenticated
 * 2. Redirect to /profile/setup if profile incomplete
 */
function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Profile setup — auth required but no profile check */}
            <Route path="/profile/setup" element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            } />

            {/* Protected routes — require auth + complete profile */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PlaceholderPage name="Dashboard" phase={10} />
              </ProtectedRoute>
            } />

            <Route path="/advisor" element={
              <ProtectedRoute>
                <PlaceholderPage name="Career Advisor" phase={6} />
              </ProtectedRoute>
            } />

            <Route path="/skill-gap" element={
              <ProtectedRoute>
                <PlaceholderPage name="Skill Gap Analysis" phase={7} />
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute>
                <PlaceholderPage name="Project Generator" phase={8} />
              </ProtectedRoute>
            } />

            <Route path="/resume" element={
              <ProtectedRoute>
                <PlaceholderPage name="Resume Review" phase={9} />
              </ProtectedRoute>
            } />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  );
}

/**
 * Temporary placeholder for routes not yet implemented.
 * Replaced with actual components in their respective phases.
 *
 * @param {object} props
 * @param {string} props.name - Feature name
 * @param {number} props.phase - Phase number
 * @returns {JSX.Element}
 */
function PlaceholderPage({ name, phase }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h1 className="text-2xl font-semibold text-text mb-2">{name}</h1>
        <p className="text-text-light">Coming in Phase {phase}</p>
      </div>
    </div>
  );
}

export default App;
