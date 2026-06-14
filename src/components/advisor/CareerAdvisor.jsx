import { useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useChat } from '../../hooks/useChat';
import { buildCareerAdvisorPrompt, STARTER_PROMPTS } from '../../services/careerAdvisorPrompt';
import PageWrapper from '../layout/PageWrapper';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

/**
 * Career Advisor AI chat page.
 * Provides a streaming conversational interface powered by Gemini,
 * personalized with the student's profile data.
 *
 * @returns {JSX.Element}
 */
export default function CareerAdvisor() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const messagesEndRef = useRef(null);

  /** Build the system prompt with the user's profile data */
  const systemPrompt = useMemo(
    () => buildCareerAdvisorPrompt(profile),
    [profile]
  );

  const { messages, isStreaming, error, sendMessage, clearChat } = useChat(systemPrompt);

  /** Auto-scroll to the latest message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <PageWrapper title="Career Advisor" subtitle="AI-Powered Guidance">
      <div className="flex flex-col h-[calc(100vh-12rem)] lg:h-[calc(100vh-10rem)] max-w-4xl mx-auto bg-surface rounded-card border border-gray-100 shadow-md overflow-hidden">
        {/* Chat header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">CareerBot</h2>
              <p className="text-xs text-text-muted">
                {isStreaming ? (
                  <span className="text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    Thinking...
                  </span>
                ) : (
                  'Personalized career guidance'
                )}
              </p>
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              disabled={isStreaming}
              className="px-3 py-1.5 text-xs font-medium text-text-light bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-text transition-colors disabled:opacity-50"
              title="Clear conversation"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          )}
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Empty state — starter prompts */
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-text mb-1">How can I help your career?</h3>
              <p className="text-sm text-text-light mb-6 text-center max-w-sm">
                I know about your skills, interests, and goals. Ask me anything about your career journey!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {STARTER_PROMPTS.map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(starter.prompt)}
                    className="flex items-start gap-3 p-4 text-left bg-gray-50 rounded-xl border border-gray-100 hover:bg-primary-50 hover:border-primary/20 transition-all duration-200 group"
                  >
                    <span className="text-xl flex-shrink-0">{starter.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                        {starter.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                        {starter.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message list */
            <div className="py-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  userPhotoURL={profile?.photoURL || user?.photoURL}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </PageWrapper>
  );
}
