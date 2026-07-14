const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.error('[CONFIG] FATAL: GEMINI_API_KEY is not set. Gemini roadmap generation will not work.');
}
if (!GROQ_API_KEY) {
  console.error('[CONFIG] FATAL: GROQ_API_KEY is not set. Groq AI tutor chatbot will not work.');
}

export const aiProviders = {
  gemini: {
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    available: !!GEMINI_API_KEY,
  },
  groq: {
    apiKey: GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    baseUrl: 'https://api.groq.com/openai/v1',
    available: !!GROQ_API_KEY,
  },
} as const;
