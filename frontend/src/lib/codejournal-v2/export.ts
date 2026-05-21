import type { ContentType } from "./content-types"
import type { ConfidenceHistoryEntry } from "@/components/codejournal-v2/tile-card"

// Escape characters that would break markdown table cells
const mdCell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ")

export interface ExportBlock {
  id: string
  text: string
  contentType: ContentType
  category?: string
  annotation?: string
  confidence?: number | null
  confidenceHistory?: ConfidenceHistoryEntry[]
  sources?: { url: string; title: string; siteName: string }[]
  isPinned?: boolean
  timestamp?: number
}

// ── Type ordering — research-logical flow ─────────────────────────────────────

const TYPE_ORDER: ContentType[] = [
  "concept",
  "confusion",
  "edgecase",
  "synthesis",
  "conflict",
  "assignment",
  "resolved",
  "definition",
  "hypothesis",
]

const TYPE_META: Record<ContentType, { heading: string; emoji: string; description: string }> = {
  concept:    { heading: "Concepts Learned", emoji: "📚", description: "Core programming concepts understood" },
  confusion:  { heading: "Confusions",       emoji: "🤔", description: "Areas of uncertainty or misunderstanding" },
  edgecase:   { heading: "Edge Cases",       emoji: "⚡", description: "Boundary conditions and special cases discovered" },
  synthesis:  { heading: "Syntheses",        emoji: "🔗", description: "Connections made between concepts" },
  conflict:   { heading: "Conflicts",        emoji: "⚔️",  description: "Contradictory information or mental model clashes" },
  assignment: { heading: "Assignments",      emoji: "✅", description: "Tasks and challenges" },
  resolved:   { heading: "Resolved",         emoji: "✓",  description: "Previously confusing topics now understood" },
  definition: { heading: "Definitions",      emoji: "📖", description: "Terms and patterns defined" },
  hypothesis: { heading: "Hypotheses",       emoji: "💡", description: "Untested theories about how things work" },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(ts?: number): string {
  const d = ts ? new Date(ts) : new Date()
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function formatTime(ts?: number): string {
  if (!ts) return ""
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

/** Five-block filled/empty bar + percentage */
function confidenceBar(c: number): string {
  const pct    = Math.round(c * 100)
  const filled = Math.round(c * 5)
  const bar    = "█".repeat(filled) + "░".repeat(5 - filled)
  return `${bar} ${pct}%`
}

/** Anchor-safe slug for TOC links */
function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50)
}

// ── Confidence Overview Helper ────────────────────────────────────────────────

/**
 * Generate a "Confidence Overview" markdown section from export blocks.
 * Groups blocks by category, computes average confidence per category,
 * sorts from lowest to highest, and displays a visual bar per category.
 *
 * Requirements: 6.1, 6.4
 */
export function confidenceOverviewSection(blocks: ExportBlock[]): string[] {
  // Filter blocks that have non-null confidence and a category
  const relevant = blocks.filter(
    (b): b is ExportBlock & { confidence: number; category: string } =>
      b.confidence != null && !!b.category
  )

  if (relevant.length === 0) return []

  // Group by category
  const categoryMap = new Map<string, number[]>()
  for (const block of relevant) {
    const scores = categoryMap.get(block.category) || []
    scores.push(block.confidence)
    categoryMap.set(block.category, scores)
  }

  // Compute average per category and sort lowest to highest
  const categories = Array.from(categoryMap.entries()).map(([category, scores]) => ({
    category,
    avg: scores.reduce((sum, s) => sum + s, 0) / scores.length,
    count: scores.length,
  }))
  categories.sort((a, b) => a.avg - b.avg)

  // Build markdown lines
  const lines: string[] = []
  lines.push(`## Confidence Overview`)
  lines.push(``)

  for (const { category, avg, count } of categories) {
    const rounded = Math.round(avg)
    const filled = Math.min(5, Math.max(0, rounded))
    const bar = "█".repeat(filled) + "░".repeat(5 - filled)
    const entryLabel = count === 1 ? "entry" : "entries"
    lines.push(`- **${category}**: ${bar} ${rounded}/5 *(${count} ${entryLabel})*`)
  }

  lines.push(``)
  return lines
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Export a project as a richly-formatted Markdown document.
 * Uses YAML front matter, a table of contents, grouped sections,
 * tables for claims, task lists, blockquotes, inline code, and source links
 * so the output renders well in GitHub, Obsidian, Notion, and any LLM context.
 */
export function exportToMarkdown(projectName: string, blocks: ExportBlock[]): string {
  if (blocks.length === 0) {
    return [
      `# ${projectName}`,
      ``,
      `> _No nodes yet._`,
      ``,
      `---`,
      `*Generated by [CodeJournal](https://codejournal.space)*`,
    ].join("\n")
  }

  // Group by type
  const byType = new Map<ContentType, ExportBlock[]>()
  for (const block of blocks) {
    const t = block.contentType || "concept"
    if (!byType.has(t)) byType.set(t, [])
    byType.get(t)!.push(block)
  }

  const presentTypes = TYPE_ORDER.filter(t => (byType.get(t)?.length ?? 0) > 0)
  const date         = formatDate(blocks[0]?.timestamp)
  const pinned       = blocks.filter(b => b.isPinned)

  const lines: string[] = []

  // ── YAML front matter ─────────────────────────────────────────────────────
  lines.push(`---`)
  lines.push(`title: "${projectName}"`)
  lines.push(`date: "${date}"`)
  lines.push(`nodes: ${blocks.length}`)
  lines.push(`types: [${presentTypes.map(t => `"${t}"`).join(", ")}]`)
  lines.push(`source: CodeJournal — https://codejournal.space`)
  lines.push(`---`)
  lines.push(``)

  // ── Title block ───────────────────────────────────────────────────────────
  lines.push(`# ${projectName}`)
  lines.push(``)
  lines.push(`> **Generated by [CodeJournal](https://codejournal.space)** · ${date} · ${blocks.length} node${blocks.length !== 1 ? "s" : ""}`)
  lines.push(``)

  // ── Stats table ───────────────────────────────────────────────────────────
  lines.push(`## Overview`)
  lines.push(``)
  lines.push(`| Type | Count |`)
  lines.push(`|------|-------|`)
  for (const type of presentTypes) {
    const { emoji, heading } = TYPE_META[type]
    lines.push(`| ${emoji} ${heading} | ${byType.get(type)!.length} |`)
  }
  lines.push(``)

  // ── Pinned notes callout (if any) ─────────────────────────────────────────
  if (pinned.length > 0) {
    lines.push(`> **📌 Pinned nodes**`)
    for (const b of pinned) {
      lines.push(`> - ${b.text}`)
    }
    lines.push(``)
  }

  // ── Table of contents ─────────────────────────────────────────────────────
  lines.push(`## Contents`)
  lines.push(``)
  for (const type of presentTypes) {
    const { emoji, heading } = TYPE_META[type]
    const count = byType.get(type)!.length
    lines.push(`- [${emoji} ${heading}](#${slug(heading)}) *(${count})*`)
  }
  lines.push(``)

  // ── Sections ──────────────────────────────────────────────────────────────
  for (const type of presentTypes) {
    const group = byType.get(type)!
    const { emoji, heading, description } = TYPE_META[type]

    lines.push(`---`)
    lines.push(``)
    lines.push(`## ${emoji} ${heading}`)
    lines.push(``)
    lines.push(`*${description}*`)
    lines.push(``)

    // Confusions → highlighted for attention
    if (type === "confusion") {
      for (const block of group) {
        lines.push(`### ${block.text}`)
        lines.push(``)
        if (block.category) lines.push(`- Category: \`${block.category}\``)
        if (block.annotation) {
          lines.push(`> ${block.annotation.replace(/\n/g, " ")}`)
        }
        lines.push(``)
      }
      continue
    }

    // Assignments → GFM task list
    if (type === "assignment") {
      for (const block of group) {
        lines.push(`- [ ] **${block.text}**`)
        if (block.category) lines.push(`  - Category: \`${block.category}\``)
        if (block.annotation) {
          lines.push(`  - > ${block.annotation.replace(/\n/g, " ")}`)
        }
      }
      lines.push(``)
      continue
    }

    // Edge cases → blockquote style for emphasis
    if (type === "edgecase") {
      for (const block of group) {
        lines.push(`> ⚡ ${block.text}`)
        if (block.category)  lines.push(`>`)
        if (block.category)  lines.push(`> — \`${block.category}\``)
        if (block.annotation) {
          lines.push(`>`)
          lines.push(`> *${block.annotation.replace(/\n/g, " ")}*`)
        }
        lines.push(``)
      }
      continue
    }

    // All other types → heading + metadata + annotation
    for (const block of group) {
      lines.push(`### ${block.text}`)
      lines.push(``)

      // Metadata row
      const meta: string[] = []
      if (block.category)  meta.push(`**Category:** \`${block.category}\``)
      if (block.timestamp) meta.push(`**Added:** ${formatDate(block.timestamp)} ${formatTime(block.timestamp)}`)
      if (block.isPinned)  meta.push(`📌 *Pinned*`)
      if (meta.length > 0) {
        lines.push(meta.join(" · "))
        lines.push(``)
      }

      // AI annotation as blockquote
      if (block.annotation) {
        lines.push(`> **AI Annotation**`)
        for (const l of block.annotation.split("\n")) {
          lines.push(`> ${l}`)
        }
        lines.push(``)
      }

      // Sources as a nested list
      if (block.sources && block.sources.length > 0) {
        lines.push(`**Sources**`)
        lines.push(``)
        for (const s of block.sources) {
          const label = s.title || s.siteName || s.url
          lines.push(`- [${label}](${s.url})${s.siteName ? ` *(${s.siteName})*` : ""}`)
        }
        lines.push(``)
      }
    }
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  lines.push(`---`)
  lines.push(``)
  lines.push(`*Generated by [CodeJournal](https://codejournal.space) · ${date}*`)
  lines.push(``)

  return lines.join("\n")
}

// ── Download / clipboard helpers ─────────────────────────────────────────────

/** Trigger a browser download of a .md file. */
export function downloadMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Copy content to clipboard. Returns true on success. */
export async function copyToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content)
    return true
  } catch {
    return false
  }
}

// ── Knowledge Doc Export ─────────────────────────────────────────────────────

export interface KnowledgeDocData {
  projectName: string
  blocks: ExportBlock[]
  synthesis?: string
  blindSpots?: string[]
  assignment?: string
  connections?: Array<{ from: string; to: string; reason: string }>
}

/**
 * Export a comprehensive knowledge document with synthesis, blind spots,
 * assignment, and connections in Obsidian-compatible format.
 */
export function exportToKnowledgeDoc(data: KnowledgeDocData): string {
  const { projectName, blocks, synthesis, blindSpots, assignment, connections } = data
  const date = formatDate(blocks[0]?.timestamp)
  
  const lines: string[] = []

  // ── Header ────────────────────────────────────────────────────────────────
  lines.push(`# My Programming Knowledge — CodeJournal Export`)
  lines.push(``)
  lines.push(`*Generated on ${date}*`)
  lines.push(``)
  lines.push(`---`)
  lines.push(``)

  // ── Knowledge Summary ─────────────────────────────────────────────────────
  lines.push(`## Knowledge Summary`)
  lines.push(``)
  if (synthesis) {
    lines.push(synthesis)
  } else {
    lines.push(`*Run the synthesizer to generate your knowledge summary*`)
  }
  lines.push(``)
  lines.push(`---`)
  lines.push(``)

  // ── Confidence Overview ───────────────────────────────────────────────────
  const confidenceLines = confidenceOverviewSection(blocks)
  if (confidenceLines.length > 0) {
    lines.push(...confidenceLines)
    lines.push(`---`)
    lines.push(``)
  }

  // ── Blind Spots ───────────────────────────────────────────────────────────
  lines.push(`## Blind Spots Identified`)
  lines.push(``)
  if (blindSpots && blindSpots.length > 0) {
    blindSpots.forEach(spot => {
      lines.push(`- ${spot}`)
    })
  } else {
    lines.push(`*Run the synthesizer to identify blind spots*`)
  }
  lines.push(``)
  lines.push(`---`)
  lines.push(``)

  // ── Today's Assignment ────────────────────────────────────────────────────
  lines.push(`## Today's Assignment`)
  lines.push(``)
  if (assignment) {
    lines.push(assignment)
  } else {
    lines.push(`*Run the synthesizer to generate your personalized assignment*`)
  }
  lines.push(``)
  lines.push(`---`)
  lines.push(``)

  // ── Concepts Learned ──────────────────────────────────────────────────────
  lines.push(`## Concepts Learned`)
  lines.push(``)
  
  // Sort by timestamp (most recent first)
  const sortedBlocks = [...blocks].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  
  sortedBlocks.forEach(block => {
    lines.push(`### ${block.text}`)
    lines.push(``)
    lines.push(`- **Type:** ${block.contentType}`)
    if (block.category) {
      lines.push(`- **Category:** ${block.category}`)
    }
    if (block.confidence != null) {
      const filled = Math.min(5, Math.max(0, Math.round(block.confidence)))
      const bar = "█".repeat(filled) + "░".repeat(5 - filled)
      lines.push(`- **Confidence:** ${bar} ${block.confidence}/5`)
    }
    if (block.confidenceHistory && block.confidenceHistory.length > 1) {
      const trend = block.confidenceHistory.map(h => h.score).join(" → ")
      lines.push(`- **Confidence Trend:** ${trend}`)
    }
    if (block.timestamp) {
      lines.push(`- **Date:** ${formatDate(block.timestamp)} ${formatTime(block.timestamp)}`)
    }
    lines.push(``)
    
    if (block.annotation) {
      lines.push(`**AI annotation:**`)
      lines.push(``)
      lines.push(`> ${block.annotation.replace(/\n/g, '\n> ')}`)
      lines.push(``)
    }
    
    if (block.sources && block.sources.length > 0) {
      lines.push(`**Sources:**`)
      lines.push(``)
      block.sources.forEach(s => {
        lines.push(`- [${s.title || s.siteName || s.url}](${s.url})`)
      })
      lines.push(``)
    }
  })
  
  lines.push(`---`)
  lines.push(``)

  // ── Connections Found ─────────────────────────────────────────────────────
  lines.push(`## Connections Found`)
  lines.push(``)
  if (connections && connections.length > 0) {
    connections.forEach(conn => {
      lines.push(`- [[${conn.from}]] → [[${conn.to}]]: ${conn.reason}`)
    })
  } else {
    lines.push(`*Run the synthesizer to discover connections between concepts*`)
  }
  lines.push(``)
  lines.push(`---`)
  lines.push(``)

  // ── Raw Journal Entries ───────────────────────────────────────────────────
  lines.push(`## Raw Journal Entries`)
  lines.push(``)
  lines.push(`*Chronological order*`)
  lines.push(``)
  
  sortedBlocks.forEach(block => {
    const timestamp = block.timestamp ? `${formatDate(block.timestamp)} ${formatTime(block.timestamp)}` : 'No date'
    lines.push(`**${timestamp}** — ${block.text}`)
    lines.push(``)
  })
  
  lines.push(`---`)
  lines.push(``)
  lines.push(`*This document was generated by CodeJournal. The connections and assignments are unique to your learning journey.*`)
  lines.push(``)

  return lines.join("\n")
}

/** Download knowledge doc as .md file */
export function downloadKnowledgeDoc(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

