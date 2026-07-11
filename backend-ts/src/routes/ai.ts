import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + GEMINI_API_KEY;

const SYSTEM_PROMPT = 'You are AdaptLearn AI Tutor, a helpful assistant for VTU CSE students. You help with DSA, DBMS, OS, Networks, and Programming (Java, Python, C++, JavaScript). Rules: Be concise, use examples, format with bullet points, be encouraging. Keep responses under 300 words unless asked for detail.';

async function callGemini(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (!GEMINI_API_KEY) throw new Error('No Gemini API key');
  const contents: any[] = [];
  if (history && history.length > 0) {
    for (const msg of history.slice(-8)) {
      contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] });
    }
  }
  contents.push({ role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + message }] });
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout
    try {
      const resp = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 2048, temperature: 0.7, topP: 0.9 } }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.status === 429) { await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); continue; }
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        console.error('[AI] Gemini ' + resp.status + ': ' + errText.slice(0, 200));
        if (attempt < 2) { await new Promise(r => setTimeout(r, 1500 * (attempt + 1))); continue; }
        break;
      }
      const data: any = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return { text, source: 'gemini' };
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('[AI] Gemini attempt ' + (attempt + 1) + ' error:', err.message);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw new Error('Gemini API failed after retries');
}

async function callAI(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (!GEMINI_API_KEY) return { text: getBuiltinResponse(message), source: 'builtin' };
  try { return await callGemini(message, history); }
  catch (err: any) {
    console.error('[AI] Gemini failed, falling back to builtin:', err.message);
    return { text: getBuiltinResponse(message), source: 'builtin' };
  }
}

function getBuiltinResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hello! I am AdaptLearn AI Tutor. I help with DSA, DBMS, OS, Networks, and programming. What would you like to learn?";
  if (lower.includes('thank')) return "You are welcome! Happy learning!";
  if (lower.includes('binary search')) return "**Binary Search** finds an item in a sorted array by dividing the search interval in half each step.\n\n**Steps:**\n1. Compare target with middle element\n2. If target < middle, search left half\n3. If target > middle, search right half\n4. Repeat until found or empty\n\n**Time:** O(log n) | **Space:** O(1)";
  if (lower.includes('normalization') || lower.includes('dbms')) return "**Database Normalization** organizes data to reduce redundancy.\n\n- **1NF:** Atomic values, no repeating groups\n- **2NF:** 1NF + no partial dependencies\n- **3NF:** 2NF + no transitive dependencies\n- **BCNF:** Every determinant is a candidate key";
  if (lower.includes('process schedul')) return "**Process Scheduling** decides which process gets the CPU.\n\n- **FCFS:** First Come First Served\n- **SJF:** Shortest Job First\n- **Round Robin:** Time quantum preemption\n- **Priority:** Higher priority first\n- **MLFQ:** Adaptive combination";
  if (lower.includes('tcp') || lower.includes('udp')) return "**TCP vs UDP:**\n\n**TCP:** Connection-oriented, reliable, ordered. Use for web, email, file transfer.\n\n**UDP:** Connectionless, fast, no guarantee. Use for streaming, gaming, DNS.";
  return "I can help with " + query + ". Try asking about binary search, normalization, process scheduling, TCP/UDP, sorting algorithms, or data structures!";
}

router.get('/status', authenticate, async (_req: AuthRequest, res: Response) => {
  return res.json({ available: true, gemini: !!GEMINI_API_KEY, mode: GEMINI_API_KEY ? 'api' : 'builtin', model: GEMINI_MODEL });
});

router.post('/ask', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ detail: 'Query required' });
    const result = await callAI(query);
    return res.json({ answer: result.text, source: result.source });
  } catch (err: any) { return res.status(500).json({ detail: err.message }); }
});

router.post('/chat', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ detail: 'Message required' });
    const result = await callAI(message, history);
    return res.json({ response: result.text, source: result.source });
  } catch (err: any) { return res.status(500).json({ detail: err.message }); }
});

router.post('/explain', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ detail: 'Topic required' });
    const result = await callAI('Explain ' + topic + ' in detail for a CS student.');
    return res.json({ explanation: result.text, source: result.source });
  } catch (err: any) { return res.status(500).json({ detail: err.message }); }
});

router.post('/generate-quiz', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, count } = req.body;
    if (!topic) return res.status(400).json({ detail: 'Topic required' });
    const num = count || 5;
    const result = await callAI('Generate ' + num + ' MCQs about ' + topic + ' for a CS student. Return ONLY JSON array: [{"question":"...","options":["A","B","C","D"],"correct":0}]');
    let questions;
    try { const jsonMatch = result.text.match(/\[[\s\S]*\]/); questions = jsonMatch ? JSON.parse(jsonMatch[0]) : []; }
    catch { questions = []; }
    return res.json({ questions, source: result.source });
  } catch (err: any) { return res.status(500).json({ detail: err.message }); }
});

export default router;
