/**
 * Seed data — realistic, diverse journal entries to demo all content types.
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
  // ===== Resolved (most recent) =====
  block(
    'sd_resolved_1',
    'Now I understand binary search trees — the key insight is that the in-order traversal gives you elements in sorted order. That\'s why BSTs are powerful for range queries.',
    'resolved',
    'DSA / Trees',
    'Great — capturing the moment of resolution is what makes learning stick. The in-order property is also why BSTs make set operations efficient. Revisit this in 7 days to confirm retention.',
    5,
    1,
    ['sd_confusion_bst']
  ),

  // ===== Confusions =====
  block(
    'sd_confusion_dp',
    'Why does dynamic programming feel so different from recursion? They look similar but my mind keeps blanking on when to use which.',
    'confusion',
    'DSA / Dynamic Programming',
    'DP is essentially recursion with caching. The mental shift: recursion goes top-down (solve big, break smaller), DP often goes bottom-up (solve small, build bigger). Try writing fibonacci both ways back-to-back — the equivalence becomes obvious.',
    2,
    3
  ),
  block(
    'sd_confusion_bst',
    'Confused about how rotations work in AVL trees. Why does left-rotation fix a right-heavy imbalance?',
    'confusion',
    'DSA / Trees',
    'AVL rotations preserve BST property while rebalancing height. Draw a 3-node imbalance on paper, then trace each pointer change during a rotation. The visual aha moment usually beats reading the same explanation again.',
    1,
    8
  ),
  block(
    'sd_confusion_react',
    'I have doubt in why my useEffect runs twice in development mode',
    'confusion',
    'React / Hooks',
    'This is React 18 strict mode intentionally double-invoking effects in dev to surface bugs. Add a console.log inside your effect and another in the cleanup — you\'ll see the pattern: mount, cleanup, mount. It only happens in dev.',
    1,
    5
  ),

  // ===== Concepts =====
  block(
    'sd_concept_bigo',
    'Big-O notation describes the worst-case growth rate of an algorithm as input size approaches infinity. The constant factors and lower-order terms get dropped.',
    'concept',
    'DSA / Complexity',
    'Solid grounding. Next step: connect this to amortized analysis (how operations average out) and to space complexity. Also worth knowing when Big-O lies — for small inputs, constants matter a lot.',
    4,
    10
  ),
  block(
    'sd_concept_closures',
    'Closures in JavaScript capture variables by reference, not value. The function remembers its lexical scope.',
    'concept',
    'JavaScript / Closures',
    'Closures capture variables by reference, not value — this is why classic loop-counter bugs appear with `var`. Try writing a for-loop with `var` that creates closures, and see what happens. The fix (`let` or IIFE) reveals the underlying mechanism.',
    4,
    14
  ),
  block(
    'sd_concept_promises',
    'Promises represent the eventual result of an asynchronous operation. They have three states: pending, fulfilled, or rejected.',
    'concept',
    'JavaScript / Async',
    'Async patterns have subtle implications around error handling and cancellation. Write an example where one promise rejects mid-chain — make sure your error handling catches it. That\'s where most async bugs hide.',
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

  // ===== Edge cases =====
  block(
    'sd_edgecase_array',
    'Edge case: Array.prototype.sort with no comparator does lexicographic sort. So [1, 10, 2].sort() returns [1, 10, 2], not [1, 2, 10]. Always pass a comparator for numbers.',
    'edgecase',
    'JavaScript / Types',
    'Excellent catch — production code lives or dies on edge cases like this. Add a unit test that explicitly verifies numeric sorting. This particular gotcha has shipped bugs to production at major companies.',
    5,
    30,
    ['sd_concept_closures']
  ),
  block(
    'sd_edgecase_null',
    'typeof null returns "object" — this is a 25-year-old JavaScript bug that can\'t be fixed without breaking the web. Use === null for null checks.',
    'edgecase',
    'JavaScript / Types',
    'Great catch. The fix would have broken too much existing code, so it stayed. Modern style: prefer optional chaining (?.) and nullish coalescing (??) which handle null/undefined cleanly without typeof.',
    5,
    36
  ),

  // ===== Synthesis =====
  block(
    'sd_synthesis_recursion',
    'Both recursion and dynamic programming connect through the idea of breaking a problem into smaller subproblems. The difference is whether you cache the results.',
    'synthesis',
    'DSA / Dynamic Programming',
    'Connections like this are where expertise grows. The deeper pattern: any recursive solution with overlapping subproblems can become DP. The non-overlapping case (divide & conquer like merge sort) doesn\'t benefit from caching.',
    5,
    40,
    ['sd_concept_bigo']
  ),

  // ===== Hypothesis =====
  block(
    'sd_hypothesis_v8',
    'I think the V8 engine inlines functions shorter than ~600 bytes. That\'s why tiny utility functions are basically free.',
    'hypothesis',
    'JavaScript / Async',
    'This is testable — write benchmarks comparing inlined vs non-inlined functions, then check the V8 deopt logs. The actual threshold is configurable and changes between versions, but the principle (inlining for hot small functions) is solid.',
    3,
    48
  ),

  // ===== Conflict =====
  block(
    'sd_conflict_var',
    'Conflict: my textbook says var is function-scoped, but I see it behaving like block scope when I use it in a for loop with closures. Wait — that\'s the BUG. var IS function-scoped, the closures are seeing the same variable.',
    'conflict',
    'JavaScript / Closures',
    'Conflicts usually arise from confusing surface behavior with the underlying mechanism. var\'s function-scoping is exactly why the closure bug exists — all iterations share one variable. let creates a fresh binding per iteration, which is why it "fixes" closures in loops.',
    4,
    56,
    ['sd_concept_closures']
  ),

  // ===== Definition =====
  block(
    'sd_def_idempotent',
    'Idempotent: an operation that produces the same result whether called once or many times. PUT is idempotent, POST is not. Setting x = 5 is idempotent, x++ is not.',
    'definition',
    'Networks / Protocols',
    'Good definitions distinguish the term from neighbors. Test yours: is "delete a row by id" idempotent? (yes — deleting an already-deleted row is a no-op). What about "delete the most recent row"? (no — different rows get deleted each time).',
    5,
    72
  ),

  // ===== Assignment =====
  block(
    'sd_assignment_dp',
    'TODO: Implement the longest common subsequence problem both recursively and with DP. Compare runtimes on a 100-character string.',
    'assignment',
    'DSA / Dynamic Programming',
    'Set a 25-minute timer and aim for completion, not perfection. The recursion will likely time out on 100 characters — that\'s the lesson. Document any new confusions that arise. Targeted practice beats passive reading 10 to 1.',
    3,
    96
  ),
];

export function seedProject(): CodeJournalProject {
  return {
    id: 'seed-project',
    name: 'Sample Journal',
    blocks: seedBlocks,
    ghostNotes: [],
    collapsedCategories: [],
    createdAt: now - 5 * day,
    updatedAt: now,
  };
}
