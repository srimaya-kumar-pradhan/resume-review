/**
 * Reusable Card container component.
 *
 * @param {object} props
 * @param {React.ReactNode} [props.header] - Optional card header content
 * @param {React.ReactNode} props.children - Card body content
 * @param {'sm'|'md'|'lg'|'none'} [props.padding='md'] - Internal padding
 * @param {boolean} [props.hoverable=false] - Adds hover lift effect
 * @param {string} [props.className] - Additional classes
 * @param {object} rest - Spread to container div
 * @returns {JSX.Element}
 */
export default function Card({
  header,
  children,
  padding = 'md',
  hoverable = false,
  className = '',
  ...rest
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-surface rounded-card border border-gray-100 shadow-md
        ${hoverable ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
      {...rest}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-100">
          {typeof header === 'string' ? (
            <h3 className="text-lg font-semibold text-text">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}

      <div className={paddingClasses[padding] || paddingClasses.md}>
        {children}
      </div>
    </div>
  );
}
