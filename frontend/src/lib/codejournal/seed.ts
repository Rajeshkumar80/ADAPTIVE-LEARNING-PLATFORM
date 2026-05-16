/**
 * Seed data — diverse, realistic journal entries covering every content type.
 */

import { CodeJournalBlock, CodeJournalProject } from './types';

const now = Date.now();
const min = 60 * 1000;
const hour = 60 * min;
const day = 24 * hour;

function block(
  id: string,
  text: string,
  contentType: CodeJournalBlock['contentType'],
  category: string,
  annotation: string,
  confidence: 1 | 2 | 3 | 4 | 5,
  hoursAgo: number,
  influencedBy: string[] = [],
  isPinned = false
): CodeJournalBlock {
  return {
    id,
    text,
    timestamp: now - hoursAgo * hour,
    contentType,
    category,
    annotation,
    confidence,
    influencedBy,
    isPinned,
  };
}

const seedBlocks: CodeJournalBlock[] = [
  // ==================== RESOLVED (4) ====================
  block(
    'sd_resolved_bst',
    'Now I understand binary search trees. The key insight is that in-order traversal gives elements in sorted order — that\'s why BSTs make range queries fast.',
    'resolved',
    'DSA / Trees',
    'Great moment of clarity. The in-order property is also why BSTs make set operations efficient. Revisit this in 7 days to confirm retention. Resolved confusions are the highest-value entries in your journal.',
    5,
    1,
    ['sd_confusion_bst']
  ),
  block(
    'sd_resolved_promise',
    'Finally got how Promise chains work — each .then returns a NEW promise, that\'s why you can chain them. The value passes through.',
    'resolved',
    'JavaScript / Async',
    'Great resolution. The deeper insight: this is functional composition. Each .then is essentially flatMap (or bind/chain in haskell terms). Once you see promises as monads, async/await becomes obvious.',
    5,
    6
  ),
  block(
    'sd_resolved_indexing',
    'Got it: B-tree indexes are great for range queries because adjacent values are physically close on disk. Hash indexes are faster for equality but useless for ranges.',
    'resolved',
    'Database / Indexing',
    'Excellent — you\'ve internalized the data structure → use case mapping. The next layer: composite indexes have column ordering rules (most selective column first) and covering indexes can avoid table lookups entirely.',
    5,
    18
  ),
  block(
    'sd_resolved_useeffect',
    'Now I see why useEffect runs twice in dev — React 18 strict mode intentionally double-invokes to surface bugs in cleanup logic. Production runs once.',
    'resolved',
    'React / Hooks',
    'Solid grasp. This double-invoke is one of React\'s best teaching tools — if your effect can\'t survive being called twice, it has a bug. Always pair side effects with proper cleanup.',
    4,
    24,
    ['sd_confusion_useeffect']
  ),

  // ==================== CONFUSION (5) ====================
  block(
    'sd_confusion_dp',
    'Why does dynamic programming feel so different from recursion? They look similar but I keep blanking on when to use which.',
    'confusion',
    'DSA / Dynamic Programming',
    'DP is recursion + caching. Recursion goes top-down (solve big, break smaller); DP often goes bottom-up (solve small, build bigger). Try writing fibonacci both ways back-to-back — the equivalence becomes obvious.',
    2,
    3
  ),
  block(
    'sd_confusion_bst',
    'Confused about how rotations work in AVL trees. Why does a left-rotation fix a right-heavy imbalance?',
    'confusion',
    'DSA / Trees',
    'AVL rotations preserve BST property while rebalancing height. Draw a 3-node imbalance on paper, then trace each pointer change during rotation. The visual aha moment beats reading the same explanation again.',
    1,
    8
  ),
  block(
    'sd_confusion_useeffect',
    'I have doubt in why my useEffect runs twice in development mode',
    'confusion',
    'React / Hooks',
    'This is React 18 strict mode intentionally double-invoking effects in dev to surface bugs. Add a console.log inside your effect AND another in cleanup — you\'ll see the pattern: mount, cleanup, mount. It only happens in dev.',
    1,
    25
  ),
  block(
    'sd_confusion_grad',
    'Why does gradient descent get stuck in local minima for some loss functions but not others? When should I worry about this?',
    'confusion',
    'Machine Learning / Deep Learning',
    'For high-dimensional NN loss landscapes, true local minima are rare — saddle points dominate. SGD\'s noise actually helps escape them. Worry more about: vanishing gradients, plateaus, and bad initialization than getting stuck in local minima.',
    2,
    14
  ),
  block(
    'sd_confusion_async',
    'Why do my async functions sometimes run in unexpected order? I thought await made things sequential.',
    'confusion',
    'JavaScript / Async',
    'await IS sequential within one async function. Surprises usually come from: (1) calling multiple async functions without awaiting (parallel), (2) microtask vs task queue ordering, (3) forgetting that the event loop drains microtasks between every task.',
    2,
    32
  ),

  // ==================== CONCEPT (6) ====================
  block(
    'sd_concept_bigo',
    'Big-O describes worst-case growth rate as input size approaches infinity. Constants and lower-order terms get dropped: O(2n + 5) = O(n).',
    'concept',
    'DSA / Complexity',
    'Solid grounding. Next step: connect to amortized analysis (how operations average out) and to space complexity. Also worth knowing when Big-O lies — for small inputs, constants matter a lot.',
    4,
    10
  ),
  block(
    'sd_concept_closures',
    'Closures in JavaScript capture variables by reference, not value. The function remembers its lexical scope.',
    'concept',
    'JavaScript / Closures',
    'Closures capture variables by reference — this is why classic loop-counter bugs appear with `var`. Try writing a for-loop with `var` that creates closures, see what happens. The fix (`let` or IIFE) reveals the underlying mechanism.',
    4,
    14
  ),
  block(
    'sd_concept_promises',
    'Promises represent the eventual result of an async operation. Three states: pending, fulfilled, rejected. State transitions are one-way.',
    'concept',
    'JavaScript / Async',
    'Async patterns have subtle implications around error handling. Write an example where one promise rejects mid-chain — make sure your error handling catches it. That\'s where most async bugs hide.',
    3,
    20
  ),
  block(
    'sd_concept_normalization',
    'Database normalization reduces redundancy by splitting tables. 1NF requires atomic values, 2NF requires no partial dependencies, 3NF eliminates transitive dependencies.',
    'concept',
    'Database / Design',
    'Database concepts have performance implications. For each normal form, ask: what query gets faster, what gets slower? Over-normalization can hurt read performance — that\'s when denormalization comes back in.',
    4,
    26
  ),
  block(
    'sd_concept_hooks',
    'React hooks let you use state and lifecycle in function components. They MUST be called at the top level, in the same order every render.',
    'concept',
    'React / Hooks',
    'The "same order every render" rule is what makes hooks work — React tracks them by call index, not name. This is why you can\'t put hooks inside if-statements. The lint rule "react-hooks/rules-of-hooks" catches this.',
    4,
    22
  ),
  block(
    'sd_concept_overfitting',
    'Overfitting happens when a model memorizes training data noise instead of learning patterns. Symptoms: high train accuracy, low validation accuracy.',
    'concept',
    'Machine Learning / Fundamentals',
    'Solid ML grounding. Connect this to the bias-variance tradeoff. Common fixes: regularization (L1/L2), dropout, early stopping, more training data, simpler model. Plot train vs val loss — divergence = overfitting starting.',
    4,
    16
  ),

  // ==================== EDGE CASE (3) ====================
  block(
    'sd_edgecase_sort',
    'Edge case: Array.prototype.sort() with no comparator does lexicographic sort. So [1, 10, 2].sort() returns [1, 10, 2], not [1, 2, 10]. Always pass a comparator for numbers.',
    'edgecase',
    'JavaScript / Types',
    'Excellent catch — production code lives or dies on edge cases like this. Add a unit test that explicitly verifies numeric sorting. This particular gotcha has shipped bugs to production at major companies.',
    5,
    30,
    ['sd_concept_closures']
  ),
  block(
    'sd_edgecase_null',
    'typeof null returns "object" — a 25-year-old JavaScript bug that can\'t be fixed without breaking the web. Use === null for null checks.',
    'edgecase',
    'JavaScript / Types',
    'Great catch. The fix would have broken too much existing code. Modern style: prefer optional chaining (?.) and nullish coalescing (??) which handle null/undefined cleanly without typeof.',
    5,
    36
  ),
  block(
    'sd_edgecase_sql',
    'Edge case in SQL: NULL = NULL returns NULL, not TRUE. Use IS NULL for null checks. WHERE clauses treat NULL as falsy.',
    'edgecase',
    'Database / SQL',
    'This trips up everyone learning SQL. Three-valued logic (true/false/null) makes WHERE clauses tricky. NOT IN with a NULL in the subquery returns no rows. Always think about NULLs explicitly.',
    5,
    42
  ),

  // ==================== SYNTHESIS (2) ====================
  block(
    'sd_synthesis_recursion_dp',
    'Both recursion and dynamic programming connect through the idea of breaking a problem into smaller subproblems. The difference is whether you cache the results.',
    'synthesis',
    'DSA / Dynamic Programming',
    'The deeper pattern: any recursive solution with overlapping subproblems can become DP. Non-overlapping cases (divide & conquer like merge sort) don\'t benefit from caching. Memoization is just lazy DP.',
    5,
    40,
    ['sd_concept_bigo', 'sd_confusion_dp']
  ),
  block(
    'sd_synthesis_state',
    'React state and database state share the same problem: they get out of sync with the source of truth. Both solve it with one-way data flow.',
    'synthesis',
    'React / State',
    'Connections like this are where expertise grows. The deeper pattern: any system with caching faces sync problems. The solution is always either single source of truth or eventual consistency. Spotting this in new domains accelerates learning.',
    5,
    50
  ),

  // ==================== HYPOTHESIS (3) ====================
  block(
    'sd_hyp_v8',
    'I think the V8 engine inlines functions shorter than ~600 bytes. That\'s why tiny utility functions are basically free.',
    'hypothesis',
    'JavaScript / Async',
    'Testable — write benchmarks comparing inlined vs non-inlined functions, then check the V8 deopt logs. The actual threshold is configurable and changes between versions, but the principle (inlining for hot small functions) is solid.',
    3,
    48
  ),
  block(
    'sd_hyp_react',
    'I think React.memo is rarely worth it because the comparison cost often exceeds the re-render cost for simple components.',
    'hypothesis',
    'React / Rendering',
    'Largely correct. memo helps when: (1) component is expensive, (2) parent re-renders often with same props, (3) props are stable references. For simple components, just let them re-render. Profile before optimizing.',
    3,
    60
  ),
  block(
    'sd_hyp_index',
    'Maybe creating an index on every column would just speed up everything? Why not?',
    'hypothesis',
    'Database / Indexing',
    'Refute it experimentally. Indexes slow down writes (every INSERT/UPDATE updates indexes) and consume disk. Cardinality matters too — an index on a boolean column is mostly useless. Index strategically based on actual queries.',
    2,
    72
  ),

  // ==================== CONFLICT (1) ====================
  block(
    'sd_conflict_var',
    'My textbook says var is function-scoped, but I see it behaving like block scope when I use it in a for loop with closures. Wait — that\'s the BUG. var IS function-scoped, the closures are seeing the same variable.',
    'conflict',
    'JavaScript / Closures',
    'Surface behavior vs underlying mechanism — easy to confuse. var\'s function-scoping IS exactly why the closure bug exists: all iterations share one variable. let creates a fresh binding per iteration, which is why it "fixes" closures in loops.',
    4,
    56,
    ['sd_concept_closures']
  ),

  // ==================== DEFINITION (3) ====================
  block(
    'sd_def_idempotent',
    'Idempotent: an operation that produces the same result whether called once or many times. PUT is idempotent, POST is not. Setting x = 5 is idempotent, x++ is not.',
    'definition',
    'Networks / Protocols',
    'Test your definition: is "delete a row by id" idempotent? (yes — deleting an already-deleted row is a no-op). What about "delete the most recent row"? (no — different rows get deleted each time). Definitions distinguish from neighbors.',
    5,
    72
  ),
  block(
    'sd_def_pure',
    'Pure function: same inputs always produce same outputs, AND has no side effects. No reading globals, no mutating arguments, no console.log.',
    'definition',
    'JavaScript / Functions',
    'Excellent definition. The two clauses are independent — a function can be deterministic but impure (mutates an argument), or pure but slow. Pure functions are testable, memoizable, and parallelizable. The foundation of functional programming.',
    5,
    100
  ),
  block(
    'sd_def_acid',
    'ACID: Atomicity (all or nothing), Consistency (rules preserved), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crashes).',
    'definition',
    'Database / Transactions',
    'Good. Each of these has gradations in practice. Isolation has 4 levels (read uncommitted → serializable). Durability is usually configurable (sync vs async commit). Real systems trade these off — see CAP theorem.',
    5,
    150
  ),

  // ==================== ASSIGNMENT (3) ====================
  block(
    'sd_assign_dp',
    'TODO: Implement longest common subsequence both recursively and with DP. Compare runtimes on a 100-character string.',
    'assignment',
    'DSA / Dynamic Programming',
    'Set a 25-minute timer. The naive recursion will likely time out on 100 characters — that\'s the lesson. Document new confusions that arise. Targeted practice beats passive reading 10:1.',
    3,
    96
  ),
  block(
    'sd_assign_react',
    'Need to build a custom useDebounce hook with proper cleanup. Practice problem from my React notes.',
    'assignment',
    'React / Hooks',
    'Set a 15-minute timer. Make sure to clear the timeout in cleanup — otherwise you\'ll have stale callbacks firing after unmount. Test by changing the input rapidly. Document any new edge cases you discover.',
    3,
    120
  ),
  block(
    'sd_assign_sql',
    'Practice: write a SQL query to find the second-highest salary per department without using LIMIT or OFFSET.',
    'assignment',
    'Database / SQL',
    'Several valid approaches: window functions (ROW_NUMBER OVER PARTITION BY), correlated subquery with COUNT, or self-join. Try at least two — comparing approaches teaches more than completing one.',
    3,
    144
  ),
];

export function seedProject(): CodeJournalProject {
  return {
    id: 'seed-project',
    name: 'Sample Journal',
    blocks: seedBlocks,
    ghostNotes: [],
    collapsedCategories: [],
    createdAt: now - 7 * day,
    updatedAt: now,
  };
}
