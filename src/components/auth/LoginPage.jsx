import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Login page with Google Sign-In.
 * Features a split layout: branded hero panel on desktop +
 * glassmorphism login card. Redirects to /dashboard if
 * the user is already authenticated.
 *
 * @returns {JSX.Element}
 */
export default function LoginPage() {
  const { user, loading, error, signIn, clearError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  /* Redirect authenticated users to dashboard */
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  /**
   * Handles the Google Sign-In button click.
   * Shows a loading state while the popup is open.
   */
  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
    } finally {
      setIsSigningIn(false);
    }
  };

  /* Show a full-screen loader while checking initial auth state */
  if (loading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        role="status"
        aria-label="Loading application"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-text-light text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ─── Left Hero Panel (desktop only) ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary to-secondary">
        {/* Animated floating shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary-300/10 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo icon */}
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
            Your AI-Powered
            <br />
            <span className="text-secondary-300">Career Companion</span>
          </h1>

          <p className="text-lg text-white/70 max-w-md mb-10 leading-relaxed">
            Get personalized career paths, skill gap analysis, project ideas,
            and resume reviews — all tailored to your unique profile.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3">
            {['Career Paths', 'Skill Analysis', 'Project Ideas', 'Resume Review'].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-pill border border-white/10 text-white/80"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Right Login Panel ─── */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary-50 p-6 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile logo (visible on small screens only) */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text">Smart Career Assistant</h2>
            <p className="text-text-light text-sm mt-1">AI-powered guidance for students</p>
          </div>

          {/* Login card */}
          <div className="bg-surface rounded-card shadow-xl shadow-primary/5 border border-primary-100/50 p-8 lg:p-10 animate-fade-in">
            <div className="hidden lg:block mb-8">
              <h2 className="text-2xl font-bold text-text mb-2">Welcome back</h2>
              <p className="text-text-light">Sign in to access your career dashboard</p>
            </div>

            <div className="lg:hidden text-center mb-8">
              <h2 className="text-xl font-semibold text-text mb-1">Get Started</h2>
              <p className="text-text-light text-sm">Sign in with your Google account</p>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="mb-6 p-4 bg-danger-50 border border-danger/20 rounded-input text-danger text-sm flex items-start gap-3 animate-fade-in"
                role="alert"
                aria-live="assertive"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <div className="flex-1">
                  <p>{error}</p>
                  <button
                    onClick={clearError}
                    className="text-danger/70 hover:text-danger underline text-xs mt-1"
                    type="button"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              aria-label="Sign in with Google"
              id="google-sign-in-button"
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-surface border-2 border-gray-200 rounded-input text-text font-medium hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 focus-visible:outline-primary transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isSigningIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  {/* Google "G" logo SVG */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-text-muted">
                By signing in, you agree to our{' '}
                <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-text-muted mt-6">
            Powered by Google Gemini AI &bull; Built with Firebase
          </p>
        </div>
      </div>
    </div>
  );
}
