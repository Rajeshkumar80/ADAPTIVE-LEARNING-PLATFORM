import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { aiProviders } from '../config';

const router = Router();

const SYSTEM_PROMPT = 'You are AdaptLearn AI Tutor, a helpful assistant for VTU CSE students. You help with DSA, DBMS, OS, Networks, and Programming (Java, Python, C++, JavaScript). Rules: Be concise, use examples, format with bullet points, be encouraging. Keep responses under 300 words unless asked for detail.';

async function callGeminiChat(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (!aiProviders.gemini.available) throw new Error('Gemini API key not configured');
  const url = aiProviders.gemini.baseUrl + '/' + aiProviders.gemini.model + ':generateContent?key=' + aiProviders.gemini.apiKey;

  const contents: { role: string; parts: { text: string }[] }[] = [];
  if (history && history.length > 0) {
    for (const msg of history.slice(-8)) {
      contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content }] });
    }
  }
  contents.push({ role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + message }] });

  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 2048, temperature: 0.7 } }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (resp.status === 429) { await new Promise(r => setTimeout(r, 2000 * (attempt + 1))); continue; }
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        console.error('[AI] Gemini chat ' + resp.status + ': ' + errText.slice(0, 200));
        if (attempt < 2) { await new Promise(r => setTimeout(r, 1500 * (attempt + 1))); continue; }
        break;
      }
      const data: any = await resp.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return { text, source: 'gemini' };
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('[AI] Gemini chat attempt ' + (attempt + 1) + ' error:', err.message);
      if (attempt < 2) await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
  throw new Error('Gemini API failed after retries');
}

async function callChatAI(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (!aiProviders.gemini.available) return { text: getBuiltinResponse(message), source: 'builtin' };
  try { return await callGeminiChat(message, history); }
  catch (err: any) {
    console.error('[AI] Gemini failed, falling back to builtin:', err.message);
    return { text: getBuiltinResponse(message), source: 'builtin' };
  }
}

function getBuiltinResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hello! I'm AdaptLearn AI Tutor. I help with DSA, DBMS, OS, Networks, and programming (Java, Python, C++, JavaScript). What would you like to learn?";
  if (lower.includes('thank')) return "You're welcome! Happy learning!";
  if (lower.includes('binary search tree') || lower.includes('bst')) return "**Binary Search Tree (BST):**\n\n**Properties:**\n- Left subtree < Node < Right subtree\n- No duplicates\n- Inorder traversal = sorted order\n\n**Operations (avg):**\n- Search: O(log n)\n- Insert: O(log n)\n- Delete: O(log n)\n\n**Operations (worst):**\n- All O(n) — when tree becomes a linked list\n\n**Balanced BSTs:**\n- AVL Tree: Strict balance (height diff ≤ 1)\n- Red-Black Tree: Looser balance, fewer rotations\n- B-Tree: For disk I/O, nodes with many children\n\n**Deletion cases:**\n1. Leaf → just remove\n2. One child → replace with child\n3. Two children → replace with inorder successor";
  if (lower.includes('binary search')) return "**Binary Search** finds an item in a sorted array by dividing the search interval in half each step.\n\n**Steps:**\n1. Compare target with middle element\n2. If target < middle, search left half\n3. If target > middle, search right half\n4. Repeat until found or empty\n\n**Time:** O(log n) | **Space:** O(1)\n\n**Code (Python):**\n```python\ndef binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1\n```";
  if (lower.includes('normalization') || (lower.includes('dbms') && lower.includes('normal'))) return "**Database Normalization** organizes data to reduce redundancy and improve integrity.\n\n**1NF:** Atomic values, no repeating groups\n**2NF:** 1NF + no partial dependencies\n**3NF:** 2NF + no transitive dependencies\n**BCNF:** Every determinant is a candidate key\n\n**Example:**\nStudent(StudentID, Name, DeptID, DeptName) → violates 3NF\nStudent(StudentID, Name, DeptID) + Department(DeptID, DeptName) → BCNF";
  if (lower.includes('process schedul')) return "**Process Scheduling** decides which process gets the CPU and for how long.\n\n**FCFS:** First Come First Served — simple, but convoy effect\n**SJF:** Shortest Job First — optimal avg waiting, but needs prediction\n**Round Robin:** Time quantum preemption — fair, but quantum too small = overhead\n**Priority:** Higher priority first — can starve low priority\n**MLFQ:** Multi-Level Feedback Queue — adaptive, used in real OS";
  if (lower.includes('tcp') || lower.includes('udp')) return "**TCP vs UDP:**\n\n**TCP:** Connection-oriented (3-way handshake), reliable, ordered. Use: web, email, file transfer.\n\n**UDP:** Connectionless, fast, no overhead. Use: streaming, gaming, DNS, VoIP.\n\n**TCP 3-Way Handshake:**\n1. Client → SYN\n2. Server → SYN-ACK\n3. Client → ACK";
  if (lower.includes('sorting') || lower.includes('sort algorithm')) return "**Sorting Algorithms:**\n\n| Algorithm | Best | Avg | Worst | Space |\n|-----------|------|-----|-------|-------|\n| Bubble | O(n) | O(n²) | O(n²) | O(1) |\n| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) |\n| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) |\n| Insertion | O(n) | O(n²) | O(n²) | O(1) |";
  if (lower.includes('stack') || lower.includes('queue')) return "**Stack (LIFO):** push, pop, peek. Use: function calls, undo, DFS.\n\n**Queue (FIFO):** enqueue, dequeue, peek. Use: BFS, task scheduling.\n\n**Variants:** Priority Queue, Deque, Circular Queue.";
  if (lower.includes('linked list') || lower.includes('linkedlist')) return "**Linked List:**\n\n**Singly:** Data → Next → null\n**Doubly:** Prev ← Data → Next\n**Circular:** Last → First\n\n**Operations:** Insert head O(1), delete O(n), search O(n).\n\n**vs Array:** Array O(1) access, Linked List O(1) insert at head.";
  if (lower.includes('hash') || lower.includes('hashmap') || lower.includes('hash table')) return "**Hash Table:**\n\nkey → hash function → index → bucket\n\n**Avg:** Insert O(1), Lookup O(1), Delete O(1)\n**Worst:** O(n) — all keys collide\n\n**Collisions:** Chaining (linked list) or Open Addressing (probing).\n\n**Resize:** When load factor > 0.75, double + rehash.";
  if (lower.includes('graph') || lower.includes('bfs') || lower.includes('dfs')) return "**BFS:** Level by level (Queue). Shortest path unweighted. O(V+E).\n\n**DFS:** Deep then backtrack (Stack/recursion). Cycle detection, topological sort. O(V+E).\n\n**Dijkstra:** Shortest path weighted, no negative edges. O((V+E) log V).";
  if (lower.includes('dynamic programming') || lower.includes('dp')) return "**DP:** Overlapping subproblems + optimal substructure.\n\n**Top-down:** Recursion + memoization\n**Bottom-up:** Tabulation\n\n**Classic:** Fibonacci, Knapsack, LIS, LCS, Coin Change.\n\n**Steps:** Define state → recurrence → base case → compute order.";
  if (lower.includes('object oriented') || lower.includes('oop')) return "**OOP 4 Pillars:**\n1. Encapsulation: Data + methods, hide internals\n2. Abstraction: Expose only needed\n3. Inheritance: IS-A, code reuse\n4. Polymorphism: Same interface, different behavior\n\n**SOLID:** Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.";
  if (lower.includes('java')) return "**Java:** static typing, garbage collected, no pointers.\n\n**OOP:** class, interface, extends, implements\n**Collections:** ArrayList, HashMap, HashSet\n**Streams:** .filter().map().collect()\n**8+:** Lambdas, Optional, Records";
  if (lower.includes('python')) return "**Python:** Dynamic typing, indentation matters.\n\n**Structures:** list, dict, set, tuple\n**Comprehension:** [x**2 for x in range(10)]\n**Lambda:** lambda x: x * 2\n**Libraries:** collections, itertools, functools";
  if (lower.includes('c++') || lower.includes('cpp')) return "**C++:** Compiled, static typing, manual memory.\n\n**STL:** vector, map, set, unordered_map\n**Features:** RAII, move semantics, smart pointers, templates\n**Modern:** auto, range-for, lambda, nullptr";
  if (lower.includes('javascript') || lower.includes('js')) return "**JavaScript:** Dynamic, prototype-based.\n\n**ES6+:** let/const, arrow functions, destructuring, spread\n**Async:** Promises, async/await\n**DOM:** querySelector, addEventListener\n**Node.js:** Express, fs, http";
  if (lower.includes('network') && !lower.includes('tcp') && !lower.includes('udp')) return "**OSI Model:** Physical, Data Link, Network, Transport, Session, Presentation, Application.\n\n**TCP/IP:** Application, Transport, Internet, Network Access.\n\n**Protocols:** DNS (domain→IP), DHCP (auto IP), ARP (IP→MAC), ICMP (ping).";
  if (lower.includes('cloud') || lower.includes('aws')) return "**Cloud:** IaaS (EC2), PaaS (Lambda), SaaS (Gmail).\n\n**Docker:** Dockerfile → Image → Container\n**K8s:** Pod, Service, Deployment, Ingress\n\n**AWS:** EC2, S3, RDS, Lambda, VPC, CloudFront.";
  if (lower.includes('machine learning') || lower.includes('ml')) return "**ML Types:** Supervised (labeled), Unsupervised (no labels), Reinforcement (reward).\n\n**Algorithms:** Linear/Logistic Regression, Decision Trees, SVM, KNN, Neural Networks.\n\n**Concepts:** Overfitting, Cross-validation, Regularization.";
  if (lower.includes('dbms') || lower.includes('database')) return "**DBMS:**\n\n**ACID:** Atomicity, Consistency, Isolation, Durability\n\n**Joins:** INNER, LEFT, RIGHT, FULL\n\n**Indexing:** B-Tree (range), Hash (point lookup)\n\n**Normalization:** 1NF → 2NF → 3NF → BCNF";
  if (lower.includes('os') || lower.includes('operating system')) return "**OS:** Process vs Thread, Deadlock (4 conditions), Paging, Virtual Memory.\n\n**Scheduling:** FCFS, SJF, Round Robin, Priority, MLFQ\n**Disk:** FCFS, SSTF, SCAN, C-SCAN";
  return "I can help with: binary search, sorting, BST, linked lists, stacks, queues, hash maps, graphs, BFS/DFS, dynamic programming, DBMS normalization, joins, TCP/UDP, process scheduling, OOP, Java, Python, C++, JavaScript, cloud computing, machine learning, and more!\n\nTry asking about a specific topic and I'll explain it in detail.";
}

router.get('/status', async (_req, res) => {
  let geminiStatus: string = 'unavailable';

  if (aiProviders.gemini.available) {
    try {
      const url = aiProviders.gemini.baseUrl + '/models?key=' + aiProviders.gemini.apiKey;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      geminiStatus = resp.ok ? 'connected' : 'error_' + resp.status;
    } catch { geminiStatus = 'unreachable'; }
  }

  return res.json({
    available: true,
    gemini: {
      configured: aiProviders.gemini.available,
      status: geminiStatus,
      model: aiProviders.gemini.model,
      uses: ['chat', 'roadmap'],
    },
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

export default router;
