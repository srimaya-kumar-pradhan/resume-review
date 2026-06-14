/**
 * Reusable Input component with label, error message, and helper text.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string} [props.error] - Validation error message
 * @param {string} [props.helper] - Helper text shown below input
 * @param {string} [props.id] - HTML id (auto-generated from label if omitted)
 * @param {string} [props.className] - Additional wrapper classes
 * @param {'input'|'textarea'} [props.as='input'] - Render as input or textarea
 * @param {object} rest - Spread to native <input> or <textarea>
 * @returns {JSX.Element}
 */
export default function Input({
  label,
  error,
  helper,
  id,
  className = '',
  as = 'input',
  ...rest
}) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-text"
        >
          {label}
        </label>
      )}

      <Component
        id={fieldId}
        className={`
          w-full px-4 py-3 bg-surface border-2 rounded-input text-text
          placeholder:text-text-muted transition-colors duration-200
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
          ${error ? 'border-danger' : 'border-gray-200'}
          ${as === 'textarea' ? 'resize-none' : ''}
        `}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${fieldId}-error` : helper ? `${fieldId}-helper` : undefined
        }
        {...rest}
      />

      {error && (
        <p
          id={`${fieldId}-error`}
          className="text-sm text-danger flex items-center gap-1"
          role="alert"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </p>
      )}

      {!error && helper && (
        <p id={`${fieldId}-helper`} className="text-xs text-text-muted">
          {helper}
        </p>
      )}
    </div>
  );
}
