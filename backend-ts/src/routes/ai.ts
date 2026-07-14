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

async function callGeminiRoadmap(prompt: string): Promise<{ text: string; source: string }> {
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

async function callChatAI(message: string, history?: { role: string; content: string }[]): Promise<{ text: string; source: string }> {
  if (!aiProviders.groq.available) return { text: getBuiltinResponse(message), source: 'builtin' };
  try { return await callGroqChat(message, history); }
  catch (err: any) {
    console.error('[AI] Groq failed, falling back to builtin:', err.message);
    return { text: getBuiltinResponse(message), source: 'builtin' };
  }
}

function getBuiltinResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return "Hello! I'm AdaptLearn AI Tutor. I help with DSA, DBMS, OS, Networks, and programming (Java, Python, C++, JavaScript). What would you like to learn?";
  if (lower.includes('thank')) return "You're welcome! Happy learning!";
  if (lower.includes('binary search')) return "**Binary Search** finds an item in a sorted array by dividing the search interval in half each step.\n\n**Steps:**\n1. Compare target with middle element\n2. If target < middle, search left half\n3. If target > middle, search right half\n4. Repeat until found or empty\n\n**Time:** O(log n) | **Space:** O(1)\n\n**Code (Python):**\n```python\ndef binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return -1\n```\n\n**Key Point:** Array MUST be sorted first. If unsorted, use linear search O(n) or sort first O(n log n) + binary search O(log n).";
  if (lower.includes('normalization') || lower.includes('dbms') && lower.includes('normal')) return "**Database Normalization** organizes data to reduce redundancy and improve integrity.\n\n**1NF:** Atomic values, no repeating groups\n- Bad: \"Java, Python\" in one cell\n- Good: Separate rows for each\n\n**2NF:** 1NF + no partial dependencies\n- All non-key fields depend on the FULL primary key\n\n**3NF:** 2NF + no transitive dependencies\n- No non-key field depends on another non-key field\n\n**BCNF:** Every determinant is a candidate key\n\n**Example:**\nStudent(StudentID, Name, DeptID, DeptName) → violates 3NF\nStudent(StudentID, Name, DeptID) + Department(DeptID, DeptName) → BCNF\n\n**When to denormalize:** Read-heavy systems where JOIN performance matters more than storage.";
  if (lower.includes('process schedul')) return "**Process Scheduling** decides which process gets the CPU and for how long.\n\n**FCFS:** First Come First Served — simple, but convoy effect\n**SJF:** Shortest Job First — optimal avg waiting, but needs prediction\n**Round Robin:** Time quantum preemption — fair, but quantum too small = overhead\n**Priority:** Higher priority first — can starve low priority\n**MLFQ:** Multi-Level Feedback Queue — adaptive, used in real OS\n\n**Key Metrics:**\n- Turnaround Time = Completion - Arrival\n- Waiting Time = Turnaround - Burst\n- Response Time = First CPU - Arrival\n\n**Example:** P1(6ms), P2(8ms), P3(4ms), P4(2ms)\nSJF order: P4→P3→P1→P2 = avg wait (0+2+6+14)/4 = 5.5ms";
  if (lower.includes('tcp') || lower.includes('udp')) return "**TCP vs UDP:**\n\n**TCP (Transmission Control Protocol):**\n- Connection-oriented (3-way handshake)\n- Reliable, ordered delivery\n- Flow control + congestion control\n- Use: Web (HTTP), email, file transfer\n\n**UDP (User Datagram Protocol):**\n- Connectionless\n- Fast, no overhead\n- No guarantee of order/delivery\n- Use: Streaming, gaming, DNS, VoIP\n\n**TCP 3-Way Handshake:**\n1. Client → SYN\n2. Server → SYN-ACK\n3. Client → ACK\n\n**Port numbers:** HTTP=80, HTTPS=443, DNS=53, SSH=22";
  if (lower.includes('sorting') || lower.includes('sort algorithm')) return "**Sorting Algorithms Comparison:**\n\n| Algorithm | Best | Average | Worst | Space |\n|-----------|------|---------|-------|-------|\n| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |\n| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |\n\n**When to use:**\n- Small data → Insertion Sort\n- General purpose → Merge Sort or Quick Sort\n- Memory constrained → Heap Sort\n- Nearly sorted → Insertion Sort";
  if (lower.includes('binary search tree') || lower.includes('bst')) return "**Binary Search Tree (BST):**\n\n**Properties:**\n- Left subtree < Node < Right subtree\n- No duplicates\n- Inorder traversal = sorted order\n\n**Operations (avg):**\n- Search: O(log n)\n- Insert: O(log n)\n- Delete: O(log n)\n\n**Operations (worst):**\n- All O(n) — when tree becomes a linked list\n\n**Balanced BSTs:**\n- AVL Tree: Strict balance (height diff ≤ 1)\n- Red-Black Tree: Looser balance, fewer rotations\n- B-Tree: For disk I/O, nodes with many children\n\n**Deletion cases:**\n1. Leaf → just remove\n2. One child → replace with child\n3. Two children → replace with inorder successor";
  if (lower.includes('stack') || lower.includes('queue')) return "**Stack vs Queue:**\n\n**Stack (LIFO):** Last In, First Out\n- push(item), pop(), peek()\n- Use: Function calls, undo, expression evaluation\n- Example: Balanced brackets, DFS\n\n**Queue (FIFO):** First In, First Out\n- enqueue(item), dequeue(), peek()\n- Use: BFS, task scheduling, print queue\n- Variants: Priority Queue, Deque, Circular Queue\n\n**Implementation:**\n- Stack: Array (top pointer) or Linked List\n- Queue: Array (front/rear) or Linked List\n- Circular Queue: wraps around, efficient space use\n\n**Interview Q:** Implement stack using queues? Use 2 queues, push O(n) or pop O(n).";
  if (lower.includes('linked list') || lower.includes('linkedlist')) return "**Linked List:**\n\n**Singly Linked:** Data → Next → Data → Next → null\n**Doubly Linked:** Prev ← Data → Next\n**Circular:** Last → First (ring)\n\n**Operations:**\n- Insert at head: O(1)\n- Insert at tail: O(n) or O(1) with tail pointer\n- Delete by value: O(n)\n- Search: O(n)\n\n**vs Array:**\n| | Array | Linked List |\n|---|-------|-------------|\n| Access | O(1) | O(n) |\n| Insert | O(n) | O(1) at head |\n| Memory | Contiguous | Scattered + pointers |\n\n**Common problems:** Reverse list, detect cycle (Floyd's), merge two lists, find middle element.";
  if (lower.includes('hash') || lower.includes('hashmap') || lower.includes('hash table')) return "**Hash Table / Hash Map:**\n\n**How it works:**\nkey → hash function → index → bucket\n\n**Collision handling:**\n1. Chaining: Linked list at each bucket\n2. Open addressing: Linear/quadratic probing\n\n**Operations (avg):**\n- Insert: O(1)\n- Lookup: O(1)\n- Delete: O(1)\n\n**Worst case:** O(n) — all keys hash to same bucket\n\n**Load factor:** n/m (elements/buckets)\n- When > 0.75, resize (double + rehash)\n\n**Hash functions:** Division method: h(k) = k mod m\nMultiplication: h(k) = floor(m(kA mod 1))\n\n**Use cases:** Caching, counting frequency, two-sum, deduplication.";
  if (lower.includes('graph') || lower.includes('bfs') || lower.includes('dfs')) return "**Graph Traversal:**\n\n**BFS (Breadth-First):** Level by level\n- Use: Shortest path (unweighted), level order\n- Data structure: Queue\n- Time: O(V + E)\n\n**DFS (Depth-First):** Go deep, backtrack\n- Use: Cycle detection, topological sort, connected components\n- Data structure: Stack (or recursion)\n- Time: O(V + E)\n\n**Dijkstra:** Shortest path (weighted, no negative edges)\n- Use: GPS navigation, network routing\n- Time: O((V+E) log V) with min-heap\n\n**Representations:**\n- Adjacency Matrix: O(1) edge lookup, O(V²) space\n- Adjacency List: O(degree) lookup, O(V+E) space\n\n**Key:** Adjacency list preferred for sparse graphs.";
  if (lower.includes('what is') && (lower.includes('dsa') || lower.includes('data structure'))) return "**Data Structures and Algorithms (DSA)**\n\n**Core Data Structures:**\n- Arrays, Strings\n- Linked Lists\n- Stacks, Queues\n- Hash Tables\n- Trees (BST, AVL, Heap)\n- Graphs\n\n**Core Algorithms:**\n- Sorting: Merge, Quick, Heap\n- Searching: Binary Search\n- Graph: BFS, DFS, Dijkstra\n- Dynamic Programming\n- Greedy Algorithms\n\n**Why DSA matters:**\n- Interview preparation\n- Write efficient code\n- Problem-solving skills\n- System design foundation\n\n**Start with:** Arrays → Strings → Hash Maps → Trees → Graphs → DP";
  if (lower.includes('dbms') || lower.includes('database')) return "**DBMS Quick Reference:**\n\n**ACID Properties:**\n- Atomicity: All or nothing\n- Consistency: Valid state transitions\n- Isolation: Concurrent txns don't interfere\n- Durability: Committed data persists\n\n**Keys:** Primary, Foreign, Candidate, Super, Composite\n\n**Joins:**\n- INNER: Matching rows only\n- LEFT: All from left + matching from right\n- RIGHT: All from right + matching from left\n- FULL: All from both\n\n**Indexing:** B-Tree (range queries), Hash Index (point lookups)\n\n**Transactions:** BEGIN → COMMIT / ROLLBACK\n\n**Normalization:** 1NF → 2NF → 3NF → BCNF";
  if (lower.includes('os') || lower.includes('operating system')) return "**Operating Systems:**\n\n**Process vs Thread:**\n- Process: Independent, own memory space\n- Thread: Shared memory, lightweight\n\n**Deadlock (4 conditions):**\n1. Mutual exclusion\n2. Hold and wait\n3. No preemption\n4. Circular wait\n\n**Memory Management:**\n- Paging: Fixed-size blocks\n- Segmentation: Variable-size logical units\n- Virtual Memory: Swap pages to disk\n\n**Scheduling:**\n- FCFS, SJF, Round Robin, Priority, MLFQ\n\n**Disk Scheduling:**\n- FCFS, SSTF, SCAN, C-SCAN\n\n**System Calls:** fork(), exec(), wait(), open(), read(), write()";
  if (lower.includes('object oriented') || lower.includes('oop') || lower.includes('inheritance') || lower.includes('polymorphism')) return "**OOP Concepts:**\n\n**4 Pillars:**\n1. **Encapsulation:** Data + methods together, hide internals\n2. **Abstraction:** Expose only what's needed\n3. **Inheritance:** IS-A relationship, code reuse\n4. **Polymorphism:** Same interface, different behavior\n\n**Polymorphism types:**\n- Compile-time: Method overloading\n- Runtime: Method overriding (virtual functions)\n\n**SOLID Principles:**\n- S: Single Responsibility\n- O: Open/Closed\n- L: Liskov Substitution\n- I: Interface Segregation\n- D: Dependency Inversion\n\n**Example (Java):**\n```java\nclass Animal { void speak() { } }\nclass Dog extends Animal { void speak() { System.out.println(\"Woof\"); } }\nAnimal a = new Dog(); a.speak(); // Woof (runtime polymorphism)\n```";
  if (lower.includes('dynamic programming') || lower.includes('dp')) return "**Dynamic Programming:**\n\n**When to use:**\n1. Overlapping subproblems\n2. Optimal substructure\n\n**Top-down (Memoization):** Recursion + cache\n**Bottom-up (Tabulation):** Fill table iteratively\n\n**Classic problems:**\n- Fibonacci: O(n) with DP vs O(2^n) brute\n- Knapsack: 0/1 and unbounded\n- LIS: Longest Increasing Subsequence\n- LCS: Longest Common Subsequence\n- Coin Change\n- Matrix Chain Multiplication\n\n**Steps:**\n1. Define state: dp[i] = what?\n2. Recurrence relation\n3. Base case\n4. Compute order (usually left to right)\n\n**Example — Climbing Stairs:**\ndp[i] = dp[i-1] + dp[i-2], dp[1]=1, dp[2]=2";
  if (lower.includes('java')) return "**Java Quick Reference:**\n\n**Basics:** `public static void main(String[] args)`\n**OOP:** class, interface, extends, implements\n**Collections:** ArrayList, HashMap, HashSet, LinkedList\n**Generics:** `List<String>`\n**Streams:** `.filter().map().collect()`\n**Exception:** try-catch-finally, checked vs unchecked\n**Threading:** Thread class, Runnable interface, synchronized\n\n**Key differences from C++:**\n- No pointers, no multiple inheritance\n- Garbage collected\n- Everything is an object (except primitives)\n- `String` is immutable\n\n**Java 8+:**\n- Lambdas: `(x) -> x * 2`\n- Optional, Stream API\n- Records (Java 14): `record Point(int x, int y) {}`";
  if (lower.includes('python')) return "**Python Quick Reference:**\n\n**Basics:** Dynamic typing, indentation matters\n**Data Structures:** list, dict, set, tuple\n**List comprehension:** `[x**2 for x in range(10) if x % 2 == 0]`\n**Lambda:** `lambda x: x * 2`\n**Decorators:** `@decorator`\n\n**Key features:**\n- Everything is an object\n- Slicing: `arr[1:5]`, `arr[::-1]`\n- f-strings: `f\"Hello {name}\"`\n- `zip()`, `enumerate()`, `map()`, `filter()`\n\n**OOP:**\n- `self` parameter\n- `__init__` constructor\n- No access modifiers (convention: _private)\n\n**Libraries:** collections, itertools, functools, math\n**Interview:** Know list/dict operations, string manipulation, recursion";
  if (lower.includes('c++') || lower.includes('cpp')) return "**C++ Quick Reference:**\n\n**Basics:** Compiled, static typing, manual memory management\n**Pointers:** `int* p = &x;`, `*p = dereference`, `->` arrow operator\n**References:** `int& r = x;` — alias, must init\n\n**STL:**\n- Containers: vector, map, set, unordered_map\n- Algorithms: sort, find, lower_bound\n- Iterators: begin(), end()\n\n**Key features:**\n- RAII: Resource Acquisition Is Initialization\n- Move semantics (C++11): `std::move()`\n- Smart pointers: unique_ptr, shared_ptr\n- Templates: generic programming\n\n**Modern C++:** auto, range-for, lambda, nullptr\n\n**Memory:** `new`/`delete` or smart pointers (preferred)";
  if (lower.includes('javascript') || lower.includes('js')) return "**JavaScript Quick Reference:**\n\n**Basics:** var/let/const, function, arrow functions\n**ES6+:** destructuring, spread, template literals\n**Arrays:** map, filter, reduce, forEach, find\n**Objects:** `{ key: value }`, destructuring\n\n**Async:**\n- Promises: `.then().catch()`\n- Async/Await: `async function` + `await`\n- Event loop: microtasks > macrotasks\n\n**DOM:** document.querySelector, addEventListener\n**Node.js:** require/import, fs, http, express\n\n**Key concepts:**\n- Hoisting, closures, prototypes\n- this keyword (context-dependent)\n- NaN !== NaN\n- typeof null === 'object' (bug)\n\n**Frameworks:** React, Vue, Angular, Next.js";
  if (lower.includes('network') && !lower.includes('tcp') && !lower.includes('udp')) return "**Computer Networks:**\n\n**OSI Model (7 layers):**\n7. Application: HTTP, FTP, DNS\n6. Presentation: Encryption, compression\n5. Session: Connections, sync\n4. Transport: TCP, UDP\n3. Network: IP, routing\n2. Data Link: MAC, frames\n1. Physical: Cables, signals\n\n**TCP/IP Model:** Application, Transport, Internet, Network Access\n\n**IP Addressing:**\n- IPv4: 32-bit, dotted decimal (192.168.1.1)\n- IPv6: 128-bit\n- Subnet mask: /24 = 255.255.255.0\n\n**Key protocols:**\n- DNS: Domain → IP\n- DHCP: Auto IP assignment\n- ARP: IP → MAC\n- ICMP: Ping, traceroute";
  if (lower.includes('cloud') || lower.includes('aws') || lower.includes('cloud computing')) return "**Cloud Computing:**\n\n**Service Models:**\n- IaaS: Virtual machines (AWS EC2)\n- PaaS: Platform (Heroku, AWS Lambda)\n- SaaS: Software (Gmail, Netflix)\n\n**Deployment Models:**\n- Public Cloud: Shared infrastructure\n- Private Cloud: Dedicated\n- Hybrid: Mix of both\n\n**Key AWS Services:**\n- Compute: EC2, Lambda, ECS\n- Storage: S3, EBS, EFS\n- Database: RDS, DynamoDB, ElastiCache\n- Network: VPC, CloudFront, Route 53\n\n**Docker:** Containerization\n- Dockerfile → Image → Container\n- docker build, docker run\n\n**Kubernetes:** Container orchestration\n- Pod, Service, Deployment, Ingress";
  if (lower.includes('machine learning') || lower.includes('ml') || lower.includes('ai')) return "**Machine Learning:**\n\n**Types:**\n- Supervised: Labeled data (classification, regression)\n- Unsupervised: No labels (clustering, dimensionality reduction)\n- Reinforcement: Reward-based learning\n\n**Algorithms:**\n- Linear Regression, Logistic Regression\n- Decision Trees, Random Forest\n- SVM, KNN\n- Neural Networks, CNN, RNN, Transformer\n\n**Key concepts:**\n- Overfitting vs Underfitting\n- Train/Validation/Test split\n- Cross-validation\n- Regularization (L1, L2)\n\n**Python libraries:** scikit-learn, TensorFlow, PyTorch\n\n**Steps:** Data prep → Feature engineering → Model train → Evaluate → Deploy";
  return "I can help with: binary search, sorting, BST, linked lists, stacks, queues, hash maps, graphs, BFS/DFS, dynamic programming, DBMS normalization, joins, TCP/UDP, process scheduling, OOP, Java, Python, C++, JavaScript, cloud computing, machine learning, and more!\n\nTry asking about a specific topic and I'll explain it in detail.";
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
    groq: {
      configured: aiProviders.groq.available,
      status: groqStatus,
      model: aiProviders.groq.model,
    },
    gemini: {
      configured: aiProviders.gemini.available,
      status: geminiStatus,
      model: aiProviders.gemini.model,
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

export { callGeminiRoadmap };
export default router;
