const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.error('[CONFIG] GEMINI_API_KEY not set. AI tutor chatbot and roadmap will not work.');
}

export const aiProviders = {
  gemini: {
    apiKey: GEMINI_API_KEY,
    model: 'gemini-2.5-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    available: !!GEMINI_API_KEY,
  },
} as const;
