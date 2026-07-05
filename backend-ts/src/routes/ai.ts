import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });

import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const FALLBACK_MODELS = [
  'google/gemma-4-31b-it:free',
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
];

const SYSTEM_PROMPT = `You are AdaptLearn AI Tutor, a helpful assistant for VTU CSE students. 
You help with DSA, DBMS, OS, Networks, and Programming (Java, Python, C++, JavaScript).
Rules: Be concise, use examples, format with bullet points, be encouraging.`;

async function callOpenRouterWithRetry(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('No API key');

  const messages: any[] = [{ role: 'system', content: SYSTEM_PROMPT }];
  if (history && history.length > 0) {
    for (const msg of history.slice(-10)) {
      messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
    }
  }
  messages.push({ role: 'user', content: message });

  const models = [process.env.OPENROUTER_MODEL, ...FALLBACK_MODELS].filter(Boolean);

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-OpenRouter-Title': 'AdaptLearn',
          },
          body: JSON.stringify({ model, messages, max_tokens: 2048, temperature: 0.7 }),
        });

        if (resp.status === 429) {
          console.log(`[AI] Rate limited on ${model}, attempt ${attempt + 1}`);
          await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
          continue;
        }

        if (!resp.ok) {
          console.log(`[AI] ${model} returned ${resp.status}`);
          break;
        }

        const data = await resp.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return { text, source: 'openrouter' };
      } catch (err: any) {
        console.error(`[AI] ${model} error:`, err.message);
      }
    }
  }

  throw new Error('All models failed');
}

async function callAI(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (!process.env.OPENROUTER_API_KEY) {
    return { text: getBuiltinResponse(message), source: 'builtin' };
  }

  try {
    return await callOpenRouterWithRetry(message, history);
  } catch (err: any) {
    console.error('[AI] All attempts failed:', err.message);
    return { text: getBuiltinResponse(message), source: 'builtin' };
  }
}

function getBuiltinResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm your AI tutor. I can help with DSA, DBMS, OS, Networks, and programming. What would you like to learn?";
  }
  if (lower.includes('thank')) return "You're welcome! Happy learning!";
  return `I'd be happy to help with "${query}". Try asking about specific CS topics like binary search, normalization, process scheduling, or TCP/IP!`;
}

// GET /api/ai/status
router.get('/status', authenticate, async (_req: AuthRequest, res: Response) => {
  return res.json({
    available: true,
    openrouter: !!process.env.OPENROUTER_API_KEY,
    mode: process.env.OPENROUTER_API_KEY ? 'api' : 'builtin',
    model: process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free',
  });
});

// POST /api/ai/ask
router.post('/ask', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ detail: 'Query required' });
    const result = await callAI(query);
    return res.json({ answer: result.text, source: result.source });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/chat
router.post('/chat', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ detail: 'Message required' });
    const result = await callAI(message, history);
    return res.json({ response: result.text, source: result.source });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/explain
router.post('/explain', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ detail: 'Topic required' });
    const result = await callAI(`Explain ${topic} in detail for a CS student.`);
    return res.json({ explanation: result.text, source: result.source });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/generate-quiz
router.post('/generate-quiz', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, count } = req.body;
    if (!topic) return res.status(400).json({ detail: 'Topic required' });
    const num = count || 5;
    const result = await callAI(
      `Generate ${num} MCQs about ${topic} for a CS student. Return ONLY JSON array: [{"question":"...","options":["A","B","C","D"],"correct":0}]`
    );
    let questions;
    try {
      const jsonMatch = result.text.match(/\[[\s\S]*\]/);
      questions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch { questions = []; }
    return res.json({ questions, source: result.source });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
