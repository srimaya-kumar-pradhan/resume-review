import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileSetup from './components/profile/ProfileSetup';
import Dashboard from './components/dashboard/Dashboard';
import CareerAdvisor from './components/advisor/CareerAdvisor';
import SkillGapAnalysis from './components/skill-gap/SkillGapAnalysis';
import ProjectGenerator from './components/projects/ProjectGenerator';
import ResumeReview from './components/resume/ResumeReview';

/**
 * Root application component.
 * Wraps all routes in AuthProvider and ProfileProvider.
 *
 * Route structure:
 * - /login         → Google Sign-In page (public)
 * - /profile/setup → Profile wizard (auth required)
 * - /dashboard     → Central hub with feature cards
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

            {/* Dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
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

export default App;
