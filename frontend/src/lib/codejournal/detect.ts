/**
 * Heuristic content type detector — runs instantly without AI.
 * Aggressive pattern-matching to correctly classify entries.
 */

import { ContentType, CONTENT_TYPE_LIST } from './types';

interface DetectionResult {
  type: ContentType;
  confidence: 'high' | 'medium' | 'low';
}

export function detectContentType(text: string): DetectionResult {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // ===== Inline tag detection (highest priority) =====
  for (const ct of CONTENT_TYPE_LIST) {
    if (lower.startsWith(`#${ct}`)) {
      return { type: ct, confidence: 'high' };
    }
  }

  // ===== Confusion patterns (high priority) =====
  // Words like: confusion, confused, doubt, doute, don't understand, unclear, struggle
  if (
    /\b(confus|doubt|doute|don'?t (understand|get|know)|not sure|unclear|stuck|struggling?|struggle)\b/i.test(lower)
  ) {
    return { type: 'confusion', confidence: 'high' };
  }

  // Question forms
  if (
    trimmed.endsWith('?') ||
    /^(why|how come|what is|what does|what's|how does|when does|where does)/i.test(lower) ||
    /\b(why|how) (does|do|is|are|did)\b/i.test(lower)
  ) {
    return { type: 'confusion', confidence: 'high' };
  }

  // ===== Resolved patterns =====
  if (
    /\b(now i (understand|get it|see)|finally (got|understood|realized)|figured (it )?out|aha|eureka|makes sense now|cleared up|resolved)\b/i.test(lower)
  ) {
    return { type: 'resolved', confidence: 'high' };
  }

  // ===== Hypothesis patterns =====
  if (
    /\b(i (think|believe|suspect|guess)|maybe|probably|perhaps|hypothesis|what if|might be|could be|seems like|i bet)\b/i.test(lower)
  ) {
    return { type: 'hypothesis', confidence: 'high' };
  }

  // ===== Edge case patterns =====
  if (
    /\b(edge case|edge-case|boundary|corner case|null pointer|undefined|empty (array|string|input)|overflow|underflow|race condition|deadlock|memory leak|infinite loop|off.by.one)\b/i.test(lower)
  ) {
    return { type: 'edgecase', confidence: 'high' };
  }

  // ===== Synthesis patterns =====
  if (
    /\b(connects? to|related to|similar to|both .* (share|use|have)|like .* (also|too)|reminds me of|analogous to|same as|parallels)\b/i.test(lower)
  ) {
    return { type: 'synthesis', confidence: 'high' };
  }

  // ===== Conflict patterns =====
  if (
    /\b(but actually|contradicts?|conflicts? with|wait,? (but|that's wrong)|that's incorrect|opposite of|inconsistent|paradox)\b/i.test(lower)
  ) {
    return { type: 'conflict', confidence: 'high' };
  }

  // ===== Assignment patterns =====
  if (
    /\b(todo:|need to (build|implement|create|write|practice|learn)|will (build|implement|practice)|assignment|exercise|practice problem|challenge:|gonna build)\b/i.test(lower)
  ) {
    return { type: 'assignment', confidence: 'high' };
  }

  // ===== Definition patterns =====
  // "X is Y", "X means Y", "X = Y", "X: Y is..."
  if (
    /^([A-Z][\w\s\-]+|[a-z]+[\w\s]+)\s+(is|means|refers to|denotes|=|≡|stands for)\s+/i.test(trimmed) ||
    /^[A-Z][\w\-]+:\s+/.test(trimmed)
  ) {
    return { type: 'definition', confidence: 'medium' };
  }

  // ===== Topic mentions that suggest concept (medium confidence) =====
  // If it mentions specific tech topics with declarative phrasing
  if (
    /\b(dsa|ml|machine learning|algorithm|data structure|database|sql|react|javascript|python|java|c\+\+|operating system|network)\b/i.test(lower) &&
    !lower.endsWith('?')
  ) {
    return { type: 'concept', confidence: 'medium' };
  }

  // ===== URL → concept =====
  if (/^https?:\/\//i.test(trimmed)) {
    return { type: 'concept', confidence: 'low' };
  }

  // ===== Short text (< 4 words) without clear pattern → low confidence concept =====
  if (trimmed.split(/\s+/).length < 4) {
    return { type: 'concept', confidence: 'low' };
  }

  // ===== Default =====
  return { type: 'concept', confidence: 'low' };
}

export function stripInlineTag(text: string): string {
  const trimmed = text.trim();
  for (const ct of CONTENT_TYPE_LIST) {
    const tag = `#${ct}`;
    if (trimmed.toLowerCase().startsWith(tag)) {
      return trimmed.slice(tag.length).trim();
    }
  }
  return trimmed;
}
