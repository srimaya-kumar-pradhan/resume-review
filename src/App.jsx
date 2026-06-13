import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

/**
 * Root application component.
 * Wraps all routes in AuthProvider for global auth state.
 *
 * Route structure:
 * - /login         → Google Sign-In page (public)
 * - /profile/setup → Profile wizard (auth required)
 * - /dashboard     → Main dashboard (auth + profile required)
 * - /advisor       → Career Advisor AI feature
 * - /skill-gap     → Skill Gap Analysis AI feature
 * - /projects      → Project Generator AI feature
 * - /resume        → Resume Review AI feature
 *
 * ProtectedRoute wraps all authenticated routes.
 * Profile-completeness guard added in Phase 4.
 * PageWrapper layout added in Phase 5.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes — require authentication */}
          <Route path="/profile/setup" element={
            <ProtectedRoute>
              <PlaceholderPage name="Profile Setup" phase={4} />
            </ProtectedRoute>
          } />

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
    </AuthProvider>
  );
}

/**
 * Temporary placeholder for routes not yet implemented.
 * Will be replaced with actual components in their respective phases.
 *
 * @param {object} props
 * @param {string} props.name - Feature name to display
 * @param {number} props.phase - Phase number when this will be built
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
