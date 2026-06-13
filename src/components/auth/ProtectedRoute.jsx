import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

/**
 * Route guard that protects child routes from unauthenticated access
 * and redirects users with incomplete profiles to /profile/setup.
 *
 * Behavior:
 * - If auth is loading OR profile is loading → full-screen spinner
 * - If user is null → redirect to /login
 * - If profile is not complete AND current path is not /profile/setup → redirect to /profile/setup
 * - Otherwise → render children
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Protected route content
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { isProfileComplete, loading: profileLoading } = useProfile();
  const location = useLocation();

  /* Show spinner while checking auth or fetching profile */
  if (authLoading || (user && profileLoading)) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        role="status"
        aria-label="Checking authentication"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-text-light text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  /* Redirect unauthenticated users to login */
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /*
   * Redirect users with incomplete profiles to /profile/setup.
   * Skip this check if we're already on the setup page to avoid infinite loop.
   */
  if (!isProfileComplete && location.pathname !== '/profile/setup') {
    return <Navigate to="/profile/setup" replace />;
  }

  return children;
}
