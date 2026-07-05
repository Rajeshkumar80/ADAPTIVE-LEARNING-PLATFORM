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
  'linked list': 'A linked list is a linear data structure where elements are stored in nodes. Each node contains data and a pointer to the next node. Types: singly linked, doubly linked, circular. Operations: insertion, deletion, traversal. Time: O(n) for search, O(1) for insert/delete at head.',
  'stack': 'A stack is a LIFO (Last In First Out) data structure. Operations: push (add to top), pop (remove from top), peek (view top), isEmpty. Applications: function call management, expression evaluation, undo operations, bracket matching. Implementation: array or linked list.',
  'queue': 'A queue is a FIFO (First In First Out) data structure. Operations: enqueue (add to rear), dequeue (remove from front), peek (view front). Types: simple queue, circular queue, priority queue, deque. Applications: BFS, task scheduling, print spooling.',
  'os': 'Operating System manages hardware and software resources. Key functions: process management, memory management, file system management, I/O management, security. Types: batch, time-sharing, real-time, distributed. Concepts: deadlock, thrashing, context switching.',
  'database': 'A database is an organized collection of data. Relational databases use SQL (Structured Query Language). Key concepts: tables, rows, columns, primary keys, foreign keys, indexes. ACID properties: Atomicity, Consistency, Isolation, Durability.',
  'sql': 'SQL (Structured Query Language) is used to manage relational databases. Commands: DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE), TCL (COMMIT, ROLLBACK). Joins: INNER, LEFT, RIGHT, FULL, CROSS.',
  'java': 'Java is an object-oriented, platform-independent language. Key features: Write Once Run Anywhere (WORA), garbage collection, strong typing. Concepts: classes, objects, inheritance, polymorphism, encapsulation, abstraction. JDK, JRE, JVM.',
  'python': 'Python is a high-level, interpreted language known for simplicity. Features: dynamic typing, extensive libraries, readability. Used in: web development, data science, AI/ML, automation, scripting. Libraries: NumPy, Pandas, Django, Flask, TensorFlow.',
  'javascript': 'JavaScript is a high-level, dynamic language for web development. Features: event-driven, functional, prototype-based. Runs in browser and server (Node.js). ES6+ features: arrow functions, promises, async/await, destructuring, modules.',
  'c++': 'C++ is a high-performance language combining procedural and object-oriented paradigms. Features: manual memory management, templates, RAII, STL (Standard Template Library). Used in: system programming, game development, competitive programming.',
  'algorithm': 'An algorithm is a step-by-step procedure for solving a problem. Key properties: finite, definite, effective. Analysis: time complexity (Big O), space complexity. Common paradigms: divide and conquer, dynamic programming, greedy, backtracking.',
  'recursion': 'Recursion is when a function calls itself to solve a problem. Components: base case (termination condition) and recursive case. Examples: factorial, Fibonacci, tree traversal, divide and conquer algorithms. Can be converted to iteration using stack.',
  'string': 'A string is a sequence of characters. Operations: concatenation, substring, search, replace, reverse. Algorithms: KMP (pattern matching), Rabin-Karp, Boyer-Moore. Strings can be mutable (C) or immutable (Java, Python).',
  'pointer': 'A pointer is a variable that stores the memory address of another variable. Used for: dynamic memory allocation, passing data by reference, data structures (linked lists, trees). Dangerous if misused: dangling pointers, memory leaks, null pointer dereference.',
  'inheritance': 'Inheritance is an OOP concept where a class derives properties from a parent class. Types: single, multiple, multilevel, hierarchical, hybrid. Benefits: code reuse, polymorphism, hierarchical classification. Keyword: extends (Java), class Derived: public Base (C++).',
  'polymorphism': 'Polymorphism allows objects of different types to be treated as objects of a common parent type. Types: compile-time (overloading), runtime (overriding). Benefits: flexibility, extensibility, interface reusability. Key mechanism: virtual functions in C++.',
  'abstraction': 'Abstraction hides implementation details and shows only functionality. Achieved through: abstract classes (can have both abstract and concrete methods) and interfaces (only abstract methods). Benefits: reduced complexity, increased reusability.',
  'encapsulation': 'Encapsulation bundles data and methods that operate on that data, restricting direct access. Achieved through: access modifiers (private, protected, public), getters/setters. Benefits: data hiding, modularity, flexibility.',
  'exception handling': 'Exception handling manages runtime errors gracefully. Components: try (risky code), catch (handle exception), finally (cleanup), throw (raise exception), throws (declare exception). Benefits: program flow control, separation of error handling code.',
  'file system': 'A file system organizes and stores files on storage devices. Types: FAT, NTFS, ext4, HFS+. Operations: create, read, write, delete, rename. Concepts: directories, paths, permissions, inodes, journaling.',
  'network': 'Computer networking connects devices to share resources. Models: OSI (7 layers), TCP/IP (4 layers). Protocols: HTTP, FTP, SMTP, DNS, DHCP. Topologies: bus, star, ring, mesh. Types: LAN, WAN, MAN, PAN.',
  'security': 'Computer security protects systems and data from unauthorized access. Principles: CIA (Confidentiality, Integrity, Availability). Methods: encryption, authentication, authorization, firewalls, intrusion detection. Threats: malware, phishing, DDoS.',
  'compiler': 'A compiler translates source code to machine code in one pass. Phases: lexical analysis, syntax analysis, semantic analysis, intermediate code generation, optimization, code generation. Interpreter executes code line by line.',
  'debugging': 'Debugging is finding and fixing bugs in code. Techniques: print debugging, breakpoints, step-through, logging, assertions. Tools: IDE debuggers, gdb (C/C++), browser developer tools. Best practices: reproduce the bug, isolate the problem.',
};

function findBestResponse(query: string): string {
  const lower = query.toLowerCase();
  
  // Direct match
  for (const [keyword, response] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  
  // Check for common question patterns
  if (lower.includes('what is') || lower.includes('what are') || lower.includes('define')) {
    return `That's a great question! Let me explain:\n\nBased on your query, I can tell you that this is an important concept in computer science. I recommend:\n\n1. Reviewing your textbook chapters on this topic\n2. Practicing related problems\n3. Using the quiz feature to test your understanding\n\nWould you like me to explain a specific aspect of this topic?`;
  }
  
  if (lower.includes('how') || lower.includes('explain') || lower.includes('describe')) {
    return `Great question! Let me break this down for you:\n\nThis concept is fundamental to understanding computer science. The key points to remember are:\n\n1. Understand the core principles\n2. Practice with examples\n3. Apply it in real-world scenarios\n\nTry asking about specific subtopics for more detailed explanations!`;
  }
  
  if (lower.includes('difference') || lower.includes('compare') || lower.includes('vs')) {
    return `Good comparison question! When comparing concepts, consider:\n\n1. Core purpose and use cases\n2. Advantages and disadvantages\n3. Performance characteristics\n4. Real-world applications\n\nAsk me about specific aspects to get detailed comparisons!`;
  }
  
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! I'm your AI tutor. I can help you with:\n\n• Data Structures & Algorithms\n• Database Management Systems\n• Operating Systems\n• Computer Networks\n• Programming (Java, Python, C++, JavaScript)\n\nWhat would you like to learn about today?";
  }
  
  if (lower.includes('thank') || lower.includes('thanks')) {
    return "You're welcome! Feel free to ask if you have more questions. Happy learning! 📚";
  }
  
  if (lower.includes('help') || lower.includes('can you')) {
    return "I can help you with:\n\n• Explaining concepts (DSA, DBMS, OS, Networks)\n• Comparing different approaches\n• Providing examples and practice tips\n• Breaking down complex topics\n\nJust ask your question and I'll do my best to help!";
  }
  
  return `I'd be happy to help with that! Here's what I suggest:\n\nThis is an interesting topic. For the best explanation, try asking me about:\n\n• The specific concept or definition\n• How it works step by step\n• Examples and use cases\n• How it compares to similar concepts\n\nWhat specific aspect would you like me to explain?`;
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
