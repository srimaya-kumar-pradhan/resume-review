import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Route guard that protects child routes from unauthenticated access.
 *
 * Behavior:
 * - If auth is loading → shows a full-screen spinner
 * - If user is null   → redirects to /login
 * - If user exists    → renders children
 *
 * Profile-completeness check is added in Phase 4 via ProfileContext.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Protected route content
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  /* Show a loading screen while Firebase checks auth state */
  if (loading) {
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
   * TODO (Phase 4): Check profile completeness here.
   * If user.profileComplete is false, redirect to /profile/setup.
   * This will be wired once ProfileContext is built.
   */

  return children;
}
