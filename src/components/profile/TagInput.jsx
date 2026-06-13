import { useState, useRef } from 'react';

/**
 * Pill-style tag input component for skills and interests.
 * Supports adding tags via Enter key or Add button, removing
 * via click or Backspace, and validates max tag count and length.
 *
 * @param {object} props
 * @param {string} props.label - Field label
 * @param {string[]} props.tags - Current tags array
 * @param {(tags: string[]) => void} props.onChange - Called with updated tags
 * @param {string} [props.error] - Validation error message
 * @param {number} [props.maxTags=20] - Maximum number of tags
 * @param {string} [props.placeholder] - Input placeholder text
 * @param {string} [props.id] - HTML id for the input
 * @returns {JSX.Element}
 */
export default function TagInput({
  label,
  tags,
  onChange,
  error,
  maxTags = 20,
  placeholder = 'Type and press Enter...',
  id,
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  /**
   * Adds the current input value as a new tag.
   * Validates: non-empty, ≤50 chars, no duplicates, under max.
   */
  const addTag = () => {
    const value = inputValue.trim();
    if (!value) return;
    if (value.length > 50) return;
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) return;
    if (tags.length >= maxTags) return;

    onChange([...tags, value]);
    setInputValue('');
  };

  /**
   * Removes a tag at the given index.
   * @param {number} index
   */
  const removeTag = (index) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  /**
   * Handles keyboard events on the input.
   * Enter → add tag. Backspace on empty input → remove last tag.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text"
      >
        {label}
        <span className="text-text-muted ml-1 font-normal">
          ({tags.length}{maxTags < 100 ? `/${maxTags}` : ''})
        </span>
      </label>

      {/* Tag container + input */}
      <div
        className={`
          flex flex-wrap items-center gap-2 p-3 min-h-[48px]
          bg-surface border-2 rounded-input
          transition-colors duration-200
          focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10
          ${error ? 'border-danger' : 'border-gray-200'}
        `}
        onClick={() => inputRef.current?.focus()}
        role="group"
        aria-label={label}
      >
        {/* Existing tags */}
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-pill border border-primary-200 animate-fade-in"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary-200 text-primary-500 hover:text-primary-800 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        {/* Input field (hidden when max reached) */}
        {tags.length < maxTags && (
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={tags.length === 0 ? placeholder : 'Add more...'}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-text placeholder:text-text-muted"
            aria-label={`Add ${label.toLowerCase()}`}
          />
        )}
      </div>

      {/* Helper text */}
      {!error && tags.length === 0 && (
        <p className="text-xs text-text-muted">
          Press Enter to add each item
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-sm text-danger flex items-center gap-1" role="alert">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
