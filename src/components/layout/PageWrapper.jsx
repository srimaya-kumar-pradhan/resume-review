import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';

/**
 * Main layout shell that wraps all authenticated pages.
 * Provides consistent structure: Sidebar (desktop) + Header + Content + BottomNav (mobile).
 *
 * Layout:
 * ┌─────────┬──────────────────────┐
 * │         │  Header              │
 * │ Sidebar ├──────────────────────┤
 * │ (lg+)   │  Content Area        │
 * │         │                      │
 * └─────────┴──────────────────────┘
 * │      BottomNav (mobile)        │
 * └────────────────────────────────┘
 *
 * @param {object} props
 * @param {string} props.title - Page title for the header
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {React.ReactNode} props.children - Page content
 * @param {boolean} [props.padded=true] - Whether to add default padding
 * @param {string} [props.className] - Additional classes for content area
 * @returns {JSX.Element}
 */
export default function PageWrapper({
  title,
  subtitle,
  children,
  padded = true,
  className = '',
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <Header title={title} subtitle={subtitle} />

        {/* Page content */}
        <main
          className={`
            flex-1
            ${padded ? 'px-4 lg:px-8 py-6 lg:py-8' : ''}
            pb-24 lg:pb-8
            ${className}
          `}
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
