/**
 * Loading spinner component with size variants.
 *
 * @param {object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {string} [props.label='Loading...'] - Screen reader label
 * @param {boolean} [props.fullScreen=false] - Centers in viewport
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
export default function Spinner({
  size = 'md',
  label = 'Loading...',
  fullScreen = false,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div
      className={`flex flex-col items-center gap-3 ${className}`}
      role="status"
      aria-label={label}
    >
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          border-primary/30 border-t-primary rounded-full animate-spin
        `}
      />
      {(size === 'lg' || size === 'xl' || fullScreen) && (
        <p className="text-text-light text-sm">{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
