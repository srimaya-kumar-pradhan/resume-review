import { useMemo } from 'react';

/**
 * Renders a single chat message bubble.
 * Supports user messages, AI responses (with markdown-like formatting),
 * streaming state, and error state.
 *
 * @param {object} props
 * @param {object} props.message - Message object
 * @param {string} props.message.role - 'user' or 'model'
 * @param {string} props.message.content - Message text
 * @param {boolean} [props.message.isStreaming] - Currently streaming
 * @param {boolean} [props.message.isError] - Error state
 * @param {string} [props.message.errorMessage] - Error description
 * @param {string} [props.userPhotoURL] - User's profile photo
 * @returns {JSX.Element}
 */
export default function ChatMessage({ message, userPhotoURL }) {
  const isUser = message.role === 'user';

  /**
   * Simple markdown-to-HTML converter for AI responses.
   * Handles: bold, headers, lists, code blocks, blockquotes, links.
   */
  const formattedContent = useMemo(() => {
    if (isUser || !message.content) return message.content;

    let html = message.content
      /* Escape HTML */
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      /* Code blocks (triple backtick) */
      .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre class="bg-gray-800 text-green-300 rounded-lg p-4 my-3 overflow-x-auto text-sm font-mono"><code>$2</code></pre>')
      /* Inline code */
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-primary-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      /* Headers */
      .replace(/^### (.+)$/gm, '<h4 class="text-base font-bold text-text mt-4 mb-2">$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 class="text-lg font-bold text-text mt-4 mb-2">$1</h3>')
      .replace(/^# (.+)$/gm, '<h2 class="text-xl font-bold text-text mt-4 mb-2">$1</h2>')
      /* Bold */
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-text">$1</strong>')
      /* Italic */
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      /* Blockquotes */
      .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-primary/30 pl-4 py-1 my-2 text-text-light italic">$1</blockquote>')
      /* Numbered lists */
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-5 list-decimal text-sm leading-relaxed">$2</li>')
      /* Bullet lists */
      .replace(/^[•\-\*] (.+)$/gm, '<li class="ml-5 list-disc text-sm leading-relaxed">$1</li>')
      /* Links */
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary-600">$1</a>')
      /* Line breaks (double newline = paragraph) */
      .replace(/\n\n/g, '</p><p class="mb-2">')
      /* Single line breaks */
      .replace(/\n/g, '<br/>');

    return `<p class="mb-2">${html}</p>`;
  }, [message.content, isUser]);

  /* Error state */
  if (message.isError) {
    return (
      <div className="flex gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="bg-danger-50 border border-danger/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
          <p className="text-sm text-danger">{message.errorMessage || 'An error occurred.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 px-4 py-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <img
            src={userPhotoURL || ''}
            alt="You"
            className="w-8 h-8 rounded-full border-2 border-primary/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
          </div>
        )}
      </div>

      {/* Message bubble */}
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-3'
            : 'bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <div
              className="text-sm leading-relaxed text-text prose-sm"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
            {/* Streaming cursor */}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-primary/60 rounded-sm animate-pulse ml-0.5" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
