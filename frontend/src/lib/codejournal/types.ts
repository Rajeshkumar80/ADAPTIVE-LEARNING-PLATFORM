/**
 * CodeJournal types — programming-specific knowledge journal
 */

export type ContentType =
  | 'concept'
  | 'confusion'
  | 'edgecase'
  | 'synthesis'
  | 'conflict'
  | 'assignment'
  | 'resolved'
  | 'definition'
  | 'hypothesis';

export interface SubTask {
  id: string;
  text: string;
  done: boolean;
}

export interface Source {
  title: string;
  url: string;
}

export interface CodeJournalBlock {
  id: string;
  text: string;
  timestamp: number;

  // AI metadata
  contentType: ContentType;
  category: string;        // e.g. "JavaScript / Closures"
  annotation?: string;     // 2-4 sentence AI insight
  confidence?: 1 | 2 | 3 | 4 | 5 | null;
  influencedBy?: string[]; // IDs of related blocks
  sources?: Source[];      // Web grounding citations
  subTasks?: SubTask[];    // For assignments
  isPinned?: boolean;

  // UI state (transient)
  isEnriching?: boolean;
  isError?: boolean;
  statusText?: string;
}

export interface GhostNote {
  id: string;
  text: string;
  contentType: ContentType;
  category: string;
  reasoning: string;
  createdAt: number;
}

export interface SynthesisResult {
  summary: string;
  blindSpots: string[];
  assignment: {
    title: string;
    description: string;
    estimatedMinutes: number;
  };
  connections: Array<{
    from: string;       // block id
    to: string;         // block id
    explanation: string;
  }>;
  generatedAt: number;
}

export interface CodeJournalProject {
  id: string;
  name: string;
  blocks: CodeJournalBlock[];
  ghostNotes: GhostNote[];
  collapsedCategories: string[];
  synthesis?: SynthesisResult;
  createdAt: number;
  updatedAt: number;
}

export const CONTENT_TYPES: Record<ContentType, { label: string; icon: string; color: string; bg: string; border: string }> = {
  concept: { label: 'Concept', icon: '📚', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  confusion: { label: 'Confusion', icon: '❓', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  edgecase: { label: 'Edge Case', icon: '⚡', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  synthesis: { label: 'Synthesis', icon: '✨', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  conflict: { label: 'Conflict', icon: '⚖️', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
  assignment: { label: 'Assignment', icon: '✅', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  resolved: { label: 'Resolved', icon: '✓', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
  definition: { label: 'Definition', icon: '📖', color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
  hypothesis: { label: 'Hypothesis', icon: '💡', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
};

export const CONTENT_TYPE_LIST: ContentType[] = [
  'concept', 'confusion', 'edgecase', 'synthesis',
  'conflict', 'assignment', 'resolved', 'definition', 'hypothesis',
];
