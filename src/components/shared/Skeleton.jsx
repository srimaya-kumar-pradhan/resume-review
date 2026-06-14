/**
 * Content placeholder skeleton for loading states.
 * Renders a pulsing gray block that mimics the shape of content.
 *
 * @param {object} props
 * @param {'text'|'title'|'avatar'|'card'|'button'|'custom'} [props.variant='text']
 * @param {string} [props.width] - CSS width (e.g. '200px', '100%')
 * @param {string} [props.height] - CSS height
 * @param {boolean} [props.rounded=false] - Full rounding (for avatars)
 * @param {number} [props.lines=1] - Number of text lines to show
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
export default function Skeleton({
  variant = 'text',
  width,
  height,
  rounded = false,
  lines = 1,
  className = '',
}) {
  const baseClasses = 'bg-gray-200 animate-pulse';

  const presets = {
    text: { w: '100%', h: '16px', r: 'rounded' },
    title: { w: '60%', h: '24px', r: 'rounded' },
    avatar: { w: '48px', h: '48px', r: 'rounded-full' },
    card: { w: '100%', h: '120px', r: 'rounded-card' },
    button: { w: '120px', h: '40px', r: 'rounded-input' },
    custom: { w: width || '100%', h: height || '20px', r: rounded ? 'rounded-full' : 'rounded' },
  };

  const preset = presets[variant] || presets.text;

  /* Text variant can render multiple lines */
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={`${baseClasses} rounded`}
            style={{
              width: i === lines - 1 ? '75%' : '100%', // Last line shorter
              height: preset.h,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${preset.r} ${className}`}
      style={{
        width: width || preset.w,
        height: height || preset.h,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Pre-composed skeleton layout for a profile card loading state.
 * @returns {JSX.Element}
 */
export function ProfileCardSkeleton() {
  return (
    <div className="bg-surface rounded-card border border-gray-100 shadow-md overflow-hidden">
      <Skeleton variant="custom" width="100%" height="96px" className="rounded-none" />
      <div className="pt-14 px-6 pb-6">
        <div className="flex items-center gap-3 -mt-16 mb-4">
          <Skeleton variant="avatar" width="80px" height="80px" />
        </div>
        <Skeleton variant="title" className="mb-2" />
        <Skeleton variant="text" width="60%" className="mb-4" />
        <Skeleton variant="text" lines={2} />
      </div>
    </div>
  );
}

/**
 * Pre-composed skeleton for a feature card loading state.
 * @returns {JSX.Element}
 */
export function FeatureCardSkeleton() {
  return (
    <div className="bg-surface rounded-card border border-gray-100 shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="custom" width="40px" height="40px" rounded />
        <Skeleton variant="title" width="40%" />
      </div>
      <Skeleton variant="text" lines={3} />
      <Skeleton variant="button" className="mt-4" />
    </div>
  );
}
