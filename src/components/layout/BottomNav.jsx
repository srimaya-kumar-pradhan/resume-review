import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './Sidebar';

/**
 * Mobile bottom navigation bar.
 * Fixed to the bottom of the viewport, visible only on screens below lg breakpoint.
 * Uses the same NAV_ITEMS configuration as the Sidebar for consistency.
 *
 * @returns {JSX.Element}
 */
export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur-lg border-t border-gray-100 z-30 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[56px] ${
                isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={isActive ? 2 : 1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={item.icon} />
                  </svg>
                  {/* Active dot indicator */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] font-medium leading-tight ${isActive ? 'font-semibold' : ''}`}>
                  {item.label.length > 10 ? item.label.split(' ')[0] : item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
