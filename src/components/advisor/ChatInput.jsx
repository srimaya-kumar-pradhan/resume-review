import { useState, useRef, useEffect } from 'react';

/**
 * Chat input bar with send button.
 * Supports Enter to send, Shift+Enter for new line, auto-resize textarea.
 *
 * @param {object} props
 * @param {(message: string) => void} props.onSend - Called with the message text
 * @param {boolean} props.disabled - Disables input while streaming
 * @param {string} [props.placeholder] - Input placeholder
 * @returns {JSX.Element}
 */
export default function ChatInput({
  onSend,
  disabled,
  placeholder = 'Ask about career paths, skills, internships...',
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  /**
   * Auto-resize the textarea as the user types.
   * Min height: 1 row. Max height: ~5 rows (120px).
   */
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value);
      setValue('');
      /* Reset height */
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-100 bg-surface p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm text-text placeholder:text-text-muted resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors disabled:opacity-50"
            aria-label="Chat message"
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          id="chat-send-button"
          className="w-11 h-11 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/20 hover:shadow-lg flex-shrink-0"
          aria-label="Send message"
        >
          {disabled ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="text-center text-[10px] text-text-muted mt-2 max-w-4xl mx-auto">
        Press Enter to send • Shift+Enter for new line • AI responses are for guidance only
      </p>
    </div>
  );
}
