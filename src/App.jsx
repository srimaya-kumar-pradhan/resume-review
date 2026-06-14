import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileSetup from './components/profile/ProfileSetup';
import PageWrapper from './components/layout/PageWrapper';

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
                <PageWrapper title="Dashboard" subtitle="Overview">
                  <PlaceholderContent name="Dashboard" phase={10} />
                </PageWrapper>
              </ProtectedRoute>
            } />

            <Route path="/advisor" element={
              <ProtectedRoute>
                <PageWrapper title="Career Advisor" subtitle="AI-Powered Guidance">
                  <PlaceholderContent name="Career Advisor" phase={6} />
                </PageWrapper>
              </ProtectedRoute>
            } />

            <Route path="/skill-gap" element={
              <ProtectedRoute>
                <PageWrapper title="Skill Analysis" subtitle="Gap Assessment">
                  <PlaceholderContent name="Skill Gap Analysis" phase={7} />
                </PageWrapper>
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute>
                <PageWrapper title="Projects" subtitle="AI Generator">
                  <PlaceholderContent name="Project Generator" phase={8} />
                </PageWrapper>
              </ProtectedRoute>
            } />

            <Route path="/resume" element={
              <ProtectedRoute>
                <PageWrapper title="Resume Review" subtitle="AI Analysis">
                  <PlaceholderContent name="Resume Review" phase={9} />
                </PageWrapper>
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
 * Temporary placeholder content for routes not yet implemented.
 * Now renders inside PageWrapper layout (not full-screen).
 *
 * @param {object} props
 * @param {string} props.name - Feature name
 * @param {number} props.phase - Phase number
 * @returns {JSX.Element}
 */
function PlaceholderContent({ name, phase }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-fade-in">
          <span className="text-3xl">🚧</span>
        </div>
        <h2 className="text-2xl font-bold text-text mb-2">{name}</h2>
        <p className="text-text-light mb-4">This feature is coming in Phase {phase}</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary text-sm font-medium rounded-pill">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Under Development
        </div>
      </div>
    </div>
  );
}

export default App;
