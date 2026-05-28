"""
VTU CSE 22 Scheme — Module-wise topics for each subject.
Each subject has 5 modules with specific topics.
Data sourced from VTU syllabus documents and VTU Circle.
"""

VTU_SUBJECT_MODULES = {
    # ── 3rd Semester ──────────────────────────────────────────────────────
    "BCS303": {
        "name": "Operating Systems",
        "modules": {
            1: {"title": "Introduction to OS", "topics": [
                "Operating System Concepts & Functions",
                "Types of Operating Systems",
                "System Calls and System Programs",
                "OS Structure (Monolithic, Layered, Microkernel)",
                "Process Concept and Process States",
            ]},
            2: {"title": "Process Management", "topics": [
                "CPU Scheduling Algorithms (FCFS, SJF, Priority, RR)",
                "Preemptive vs Non-Preemptive Scheduling",
                "Multi-level Queue Scheduling",
                "Process Synchronization",
                "Critical Section Problem",
            ]},
            3: {"title": "Synchronization & Deadlocks", "topics": [
                "Semaphores and Mutex",
                "Classical Synchronization Problems",
                "Deadlock Characterization",
                "Deadlock Prevention and Avoidance",
                "Banker's Algorithm",
            ]},
            4: {"title": "Memory Management", "topics": [
                "Contiguous Memory Allocation",
                "Paging and Page Tables",
                "Segmentation",
                "Virtual Memory and Demand Paging",
                "Page Replacement Algorithms (FIFO, LRU, Optimal)",
            ]},
            5: {"title": "File Systems & I/O", "topics": [
                "File System Interface and Implementation",
                "Directory Structure",
                "Disk Scheduling Algorithms",
                "I/O Systems and Device Management",
                "Protection and Security",
            ]},
        },
    },
    "BCS304": {
        "name": "Data Structures and Applications",
        "modules": {
            1: {"title": "Arrays & Strings", "topics": [
                "Arrays: Definition, Representation, Operations",
                "Sparse Matrices",
                "String Operations and Pattern Matching",
                "Structures and Unions in C",
                "Self-Referential Structures",
            ]},
            2: {"title": "Stacks & Queues", "topics": [
                "Stack ADT and Array Implementation",
                "Stack Applications (Infix to Postfix, Evaluation)",
                "Queue ADT and Circular Queue",
                "Double-Ended Queue (Deque)",
                "Priority Queue",
            ]},
            3: {"title": "Linked Lists", "topics": [
                "Singly Linked List Operations",
                "Doubly Linked List",
                "Circular Linked List",
                "Polynomial Representation using Linked Lists",
                "Linked Stack and Linked Queue",
            ]},
            4: {"title": "Trees", "topics": [
                "Binary Tree: Properties and Traversals",
                "Binary Search Tree (BST) Operations",
                "AVL Trees and Rotations",
                "B-Trees and B+ Trees",
                "Heap and Priority Queue using Heap",
            ]},
            5: {"title": "Graphs & Hashing", "topics": [
                "Graph Representations (Adjacency Matrix/List)",
                "BFS and DFS Traversals",
                "Minimum Spanning Tree (Prim's, Kruskal's)",
                "Shortest Path (Dijkstra's Algorithm)",
                "Hashing: Hash Functions, Collision Resolution",
            ]},
        },
    },
    # ── 4th Semester ──────────────────────────────────────────────────────
    "BCS401": {
        "name": "Analysis and Design of Algorithms",
        "modules": {
            1: {"title": "Introduction & Complexity", "topics": [
                "Algorithm Analysis Framework",
                "Asymptotic Notations (Big-O, Omega, Theta)",
                "Recurrence Relations",
                "Master Theorem",
                "Space and Time Complexity",
            ]},
            2: {"title": "Divide and Conquer", "topics": [
                "Merge Sort",
                "Quick Sort",
                "Binary Search",
                "Strassen's Matrix Multiplication",
                "Closest Pair Problem",
            ]},
            3: {"title": "Greedy Method", "topics": [
                "Knapsack Problem (Fractional)",
                "Job Sequencing with Deadlines",
                "Huffman Coding",
                "Minimum Spanning Tree",
                "Single Source Shortest Path",
            ]},
            4: {"title": "Dynamic Programming", "topics": [
                "0/1 Knapsack Problem",
                "Longest Common Subsequence",
                "Matrix Chain Multiplication",
                "Floyd-Warshall Algorithm",
                "Travelling Salesman Problem",
            ]},
            5: {"title": "Backtracking & NP", "topics": [
                "N-Queens Problem",
                "Graph Coloring",
                "Hamiltonian Cycle",
                "Branch and Bound",
                "NP-Complete and NP-Hard Problems",
            ]},
        },
    },
    "BCS403": {
        "name": "Database Management Systems",
        "modules": {
            1: {"title": "Introduction & ER Model", "topics": [
                "Database System Concepts",
                "Data Models and Schemas",
                "Entity-Relationship Model",
                "ER Diagram Design",
                "Extended ER Features",
            ]},
            2: {"title": "Relational Model & SQL", "topics": [
                "Relational Data Model",
                "Relational Algebra Operations",
                "SQL: DDL, DML, DCL",
                "Aggregate Functions and Grouping",
                "Nested Queries and Joins",
            ]},
            3: {"title": "Normalization", "topics": [
                "Functional Dependencies",
                "1NF, 2NF, 3NF",
                "Boyce-Codd Normal Form (BCNF)",
                "Multivalued Dependencies and 4NF",
                "Lossless Decomposition",
            ]},
            4: {"title": "Transaction Management", "topics": [
                "Transaction Concepts and ACID Properties",
                "Concurrency Control Protocols",
                "Two-Phase Locking",
                "Deadlock Handling in DBMS",
                "Recovery Techniques (Log-based, Checkpoints)",
            ]},
            5: {"title": "Indexing & Storage", "topics": [
                "File Organization",
                "Indexing: Primary, Secondary, Clustering",
                "B-Tree and B+ Tree Indexing",
                "Hashing Techniques",
                "Query Processing and Optimization",
            ]},
        },
    },
    # ── 5th Semester ──────────────────────────────────────────────────────
    "BCS501": {
        "name": "Software Engineering and Project Management",
        "modules": {
            1: {"title": "Software Process", "topics": [
                "Software Engineering Fundamentals",
                "Software Process Models (Waterfall, Agile, Spiral)",
                "Agile Development and Scrum",
                "Requirements Engineering",
                "Software Requirements Specification (SRS)",
            ]},
            2: {"title": "Design & Architecture", "topics": [
                "Software Design Concepts",
                "Architectural Design Patterns",
                "Component-Level Design",
                "UML Diagrams (Class, Sequence, Activity)",
                "User Interface Design",
            ]},
            3: {"title": "Testing", "topics": [
                "Software Testing Fundamentals",
                "White-Box Testing Techniques",
                "Black-Box Testing Techniques",
                "Integration and System Testing",
                "Test Case Design and Execution",
            ]},
            4: {"title": "Project Management", "topics": [
                "Project Planning and Estimation",
                "COCOMO Model",
                "Risk Management",
                "Project Scheduling (Gantt, PERT/CPM)",
                "Software Configuration Management",
            ]},
            5: {"title": "Quality & Maintenance", "topics": [
                "Software Quality Assurance",
                "Software Metrics",
                "Software Maintenance Types",
                "Reengineering and Reverse Engineering",
                "CMMI and ISO Standards",
            ]},
        },
    },
    "BCS504": {
        "name": "Artificial Intelligence",
        "modules": {
            1: {"title": "Introduction to AI", "topics": [
                "AI Concepts and History",
                "Intelligent Agents",
                "Agent Types and Environments",
                "Problem Formulation",
                "State Space Representation",
            ]},
            2: {"title": "Search Algorithms", "topics": [
                "Uninformed Search (BFS, DFS, UCS)",
                "Informed Search (A*, Greedy Best-First)",
                "Hill Climbing and Simulated Annealing",
                "Constraint Satisfaction Problems",
                "Game Playing (Minimax, Alpha-Beta Pruning)",
            ]},
            3: {"title": "Knowledge Representation", "topics": [
                "Propositional Logic",
                "First-Order Predicate Logic",
                "Inference in First-Order Logic",
                "Knowledge-Based Agents",
                "Ontologies and Semantic Networks",
            ]},
            4: {"title": "Uncertainty & Learning", "topics": [
                "Probability and Bayesian Networks",
                "Decision Making Under Uncertainty",
                "Introduction to Machine Learning",
                "Supervised Learning Basics",
                "Decision Trees",
            ]},
            5: {"title": "Advanced AI", "topics": [
                "Neural Networks Basics",
                "Natural Language Processing Intro",
                "Computer Vision Basics",
                "Expert Systems",
                "Ethics in AI",
            ]},
        },
    },
    # ── 6th Semester ──────────────────────────────────────────────────────
    "BCS601": {
        "name": "Cloud Computing",
        "modules": {
            1: {"title": "Distributed Systems", "topics": [
                "Introduction to Cloud & Distributed Computing",
                "Scalable Computing over the Internet",
                "System Models for Distributed Computing",
                "Cluster Computing and Grid Computing",
                "Peer-to-Peer Computing",
            ]},
            2: {"title": "Virtualization", "topics": [
                "Virtualization Concepts and Types",
                "Hypervisors (Type 1 and Type 2)",
                "Virtual Machines and Containers",
                "Server and Storage Virtualization",
                "Data Center Design",
            ]},
            3: {"title": "Cloud Architecture", "topics": [
                "Cloud Service Models (IaaS, PaaS, SaaS)",
                "Cloud Deployment Models (Public, Private, Hybrid)",
                "AWS, Azure, GCP Overview",
                "Cloud Resource Management",
                "Auto-scaling and Load Balancing",
            ]},
            4: {"title": "Cloud Security", "topics": [
                "Cloud Security Challenges",
                "Identity and Access Management",
                "Data Security and Encryption",
                "Compliance and Governance",
                "Intrusion Detection Systems",
            ]},
            5: {"title": "Cloud Programming", "topics": [
                "Cloud Programming Environments",
                "MapReduce Programming Model",
                "Serverless Computing (FaaS)",
                "Containerization with Docker/Kubernetes",
                "Big Data Processing in Cloud",
            ]},
        },
    },
    "BCS602": {
        "name": "Machine Learning",
        "modules": {
            1: {"title": "Introduction to ML", "topics": [
                "Machine Learning Fundamentals",
                "Types of Learning (Supervised, Unsupervised, RL)",
                "Hypothesis Space and Inductive Bias",
                "Overfitting and Underfitting",
                "Training, Validation, and Test Sets",
            ]},
            2: {"title": "Supervised Learning", "topics": [
                "Linear Regression",
                "Logistic Regression",
                "Decision Trees and Random Forests",
                "Support Vector Machines (SVM)",
                "K-Nearest Neighbors (KNN)",
            ]},
            3: {"title": "Ensemble & Neural Networks", "topics": [
                "Ensemble Methods (Bagging, Boosting)",
                "AdaBoost and Gradient Boosting",
                "Perceptron and Multi-Layer Networks",
                "Backpropagation Algorithm",
                "Activation Functions",
            ]},
            4: {"title": "Unsupervised Learning", "topics": [
                "K-Means Clustering",
                "Hierarchical Clustering",
                "DBSCAN Algorithm",
                "Principal Component Analysis (PCA)",
                "Dimensionality Reduction",
            ]},
            5: {"title": "Model Evaluation", "topics": [
                "Confusion Matrix and Metrics",
                "Precision, Recall, F1-Score",
                "ROC Curve and AUC",
                "Cross-Validation Techniques",
                "Bias-Variance Tradeoff",
            ]},
        },
    },
    "BCS604": {
        "name": "Cryptography and Network Security",
        "modules": {
            1: {"title": "Classical Cryptography", "topics": [
                "Security Concepts and Attacks",
                "Caesar Cipher and Substitution Ciphers",
                "Transposition Ciphers",
                "Playfair and Vigenere Cipher",
                "One-Time Pad",
            ]},
            2: {"title": "Symmetric Encryption", "topics": [
                "Block Cipher Principles",
                "DES Algorithm",
                "AES Algorithm",
                "Block Cipher Modes of Operation",
                "Stream Ciphers (RC4)",
            ]},
            3: {"title": "Public Key Cryptography", "topics": [
                "RSA Algorithm",
                "Diffie-Hellman Key Exchange",
                "Elliptic Curve Cryptography",
                "ElGamal Cryptosystem",
                "Key Management",
            ]},
            4: {"title": "Authentication & Signatures", "topics": [
                "Hash Functions (MD5, SHA)",
                "Message Authentication Codes (MAC)",
                "Digital Signatures",
                "Digital Certificates",
                "Public Key Infrastructure (PKI)",
            ]},
            5: {"title": "Network Security", "topics": [
                "IP Security (IPSec)",
                "SSL/TLS Protocol",
                "Firewalls and IDS",
                "Email Security (PGP, S/MIME)",
                "Web Security and HTTPS",
            ]},
        },
    },
}
