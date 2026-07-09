import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });

import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const SYSTEM_PROMPT = `You are AdaptLearn AI Tutor, a helpful assistant for VTU CSE students. 
You help with DSA, DBMS, OS, Networks, and Programming (Java, Python, C++, JavaScript).
Rules: Be concise, use examples, format with bullet points, be encouraging.`;

async function callGLMWithRetry(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  const apiKey = process.env.GLM_API_KEY;
  if (!apiKey) throw new Error('No GLM API key');

  const messages: any[] = [{ role: 'system', content: SYSTEM_PROMPT }];
  if (history && history.length > 0) {
    for (const msg of history.slice(-10)) {
      messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
    }
  }
  messages.push({ role: 'user', content: message });

  const model = process.env.GLM_MODEL || 'glm-5.2';
  const baseURL = process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch(`${baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, messages, max_tokens: 2048, temperature: 0.7 }),
      });

      if (resp.status === 429) {
        console.log(`[AI] Rate limited on GLM, attempt ${attempt + 1}`);
        await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
        continue;
      }

      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        console.log(`[AI] GLM returned ${resp.status}: ${errText.slice(0, 200)}`);
        if (attempt < 2) { await new Promise(r => setTimeout(r, 1500 * (attempt + 1))); continue; }
        break;
      }

      const data: any = await resp.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) return { text, source: 'glm' };
    } catch (err: any) {
      console.error(`[AI] GLM attempt ${attempt + 1} error:`, err.message);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }

  throw new Error('GLM API failed after retries');
}

async function callAI(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (!process.env.GLM_API_KEY) {
    return { text: getBuiltinResponse(message), source: 'builtin' };
  }

  try {
    return await callGLMWithRetry(message, history);
  } catch (err: any) {
    console.error('[AI] GLM failed, falling back to builtin:', err.message);
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
    glm: !!process.env.GLM_API_KEY,
    mode: process.env.GLM_API_KEY ? 'api' : 'builtin',
    model: process.env.GLM_MODEL || 'glm-5.2',
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
