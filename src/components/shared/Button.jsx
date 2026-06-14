/**
 * Reusable Button component with variants, sizes, and loading state.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.loading=false] - Shows spinner and disables button
 * @param {boolean} [props.fullWidth=false]
 * @param {React.ReactNode} [props.icon] - Optional leading icon
 * @param {React.ReactNode} props.children
 * @param {string} [props.className] - Additional classes
 * @param {object} rest - Spread to native <button>
 * @returns {JSX.Element}
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...rest
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-input transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-primary-600 focus:ring-primary/50 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30',
    secondary:
      'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary/50 shadow-md shadow-secondary/20',
    outline:
      'bg-transparent text-primary border-2 border-primary/30 hover:bg-primary-50 hover:border-primary focus:ring-primary/30',
    ghost:
      'bg-transparent text-text hover:bg-gray-100 focus:ring-gray-300',
    danger:
      'bg-danger text-white hover:bg-red-600 focus:ring-danger/50 shadow-md shadow-danger/20',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : icon ? (
        <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
