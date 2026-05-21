import type { ContentType } from "./content-types"

export function detectContentType(text: string): ContentType {
  const trimmed = text.trim()
  const lower = trimmed.toLowerCase()

  // Confusion: question marks, uncertainty language
  if (
    trimmed.endsWith("?") ||
    /\b(i don'?t understand|confused about|not sure why|why does|how come|what happens when)\b/i.test(lower)
  ) {
    return "confusion"
  }

  // Edge case: boundary conditions, special cases
  if (
    /\b(edge case|boundary|corner case|what happens when|what if.*null|what if.*empty|what if.*undefined|off.by.one|overflow)\b/i.test(lower)
  ) {
    return "edgecase"
  }

  // Definition: defining terms or patterns
  if (
    /\b(is defined as|means|refers to|is a pattern|is when|is the process of)\b/i.test(lower)
  ) {
    return "definition"
  }

  // Hypothesis: untested theories
  if (
    /\b(i think|maybe|what if|could it be|my theory|i bet|i assume|probably because|i guess)\b/i.test(lower)
  ) {
    return "hypothesis"
  }

  // Conflict: contradictions, mental model clashes
  if (
    /\b(but|contradicts|however|on the other hand|doesn'?t match|inconsistent|conflicting|yet.*says)\b/i.test(lower)
  ) {
    return "conflict"
  }

  // Assignment: tasks, challenges, things to implement
  if (
    /\b(todo|challenge|implement|build|write a|create a|try to|exercise|practice|assignment)\b/i.test(lower)
  ) {
    return "assignment"
  }

  // Resolved: figured something out
  if (
    /\b(figured out|solved|the answer is|now i understand|turns out|finally got|it works because|the fix is)\b/i.test(lower)
  ) {
    return "resolved"
  }

  // Synthesis: connecting multiple concepts
  if (
    /\b(connects to|relates to|putting it together|the relationship between|combined with|this means that.*and)\b/i.test(lower)
  ) {
    return "synthesis"
  }

  // Default: concept (student learned something)
  return "concept"
}

