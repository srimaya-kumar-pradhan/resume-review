import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileSetup from './components/profile/ProfileSetup';
import CareerAdvisor from './components/advisor/CareerAdvisor';
import SkillGapAnalysis from './components/skill-gap/SkillGapAnalysis';
import ProjectGenerator from './components/projects/ProjectGenerator';
import ResumeReview from './components/resume/ResumeReview';
import PageWrapper from './components/layout/PageWrapper';

/**
 * Root application component.
 * Wraps all routes in AuthProvider and ProfileProvider.
 *
 * Route structure:
 * - /login         → Google Sign-In page (public)
 * - /profile/setup → Profile wizard (auth required)
 * - /dashboard     → Main dashboard (Phase 10)
 * - /advisor       → Career Advisor AI chat
 * - /skill-gap     → Skill Gap Analysis
 * - /projects      → Project Generator
 * - /resume        → Resume Review
 */
function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Profile setup */}
            <Route path="/profile/setup" element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            } />

            {/* Dashboard — placeholder until Phase 10 */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PageWrapper title="Dashboard" subtitle="Overview">
                  <PlaceholderContent name="Dashboard" phase={10} />
                </PageWrapper>
              </ProtectedRoute>
            } />

            {/* AI Features */}
            <Route path="/advisor" element={
              <ProtectedRoute>
                <CareerAdvisor />
              </ProtectedRoute>
            } />

            <Route path="/skill-gap" element={
              <ProtectedRoute>
                <SkillGapAnalysis />
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute>
                <ProjectGenerator />
              </ProtectedRoute>
            } />

            <Route path="/resume" element={
              <ProtectedRoute>
                <ResumeReview />
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
 * Temporary placeholder content for the Dashboard (Phase 10).
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
