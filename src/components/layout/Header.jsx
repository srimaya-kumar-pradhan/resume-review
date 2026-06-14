import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

/**
 * Top header bar.
 * Shows the current page title, a greeting, and user avatar.
 * On mobile, also shows a compact logo.
 *
 * @param {object} props
 * @param {string} props.title - Current page title
 * @param {string} [props.subtitle] - Optional subtitle / breadcrumb
 * @returns {JSX.Element}
 */
export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.name || user?.displayName || 'User';
  const firstName = displayName.split(' ')[0];

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left: Title area */}
        <div>
          {/* Mobile logo — hidden on desktop where sidebar shows it */}
          <div className="lg:hidden flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
            <span className="text-xs font-bold text-text">Smart Career</span>
          </div>

          {subtitle && (
            <p className="text-xs text-text-muted mb-0.5">{subtitle}</p>
          )}
          <h1 className="text-xl lg:text-2xl font-bold text-text">{title}</h1>
        </div>

        {/* Right: User avatar + greeting */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-text">Hi, {firstName}! 👋</p>
            <p className="text-xs text-text-muted">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          <img
            src={profile?.photoURL || user?.photoURL || ''}
            alt={displayName}
            className="w-10 h-10 rounded-full border-2 border-primary/20 shadow-sm"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
