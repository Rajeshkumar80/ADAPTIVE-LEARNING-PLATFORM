/**
 * CodeJournal storage — localStorage with rolling backup.
 */

import { CodeJournalProject, CONTENT_TYPES, ContentType, CONTENT_TYPE_LIST } from './types';

const PRIMARY_KEY = 'codejournal-projects';
const BACKUP_KEY = 'codejournal-backup';
const ACTIVE_KEY = 'codejournal-active-project';

/** Ensure every project has all required fields (handles old localStorage data) */
function normalizeProject(p: CodeJournalProject): CodeJournalProject {
  return {
    ...p,
    blocks: (p.blocks ?? []).map(b => ({
      ...b,
      // If contentType is missing or unknown, fall back to 'concept'
      contentType: (CONTENT_TYPE_LIST.includes(b.contentType as ContentType)
        ? b.contentType
        : 'concept') as ContentType,
      influencedBy: b.influencedBy ?? [],
    })),
    ghostNotes: p.ghostNotes ?? [],
    collapsedCategories: p.collapsedCategories ?? [],
  };
}

export function loadProjects(): CodeJournalProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(PRIMARY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(normalizeProject) : [];
    }
  } catch (e) {
    console.warn('Primary storage corrupt, trying backup', e);
  }

  try {
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      const parsed = JSON.parse(backup);
      return Array.isArray(parsed) ? parsed.map(normalizeProject) : [];
    }
  } catch (e) {
    console.warn('Backup also corrupt', e);
  }

  return [];
}

export function saveProjects(projects: CodeJournalProject[]) {
  if (typeof window === 'undefined') return;

  try {
    const json = JSON.stringify(projects);
    localStorage.setItem(PRIMARY_KEY, json);
    localStorage.setItem(BACKUP_KEY, json);
  } catch (e) {
    console.error('Storage save failed', e);
  }
}

export function getActiveProjectId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProjectId(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function newProjectId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function newBlockId(): string {
  return Math.random().toString(36).slice(2, 12);
}

export function createProject(name: string): CodeJournalProject {
  const now = Date.now();
  return {
    id: newProjectId(),
    name,
    blocks: [],
    ghostNotes: [],
    collapsedCategories: [],
    createdAt: now,
    updatedAt: now,
  };
}
