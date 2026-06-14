import { useState, useRef, useCallback } from 'react';
import { createModel, streamChat } from '../services/gemini';

/**
 * Custom hook for managing a streaming chat session with Gemini.
 *
 * @param {string} systemInstruction - System prompt for the AI
 * @returns {object} Chat state and methods
 *
 * @example
 *   const { messages, isStreaming, sendMessage, clearChat } = useChat(systemPrompt);
 */
export function useChat(systemInstruction) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  /** Ref to the active chat session — persists across renders */
  const chatRef = useRef(null);

  /**
   * Initializes or retrieves the chat session.
   * Creates a new model + chat on first call, reuses on subsequent calls.
   */
  const getChat = useCallback(() => {
    if (!chatRef.current) {
      const model = createModel(systemInstruction);
      chatRef.current = model.startChat({
        history: [],
      });
    }
    return chatRef.current;
  }, [systemInstruction]);

  /**
   * Sends a user message and streams the AI response.
   * Updates messages state in real-time as chunks arrive.
   *
   * @param {string} userMessage - The message to send
   */
  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim() || isStreaming) return;

      setError(null);

      /* Add user message to state */
      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage.trim(),
        timestamp: new Date(),
      };

      /* Add placeholder AI message for streaming */
      const aiMsgId = (Date.now() + 1).toString();
      const aiMsg = {
        id: aiMsgId,
        role: 'model',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setIsStreaming(true);

      try {
        const chat = getChat();

        await streamChat(chat, userMessage.trim(), (chunk) => {
          /* Update the AI message content as chunks arrive */
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
        });

        /* Mark streaming as complete */
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
          )
        );
      } catch (err) {
        console.error('Chat error:', err);

        const errorMessage = err.message?.includes('API key')
          ? 'Invalid API key. Please check your Gemini API key configuration.'
          : err.message?.includes('quota')
          ? 'API quota exceeded. Please try again later.'
          : err.message?.includes('blocked')
          ? 'Response was blocked by safety filters. Please rephrase your question.'
          : 'Something went wrong. Please try again.';

        setError(errorMessage);

        /* Update the AI message with error state */
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  content: '',
                  isStreaming: false,
                  isError: true,
                  errorMessage,
                }
              : msg
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, getChat]
  );

  /**
   * Clears all messages and resets the chat session.
   */
  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    chatRef.current = null;
  }, []);

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    clearChat,
  };
}
