/**
 * CodeJournal types — programming-specific knowledge journal
 */

import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  HelpCircle,
  Zap,
  Sparkles,
  GitMerge,
  ListTodo,
  CheckCircle2,
  BookMarked,
  Lightbulb,
} from 'lucide-react';

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

interface ContentTypeConfig {
  label: string;
  Icon: LucideIcon;
  color: string;       // text color
  bg: string;          // soft background
  border: string;      // border accent
  iconColor: string;   // pure icon color (hex-friendly)
}

export const CONTENT_TYPES: Record<ContentType, ContentTypeConfig> = {
  concept: {
    label: 'Concept',
    Icon: BookOpen,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    iconColor: '#4f46e5',
  },
  confusion: {
    label: 'Confusion',
    Icon: HelpCircle,
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    iconColor: '#ea580c',
  },
  edgecase: {
    label: 'Edge Case',
    Icon: Zap,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    iconColor: '#9333ea',
  },
  synthesis: {
    label: 'Synthesis',
    Icon: Sparkles,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    iconColor: '#4338ca',
  },
  conflict: {
    label: 'Conflict',
    Icon: GitMerge,
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: '#dc2626',
  },
  assignment: {
    label: 'Assignment',
    Icon: ListTodo,
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    iconColor: '#0891b2',
  },
  resolved: {
    label: 'Resolved',
    Icon: CheckCircle2,
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    iconColor: '#16a34a',
  },
  definition: {
    label: 'Definition',
    Icon: BookMarked,
    color: 'text-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    iconColor: '#475569',
  },
  hypothesis: {
    label: 'Hypothesis',
    Icon: Lightbulb,
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    iconColor: '#ca8a04',
  },
};

export const CONTENT_TYPE_LIST: ContentType[] = [
  'concept', 'confusion', 'edgecase', 'synthesis',
  'conflict', 'assignment', 'resolved', 'definition', 'hypothesis',
];
