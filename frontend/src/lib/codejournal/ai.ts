/**
 * AI enrichment for CodeJournal entries.
 * Uses smart local heuristics that produce contextual, relevant annotations.
 */

import { CodeJournalBlock, ContentType, GhostNote, SynthesisResult } from './types';
import { detectContentType, stripInlineTag } from './detect';

// ============= Categories — tech topic recognition =============
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  // ML / AI
  'Machine Learning / Fundamentals': ['ml', 'machine learning', 'training', 'model', 'feature', 'label', 'overfitting', 'underfitting'],
  'Machine Learning / Supervised': ['supervised', 'classification', 'regression', 'svm', 'decision tree', 'random forest'],
  'Machine Learning / Deep Learning': ['neural network', 'deep learning', 'cnn', 'rnn', 'transformer', 'backprop', 'gradient descent'],
  'Machine Learning / NLP': ['nlp', 'tokenization', 'embedding', 'attention', 'bert', 'gpt'],

  // JavaScript
  'JavaScript / Closures': ['closure', 'lexical scope', 'iife'],
  'JavaScript / Async': ['async', 'await', 'promise', 'callback', 'event loop', 'microtask'],
  'JavaScript / Types': ['typeof', 'null', 'undefined', 'coercion', 'nan'],
  'JavaScript / Functions': ['arrow function', 'this binding', 'bind', 'call', 'apply'],

  // React
  'React / Hooks': ['usestate', 'useeffect', 'usememo', 'usecallback', 'react hook'],
  'React / Rendering': ['render', 'reconciliation', 'virtual dom', 'memo', 'key prop'],
  'React / State': ['state', 'props', 'context', 'redux', 'zustand'],

  // TypeScript
  'TypeScript / Types': ['generic', 'union type', 'intersection', 'type guard', 'narrow'],

  // CSS
  'CSS / Layout': ['flexbox', 'css grid', 'position', 'display'],
  'CSS / Animation': ['transition', 'keyframe', 'css animation'],

  // DSA
  'DSA / Sorting': ['bubble sort', 'quick sort', 'merge sort', 'heap sort', 'sorting'],
  'DSA / Searching': ['binary search', 'linear search', 'searching'],
  'DSA / Trees': ['tree', 'binary tree', 'bst', 'avl', 'traversal'],
  'DSA / Graphs': ['graph', 'bfs', 'dfs', 'dijkstra', 'shortest path'],
  'DSA / Dynamic Programming': ['dynamic programming', 'memoization', 'tabulation', 'dp'],
  'DSA / Complexity': ['complexity', 'time complexity', 'space complexity', 'big-o', 'big o'],
  'DSA / Arrays & Strings': ['array', 'string', 'two pointer', 'sliding window'],
  'DSA / Hash & Maps': ['hash', 'hash map', 'hash table', 'dictionary'],
  'DSA / Stack & Queue': ['stack', 'queue', 'lifo', 'fifo'],
  'DSA / Linked Lists': ['linked list', 'pointer'],

  // Database
  'Database / SQL': ['sql query', 'select', 'join', 'where clause', 'group by'],
  'Database / Design': ['normalization', 'schema', 'foreign key', 'primary key', 'er diagram'],
  'Database / Indexing': ['index', 'b-tree', 'database performance'],
  'Database / Transactions': ['transaction', 'acid', 'isolation level', 'rollback'],

  // Operating Systems
  'OS / Process': ['process', 'thread', 'scheduler', 'context switch', 'pcb'],
  'OS / Memory': ['paging', 'segmentation', 'virtual memory', 'page fault'],
  'OS / Synchronization': ['mutex', 'semaphore', 'deadlock', 'race condition'],
  'OS / File Systems': ['inode', 'file system', 'block', 'cluster'],

  // Networks
  'Networks / Protocols': ['tcp', 'udp', 'http', 'osi model', 'three-way handshake'],
  'Networks / Routing': ['routing', 'subnet', 'cidr', 'ip address'],
  'Networks / Security': ['ssl', 'tls', 'https', 'encryption'],

  // Software Engineering
  'Software Engineering / Patterns': ['design pattern', 'singleton', 'factory', 'observer', 'mvc'],
  'Software Engineering / Testing': ['unit test', 'integration test', 'tdd', 'mock'],
  'Software Engineering / Git': ['git', 'commit', 'branch', 'merge', 'rebase'],

  // General programming
  'Programming / Memory': ['stack overflow', 'heap', 'garbage collection', 'memory leak'],
  'Programming / Recursion': ['recursion', 'recursive', 'base case'],
};

function inferCategory(text: string): string {
  const lower = text.toLowerCase();
  let bestCategory = 'General';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const k of keywords) {
      if (lower.includes(k)) {
        // Multi-word keywords count more
        score += k.split(/\s+/).length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  // If no good match, use a simpler topic name
  if (bestCategory === 'General') {
    if (/\b(ml|machine learning|ai)\b/i.test(lower)) return 'Machine Learning / General';
    if (/\bdsa\b/i.test(lower)) return 'DSA / General';
    if (/\b(database|sql|dbms)\b/i.test(lower)) return 'Database / General';
    if (/\b(react|component|jsx)\b/i.test(lower)) return 'React / General';
    if (/\b(javascript|js)\b/i.test(lower)) return 'JavaScript / General';
    if (/\b(python|py)\b/i.test(lower)) return 'Python / General';
    if (/\b(operating system|os|kernel|process|thread)\b/i.test(lower)) return 'Operating Systems / General';
    if (/\b(network|http|tcp|protocol)\b/i.test(lower)) return 'Networks / General';
  }

  return bestCategory;
}

// ============= Confidence scoring =============
function scoreConfidence(text: string, contentType: ContentType): 1 | 2 | 3 | 4 | 5 {
  const trimmed = text.trim();
  const wordCount = trimmed.split(/\s+/).length;
  const hasExample = /\b(example|e\.g\.|for instance|like|such as|case)\b/i.test(trimmed);
  const hasNuance = /\b(however|but|whereas|unless|except|edge case|trade.?off|caveat)\b/i.test(trimmed);
  const hasTechnicalTerms = (trimmed.match(/`[^`]+`/g) || []).length;
  const hasUncertainty = /\b(maybe|i think|probably|not sure|might|i guess)\b/i.test(trimmed);
  const hasDetailedReasoning = /\b(because|since|due to|reason|that's why)\b/i.test(trimmed);

  // Confusion entries get low confidence by definition
  if (contentType === 'confusion') {
    return wordCount < 8 ? 1 : 2;
  }

  // Resolved entries get high confidence
  if (contentType === 'resolved') {
    return wordCount > 15 ? 5 : 4;
  }

  let score = 3;
  if (wordCount < 5) score = 1;
  else if (wordCount < 10) score = 2;
  else if (wordCount > 25 && hasExample) score = 4;
  if (hasNuance && hasDetailedReasoning) score = Math.min(5, score + 1) as 1 | 2 | 3 | 4 | 5;
  if (hasNuance && hasExample && hasTechnicalTerms >= 1) score = 5;
  if (hasUncertainty) score = Math.max(1, score - 1) as 1 | 2 | 3 | 4 | 5;

  return Math.max(1, Math.min(5, score)) as 1 | 2 | 3 | 4 | 5;
}

// ============= Smart annotation generation =============
function generateAnnotation(text: string, contentType: ContentType, category: string): string {
  const lower = text.toLowerCase();
  const topic = category.split(' / ')[1] || category.split(' / ')[0];

  // ===== CONFUSION — give specific guidance =====
  if (contentType === 'confusion') {
    if (lower.includes('ml') || lower.includes('machine learning')) {
      return `ML confusions usually clear up with a small concrete example. Try implementing a tiny model (e.g. linear regression on 5 data points) by hand. Also pinpoint exactly which step confuses you — data prep, training, or evaluation?`;
    }
    if (lower.includes('dsa') || lower.includes('algorithm') || lower.includes('data structure')) {
      return `For DSA confusion, draw it out on paper before coding. Trace through a small input step by step. The visual aha moment usually beats reading the same explanation again.`;
    }
    if (lower.includes('react') || lower.includes('hook')) {
      return `React confusions often come from misunderstanding when components re-render. Add a console.log at the top of your component and watch when it fires — that usually clarifies things fast.`;
    }
    if (lower.includes('async') || lower.includes('promise') || lower.includes('callback')) {
      return `Async confusion is the rite of passage for JS. Try writing the same logic three ways: callback, promise, async/await. Seeing the equivalence makes it click.`;
    }
    if (lower.includes('recursion') || lower.includes('recursive')) {
      return `Recursion clicks when you stop thinking about the recursive call and trust it. Just make sure your base case is correct and the recursive case moves toward it. Trace once on paper, then trust the magic.`;
    }
    return `This kind of confusion is common at this stage of learning ${topic}. The fastest way out: write the smallest possible code example that exhibits your confusion, then change one thing at a time until it makes sense.`;
  }

  // ===== RESOLVED — celebrate and reinforce =====
  if (contentType === 'resolved') {
    return `Great — capturing the moment of resolution is what makes learning stick. Write down what specifically clicked, and revisit this entry in 7 days to confirm it's still clear. Resolved confusions are the highest-value entries in your journal.`;
  }

  // ===== HYPOTHESIS — encourage testing =====
  if (contentType === 'hypothesis') {
    return `This is testable — write a small program to verify or refute your hypothesis. Untested hypotheses are mental debt. Once verified, mark this as resolved or definition.`;
  }

  // ===== EDGE CASE — celebrate the catch =====
  if (contentType === 'edgecase') {
    return `Excellent catch — production code lives or dies on edge cases like this. Add a unit test that explicitly verifies this behavior. Edge cases reveal the implicit assumptions in your code.`;
  }

  // ===== SYNTHESIS — encourage abstraction =====
  if (contentType === 'synthesis') {
    return `Connections like this are where expertise grows. Try to articulate the underlying abstraction in one sentence — what's the deeper pattern these two share? That single insight often unlocks adjacent topics too.`;
  }

  // ===== CONFLICT — guide resolution =====
  if (contentType === 'conflict') {
    return `Conflicts usually arise from different abstraction levels or contexts (e.g. browser vs Node, sync vs async, version differences). Identify the level each statement operates at — the contradiction often disappears.`;
  }

  // ===== ASSIGNMENT — encourage commitment =====
  if (contentType === 'assignment') {
    return `Set a 15-25 minute timer and aim for completion, not perfection. Document any new confusions that arise — they're tomorrow's entries. Targeted practice beats passive reading 10 to 1.`;
  }

  // ===== DEFINITION — challenge precision =====
  if (contentType === 'definition') {
    return `Good definitions distinguish the term from its neighbors. Test yours: can you give an example, a counter-example, and explain when this concept doesn't apply? Anchor other entries back to this definition.`;
  }

  // ===== CONCEPT — topic-specific guidance =====
  if (lower.includes('ml') || lower.includes('machine learning')) {
    return `Solid ML grounding. Try to connect this to the bias-variance tradeoff or the training/validation/test split — those two ideas underpin most of ML and will deepen your understanding of this concept.`;
  }
  if (lower.includes('dsa')) {
    return `For any DSA concept, the next step is implementing it from scratch (no libraries). Then identify when this would be the wrong choice — knowing the limits is as valuable as knowing the strengths.`;
  }
  if (lower.includes('async') || lower.includes('promise')) {
    return `Async patterns have subtle implications around error handling and cancellation. Write an example where one promise rejects — make sure your error handling actually catches it. That's where most async bugs hide.`;
  }
  if (lower.includes('closure')) {
    return `Closures capture variables by reference, not value — this is why classic loop-counter bugs appear. Try writing a for-loop with var that creates closures, and see what happens. The fix (let or IIFE) reveals the underlying mechanism.`;
  }
  if (lower.includes('react') || lower.includes('hook')) {
    return `React concepts compound. Connect this to the rendering lifecycle: when does this run, what triggers it, and what happens if it depends on stale state? Those three questions answer 90% of React puzzles.`;
  }
  if (lower.includes('sql') || lower.includes('database')) {
    return `Database concepts have performance implications. For any SQL feature, ask: what does the query plan look like, and what indexes would help? Those two questions separate SQL writers from SQL engineers.`;
  }

  // Generic concept fallback
  return `A solid grasp of this in ${topic} unlocks several adjacent concepts. Try writing a 5-line example that demonstrates the key idea, including at least one edge case. Active examples beat passive reading every time.`;
}

// ============= Influence detection =============
function findInfluencedBy(
  newBlock: { text: string; category: string },
  existing: CodeJournalBlock[]
): string[] {
  const newText = newBlock.text.toLowerCase();
  const newWords = new Set(newText.split(/\W+/).filter(w => w.length > 4));

  const scored = existing
    .filter(b => !b.isError && !b.isEnriching)
    .map(b => {
      let score = 0;
      // Same category bonus
      if (b.category === newBlock.category) score += 4;
      // Same top-level domain (e.g. both DSA)
      else if (b.category.split(' / ')[0] === newBlock.category.split(' / ')[0]) score += 2;
      // Keyword overlap
      const otherWords = new Set(b.text.toLowerCase().split(/\W+/).filter(w => w.length > 4));
      let overlap = 0;
      for (const w of newWords) if (otherWords.has(w)) overlap++;
      score += overlap;
      return { id: b.id, score };
    })
    .filter(s => s.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored.map(s => s.id);
}

// ============= Main enrichment function =============
export async function enrichBlock(
  rawText: string,
  existingBlocks: CodeJournalBlock[]
): Promise<Partial<CodeJournalBlock>> {
  // Simulate small async delay so UI shows the loader briefly
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

  const text = stripInlineTag(rawText);
  const detected = detectContentType(rawText);
  const category = inferCategory(text);
  const contentType = detected.type;
  const annotation = generateAnnotation(text, contentType, category);
  const confidence = scoreConfidence(text, contentType);
  const influencedBy = findInfluencedBy({ text, category }, existingBlocks);

  return {
    contentType,
    category,
    annotation,
    confidence,
    influencedBy,
    isEnriching: false,
    isError: false,
  };
}

// ============= Synthesis =============
export async function synthesize(blocks: CodeJournalBlock[]): Promise<SynthesisResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const enrichedBlocks = blocks.filter(b => !b.isEnriching && !b.isError);

  if (enrichedBlocks.length < 3) {
    throw new Error('Need at least 3 entries to synthesize');
  }

  // Group by category
  const byCategory: Record<string, CodeJournalBlock[]> = {};
  for (const b of enrichedBlocks) {
    if (!byCategory[b.category]) byCategory[b.category] = [];
    byCategory[b.category].push(b);
  }

  // Score each category by weakness
  const categoryScores = Object.entries(byCategory).map(([cat, blocks]) => {
    const confusions = blocks.filter(b => b.contentType === 'confusion').length;
    const resolved = blocks.filter(b => b.contentType === 'resolved').length;
    const avgConf = blocks.reduce((sum, b) => sum + (b.confidence || 3), 0) / blocks.length;
    return {
      cat,
      blocks,
      weakness: confusions * 3 + (5 - avgConf) * 2 - resolved,
      strength: resolved + (avgConf - 3) * 2 - confusions,
    };
  });
  categoryScores.sort((a, b) => b.weakness - a.weakness);

  const weakest = categoryScores[0];
  const strongest = [...categoryScores].sort((a, b) => b.strength - a.strength)[0];

  // Build summary
  const categories = Object.keys(byCategory);
  const totalConfusions = enrichedBlocks.filter(b => b.contentType === 'confusion').length;
  const totalResolved = enrichedBlocks.filter(b => b.contentType === 'resolved').length;

  const summary = `Across ${enrichedBlocks.length} entries in ${categories.length} ${categories.length === 1 ? 'area' : 'areas'}, ${
    strongest.cat ? `your strongest ground is ${strongest.cat}` : 'you\'re building broad coverage'
  }. ${
    totalConfusions > 0
      ? `${totalConfusions} unresolved confusion${totalConfusions > 1 ? 's' : ''} need attention`
      : `no major confusions remain`
  }${
    totalResolved > 0 ? `, and you've resolved ${totalResolved} along the way.` : '.'
  }`;

  // Blind spots
  const blindSpots: string[] = [];

  if (weakest && weakest.weakness > 2) {
    blindSpots.push(
      `${weakest.cat}: ${weakest.blocks.filter(b => b.contentType === 'confusion').length} confusion${weakest.blocks.filter(b => b.contentType === 'confusion').length === 1 ? '' : 's'} unresolved here. Prioritize this area next.`
    );
  }

  const lowConf = enrichedBlocks.filter(b => (b.confidence || 5) <= 2 && b.contentType !== 'confusion');
  if (lowConf.length > 0) {
    blindSpots.push(
      `${lowConf.length} entr${lowConf.length === 1 ? 'y has' : 'ies have'} low confidence — your understanding is shallow. Try writing edge cases or examples for ${lowConf[0].category}.`
    );
  }

  const noEdgeCases = !enrichedBlocks.some(b => b.contentType === 'edgecase');
  if (noEdgeCases && enrichedBlocks.length > 5) {
    blindSpots.push(
      `No edge cases noted yet. Production-level understanding requires thinking about boundary conditions — null, empty, overflow, race conditions.`
    );
  }

  if (categories.length > 5) {
    blindSpots.push(
      `Knowledge is spread across ${categories.length} categories without much synthesis. Try writing one entry that connects two of your topics.`
    );
  }

  if (blindSpots.length === 0) {
    blindSpots.push('Your journal is well-balanced. Keep going — depth comes from sustained practice.');
  }

  // Generate assignment based on weakest area
  const targetCategory = weakest?.cat || categories[0];
  const targetTopic = targetCategory.split(' / ')[1] || targetCategory.split(' / ')[0];

  const assignment = {
    title: `Deep-dive: ${targetTopic}`,
    description: `Write a small program that demonstrates a key concept from "${targetCategory}". Specifically: include one normal case, one edge case, and a comment explaining the trade-off you're making. Focus on the area where you've shown the most uncertainty — this is where the biggest learning gains are.`,
    estimatedMinutes: 20,
  };

  // Build connections
  const connections: SynthesisResult['connections'] = [];
  for (const block of enrichedBlocks) {
    if (block.influencedBy && block.influencedBy.length > 0) {
      for (const fromId of block.influencedBy.slice(0, 1)) {
        const fromBlock = enrichedBlocks.find(b => b.id === fromId);
        if (fromBlock) {
          connections.push({
            from: fromId,
            to: block.id,
            explanation: `Both relate to ${block.category}`,
          });
        }
      }
    }
  }

  return {
    summary,
    blindSpots,
    assignment,
    connections: connections.slice(0, 10),
    generatedAt: Date.now(),
  };
}

// ============= Ghost notes =============
export async function generateGhostNote(blocks: CodeJournalBlock[]): Promise<GhostNote | null> {
  const enriched = blocks.filter(b => !b.isEnriching && !b.isError);
  if (enriched.length < 5) return null;

  const categories = new Set(enriched.map(b => b.category));
  if (categories.size < 2) return null;

  const recent = enriched.slice(0, 4);
  const cats = Array.from(categories);

  const suggestions = [
    `You've covered both ${cats[0]} and ${cats[1]} — what pattern do they share? Synthesizing this would deepen your grasp on both.`,
    `Your recent entries on ${recent[0]?.category || 'the current topic'} stay at the surface. Try writing one entry about an edge case or failure mode.`,
    `You've explored ${cats[0]} extensively but rarely mention how it interacts with related concepts. What about exploring that boundary?`,
  ];

  const pick = suggestions[enriched.length % suggestions.length];

  return {
    id: `ghost_${Date.now()}`,
    text: pick,
    contentType: 'hypothesis',
    category: 'Synthesis',
    reasoning: `Generated from ${enriched.length} entries across ${categories.size} categories.`,
    createdAt: Date.now(),
  };
}
