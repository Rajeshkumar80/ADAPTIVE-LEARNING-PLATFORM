import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { aiProviders } from '../config';

const router = Router();

const SYSTEM_PROMPT = 'You are AdaptLearn AI Tutor, a helpful assistant for VTU CSE students. You help with DSA, DBMS, OS, Networks, and Programming (Java, Python, C++, JavaScript). Rules: Be concise, use examples, format with bullet points, be encouraging. Keep responses under 300 words unless asked for detail.';

async function callGroqChat(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (!aiProviders.groq.available) throw new Error('Groq API key not configured');
  const messages: { role: string; content: string }[] = [];
  if (history && history.length > 0) {
    for (const msg of history.slice(-8)) {
      messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
    }
  }
  messages.push({ role: 'user', content: SYSTEM_PROMPT + '\n\n' + message });
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const resp = await fetch(aiProviders.groq.baseUrl + '/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + aiProviders.groq.apiKey },
        body: JSON.stringify({ model: aiProviders.groq.model, messages, max_tokens: 2048, temperature: 0.7, top_p: 0.9 }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.status === 429) { await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); continue; }
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        console.error('[AI] Groq ' + resp.status + ': ' + errText.slice(0, 200));
        if (attempt < 2) { await new Promise(r => setTimeout(r, 1500 * (attempt + 1))); continue; }
        break;
      }
      const data: any = await resp.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) return { text, source: 'groq' };
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('[AI] Groq attempt ' + (attempt + 1) + ' error:', err.message);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw new Error('Groq API failed after retries');
}

async function callChatAI(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (aiProviders.groq.available) {
    try { return await callGroqChat(message, history); }
    catch (err: any) { console.error('[AI] Groq failed, falling back:', err.message); }
  }
  return { text: getBuiltinResponse(message), source: 'builtin' };
}

function getBuiltinResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hello! I'm AdaptLearn AI Tutor. I help with DSA, DBMS, OS, Networks, and programming. What would you like to learn?";
  if (lower.includes('thank')) return "You're welcome! Happy learning!";
  if (lower.includes('binary search tree') || lower.includes('bst')) return "**Binary Search Tree (BST):**\n\nLeft subtree < Node < Right subtree. Inorder traversal = sorted.\n\nSearch/Insert/Delete avg: O(log n). Worst: O(n) when unbalanced.\n\nBalanced: AVL Tree, Red-Black Tree.";
  if (lower.includes('binary search')) return "**Binary Search:** O(log n) on sorted array. Compare with middle, go left or right.\n\n```python\ndef bs(arr, t):\n    lo, hi = 0, len(arr)-1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if arr[mid]==t: return mid\n        elif arr[mid]<t: lo=mid+1\n        else: hi=mid-1\n    return -1\n```";
  if (lower.includes('normalization')) return "**DB Normalization:** 1NF (atomic), 2NF (no partial), 3NF (no transitive), BCNF.";
  if (lower.includes('process schedul')) return "**Scheduling:** FCFS, SJF, Round Robin, Priority, MLFQ.";
  if (lower.includes('tcp') || lower.includes('udp')) return "**TCP:** reliable, ordered, 3-way handshake. **UDP:** fast, connectionless.";
  if (lower.includes('sorting')) return "**Sorting:** Merge O(n log n) stable, Quick O(n log n) avg, Heap O(n log n) in-place.";
  if (lower.includes('stack') || lower.includes('queue')) return "**Stack:** LIFO. **Queue:** FIFO.";
  if (lower.includes('linked list')) return "**Linked List:** Insert O(1) head, search O(n). vs Array: O(1) access.";
  if (lower.includes('hash')) return "**Hash Table:** O(1) avg insert/lookup. Collisions: chaining or probing.";
  if (lower.includes('graph') || lower.includes('bfs') || lower.includes('dfs')) return "**BFS:** level-order, Queue. **DFS:** deep-first, Stack.";
  if (lower.includes('dynamic programming') || lower.includes('dp')) return "**DP:** overlapping subproblems + optimal substructure. Memoize or tabulate.";
  if (lower.includes('oop')) return "**OOP:** Encapsulation, Abstraction, Inheritance, Polymorphism. SOLID principles.";
  if (lower.includes('java')) return "**Java:** OOP, Collections, Streams, Lambdas. JVM platform.";
  if (lower.includes('python')) return "**Python:** Dynamic typing, list comprehensions, decorators, generators.";
  if (lower.includes('c++') || lower.includes('cpp')) return "**C++:** RAII, smart pointers, templates, STL containers.";
  if (lower.includes('javascript') || lower.includes('js')) return "**JS:** ES6+, async/await, closures, prototypes.";
  if (lower.includes('dbms') || lower.includes('database')) return "**DBMS:** ACID, Joins, Indexing, Normalization.";
  if (lower.includes('os')) return "**OS:** Processes, threads, deadlocks, memory management, scheduling.";
  return "I can help with: binary search, sorting, BST, DBMS, TCP/UDP, OOP, Java, Python, C++, JavaScript, and more! Ask about a specific topic.";
}

router.get('/status', async (_req, res) => {
  let groqStatus: string = 'unavailable';
  let geminiStatus: string = 'unavailable';

  if (aiProviders.groq.available) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(aiProviders.groq.baseUrl + '/models', {
        headers: { 'Authorization': 'Bearer ' + aiProviders.groq.apiKey },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      groqStatus = resp.ok ? 'connected' : 'error_' + resp.status;
    } catch { groqStatus = 'unreachable'; }
  }

  if (aiProviders.gemini.available) {
    try {
      const url = aiProviders.gemini.baseUrl + '/' + aiProviders.gemini.model + ':generateContent?key=' + aiProviders.gemini.apiKey;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'ping' }] }], generationConfig: { maxOutputTokens: 1 } }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      geminiStatus = resp.ok ? 'connected' : 'error_' + resp.status;
    } catch { geminiStatus = 'unreachable'; }
  }

  return res.json({
    available: true,
    groq: { configured: aiProviders.groq.available, status: groqStatus, model: aiProviders.groq.model, uses: ['chat'] },
    gemini: { configured: aiProviders.gemini.available, status: geminiStatus, model: aiProviders.gemini.model, uses: ['roadmap'] },
  });
});

router.post('/ask', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ detail: 'Query required' });
    const result = await callChatAI(query);
    return res.json({ answer: result.text, source: result.source });
  } catch (err: any) { return res.status(500).json({ detail: err.message }); }
});

router.post('/chat', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ detail: 'Message required' });
    const result = await callChatAI(message, history);
    return res.json({ response: result.text, source: result.source });
  } catch (err: any) { return res.status(500).json({ detail: err.message }); }
});

router.post('/explain', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ detail: 'Topic required' });
    const result = await callChatAI('Explain ' + topic + ' in detail for a CS student.');
    return res.json({ explanation: result.text, source: result.source });
  } catch (err: any) { return res.status(500).json({ detail: err.message }); }
});

router.post('/generate-quiz', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, count } = req.body;
    if (!topic) return res.status(400).json({ detail: 'Topic required' });
    const num = count || 5;
    const result = await callChatAI('Generate ' + num + ' MCQs about ' + topic + ' for a CS student. Return ONLY JSON array: [{"question":"...","options":["A","B","C","D"],"correct":0}]');
    let questions;
    try { const jsonMatch = result.text.match(/\[[\s\S]*\]/); questions = jsonMatch ? JSON.parse(jsonMatch[0]) : []; }
    catch { questions = []; }
    return res.json({ questions, source: result.source });
  } catch (err: any) { return res.status(500).json({ detail: err.message }); }
});

export async function callGeminiRoadmap(prompt: string): Promise<{ text: string; source: string }> {
  if (!aiProviders.gemini.available) throw new Error('Gemini API key not configured');
  const url = aiProviders.gemini.baseUrl + '/' + aiProviders.gemini.model + ':generateContent?key=' + aiProviders.gemini.apiKey;
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 4096, temperature: 0.5 } }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.status === 429) { await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); continue; }
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        console.error('[AI] Gemini roadmap ' + resp.status + ': ' + errText.slice(0, 200));
        if (attempt < 2) { await new Promise(r => setTimeout(r, 1500 * (attempt + 1))); continue; }
        break;
      }
      const data: any = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return { text, source: 'gemini' };
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('[AI] Gemini roadmap attempt ' + (attempt + 1) + ' error:', err.message);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw new Error('Gemini API failed after retries');
}

export { callChatAI };
export default router;
