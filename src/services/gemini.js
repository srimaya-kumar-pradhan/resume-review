import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Google Gemini AI service.
 * Provides a configured client and helper methods for generating content.
 *
 * Uses the Gemini 2.0 Flash model for fast, high-quality responses.
 * API key is loaded from VITE_GEMINI_API_KEY environment variable.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn(
    'VITE_GEMINI_API_KEY is not set. AI features will not work. ' +
    'Add your Gemini API key to the .env file.'
  );
}

/** Singleton GoogleGenerativeAI instance */
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/** Default model configuration */
const DEFAULT_CONFIG = {
  temperature: 0.8,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};

/**
 * Creates a generative model instance with the given system instruction.
 *
 * @param {string} systemInstruction - System prompt for the model
 * @param {object} [configOverrides] - Override default generation config
 * @returns {import('@google/generative-ai').GenerativeModel}
 */
export function createModel(systemInstruction, configOverrides = {}) {
  if (!genAI) {
    throw new Error('Gemini API key is not configured.');
  }

  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction,
    generationConfig: {
      ...DEFAULT_CONFIG,
      ...configOverrides,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  });
}

/**
 * Sends a message to a chat session and streams the response.
 * Calls the onChunk callback with each text chunk as it arrives.
 *
 * @param {import('@google/generative-ai').ChatSession} chat - Active chat session
 * @param {string} message - User message
 * @param {(chunk: string) => void} onChunk - Called with each text chunk
 * @returns {Promise<string>} Full response text
 */
export async function streamChat(chat, message, onChunk) {
  const result = await chat.sendMessageStream(message);

  let fullText = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      fullText += text;
      onChunk(text);
    }
  }

  return fullText;
}

/**
 * One-shot generation (no chat history needed).
 *
 * @param {string} systemInstruction - System prompt
 * @param {string} prompt - User prompt
 * @param {object} [configOverrides] - Generation config overrides
 * @returns {Promise<string>} Generated text
 */
export async function generateContent(systemInstruction, prompt, configOverrides = {}) {
  const model = createModel(systemInstruction, configOverrides);
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export { genAI };
