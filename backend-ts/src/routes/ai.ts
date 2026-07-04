import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const AI_RESPONSES: Record<string, string> = {
  'virtualization': 'Virtualization is the creation of virtual versions of computing resources like servers, storage, and networks. It allows multiple operating systems to run on a single physical machine through hypervisors (Type 1: bare-metal like VMware ESXi, Type 2: hosted like VirtualBox). Benefits include cost savings, better resource utilization, and easy scaling.',
  'cloud': 'Cloud computing delivers computing services (servers, storage, databases, networking, software) over the internet. Key models: IaaS (Infrastructure as a Service), PaaS (Platform as a Service), SaaS (Software as a Service). Deployment models include Public, Private, and Hybrid clouds.',
  'linear regression': 'Linear regression models the relationship between a dependent variable and one or more independent variables by fitting a linear equation. The model: y = mx + b, where m is the slope and b is the intercept. Cost function: Mean Squared Error (MSE). Optimization: Gradient Descent.',
  'neural network': 'A neural network is a computing system inspired by biological neural networks. It consists of layers of nodes (neurons): input layer, hidden layers, and output layer. Each connection has a weight that is adjusted during training via backpropagation.',
  'decision tree': 'A decision tree is a supervised learning algorithm that splits data into branches using feature values. It creates a tree-like model of decisions. Splitting criteria: Gini impurity or Information Gain (entropy). Advantages: interpretable, handles mixed data types.',
  'rsa': 'RSA (Rivest-Shamir-Adleman) is an asymmetric encryption algorithm. Key generation: choose two large primes p and q, compute n=p*q, find e and d such that e*d ≡ 1 (mod φ(n)). Encryption: c = m^e mod n. Decryption: m = c^d mod n. Security relies on difficulty of factoring large numbers.',
  'tcp': 'TCP (Transmission Control Protocol) is a reliable, connection-oriented protocol. Features: ordered delivery, error checking, flow control, congestion control. Uses 3-way handshake (SYN, SYN-ACK, ACK) for connection establishment.',
  'udp': 'UDP (User Datagram Protocol) is a connectionless, unreliable protocol. Features: no ordering guarantee, no retransmission, low overhead. Used for real-time applications like video streaming, gaming, and DNS.',
  'hash': 'A hash function maps arbitrary-size input to fixed-size output. Properties: deterministic, fast computation, pre-image resistant, collision resistant. Common algorithms: SHA-256, SHA-3, MD5 (deprecated). Used in: password storage, digital signatures, data integrity.',
  'sorting': 'Common sorting algorithms: Bubble Sort O(n²), Selection Sort O(n²), Insertion Sort O(n²), Merge Sort O(n log n), Quick Sort O(n log n) average, Heap Sort O(n log n). Stable sorts: Merge Sort, Insertion Sort. In-place: Quick Sort, Heap Sort.',
  'binary search': 'Binary search finds a target in a sorted array by repeatedly dividing the search interval in half. Compare target with middle element: if equal, found; if target < mid, search left half; if target > mid, search right half. Time complexity: O(log n).',
  'array': 'An array is a data structure storing elements in contiguous memory locations. Access: O(1) by index. Insertion/Deletion: O(n) in worst case. Types: static (fixed size) and dynamic (resizable). Multi-dimensional arrays store tabular data.',
  'tree': 'A tree is a hierarchical data structure with a root node and child nodes. Binary tree: each node has at most 2 children. BST: left child < parent < right child. Traversals: Inorder (LNR), Preorder (NLR), Postorder (LRN), Level-order (BFS).',
  'graph': 'A graph consists of vertices (nodes) and edges (connections). Types: directed/undirected, weighted/unweighted, cyclic/acyclic. Representations: adjacency matrix, adjacency list. Traversals: BFS (breadth-first), DFS (depth-first). Applications: social networks, routing.',
  'normalization': 'Database normalization organizes data to reduce redundancy. Forms: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies), BCNF (every determinant is a candidate key). Benefits: data integrity, reduced anomalies.',
  'encryption': 'Encryption converts plaintext to ciphertext. Symmetric: same key for encrypt/decrypt (AES, DES). Asymmetric: public/private key pair (RSA, ECC). Hybrid approach: use asymmetric to exchange symmetric key, then use symmetric for bulk data.',
  'testing': 'Software testing types: Unit (individual components), Integration (combined components), System (complete system), Acceptance (user validation). Methods: Black-box (specification-based), White-box (code-based). TDD: Test-Driven Development writes tests before code.',
  'scheduling': 'Process scheduling algorithms: FCFS (First Come First Served), SJF (Shortest Job First), Round Robin (time quantum), Priority Scheduling, Multilevel Queue. Metrics: throughput, turnaround time, waiting time, response time.',
  'memory': 'Memory management techniques: Paging (fixed-size blocks), Segmentation (variable-size blocks), Virtual Memory (disk as extension of RAM). Page replacement: FIFO, LRU (Least Recently Used), Optimal. Thrashing: excessive paging degrades performance.',
};

function findBestResponse(query: string): string {
  const lower = query.toLowerCase();
  for (const [keyword, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  return `Great question about "${query}". Here's what I can tell you:\n\nThis is a fundamental concept in computer science. I recommend reviewing your textbook chapters and practice problems. You can also ask me about specific subtopics for more detailed explanations.\n\nTip: Try the practice quizzes on this topic to test your understanding!`;
}

// GET /api/ai/status
router.get('/status', authenticate, async (_req: AuthRequest, res: Response) => {
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const openrouterKey = process.env.OPENROUTER_API_KEY || '';
  return res.json({
    available: true,
    gemini: !!geminiKey,
    openrouter: !!openrouterKey,
    mode: (geminiKey || openrouterKey) ? 'api' : 'builtin',
  });
});

// POST /api/ai/ask
router.post('/ask', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { query, context } = req.body;
    if (!query) return res.status(400).json({ detail: 'Query required' });

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      // TODO: Wire to Gemini/OpenRouter when key available
      return res.json({ answer: findBestResponse(query), source: 'builtin' });
    }

    return res.json({ answer: findBestResponse(query), source: 'builtin' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/chat
router.post('/chat', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ detail: 'Message required' });

    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      // TODO: Wire to Gemini/OpenRouter
      return res.json({ response: findBestResponse(message), source: 'builtin' });
    }

    return res.json({ response: findBestResponse(message), source: 'builtin' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/explain
router.post('/explain', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ detail: 'Topic required' });
    return res.json({ explanation: findBestResponse(topic), source: 'builtin' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/generate-quiz
router.post('/generate-quiz', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, count } = req.body;
    return res.json({ questions: [], message: 'Quiz generation requires AI API key', source: 'placeholder' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
