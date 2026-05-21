# CodeJournal

> **The first AI-powered programming learning journal that learns the learner.**

CodeJournal turns your raw, unstructured daily programming notes into a living knowledge graph — automatically classifying what you write, annotating it with AI insights, detecting your blind spots, and generating personalized coding challenges to target exactly where you're weakest.

[![Live App](https://img.shields.io/badge/Live_App-codejournal.space-orange?style=flat-square)](https://codejournal.space)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## Table of Contents

- [What Is CodeJournal?](#what-is-codejournal)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [AI Configuration](#ai-configuration)
- [Content Types](#content-types)
- [Views](#views)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [File Format](#file-format)
- [Export Options](#export-options)
- [Architecture Overview](#architecture-overview)
- [Contributing](#contributing)
- [License](#license)

---

## What Is CodeJournal?

Most learning tools either forget you (ChatGPT), store without thinking (Notion/Obsidian), require finished documents (NotebookLM), or never generate actionable challenges. CodeJournal is different.

You write whatever you learned today — a concept, a confusion, an edge case you discovered — in plain language. The AI automatically:

1. **Classifies** the entry into one of 9 programming-specific knowledge types
2. **Annotates** it with insights you didn't explicitly state (pitfalls, deeper implications, related concepts)
3. **Scores** your confidence based on writing quality (1–5 scale)
4. **Connects** it to your other entries, building a persistent knowledge graph
5. **Synthesizes** across all your entries to find blind spots and generate a personalized 15-minute coding challenge

The result is a visual, growing canvas of your programming knowledge that gets smarter every day — and exports as a complete knowledge document.

---

## Key Features

### 🧠 AI-Powered Auto-Enrichment
Every entry is automatically enriched by the AI within seconds:
- **Type classification** — concept, confusion, edge case, synthesis, conflict, assignment, resolved, definition, or hypothesis
- **Topic categorization** — the AI infers which programming domain the entry belongs to (e.g., "Async JavaScript", "Big-O Complexity")
- **Annotation** — a 2–4 sentence insight surfacing what the student didn't explicitly state
- **Confidence score** — a 1–5 rating of how well the student understands the concept, based on writing quality
- **Relational links** — the AI identifies which existing entries this new one connects to

### 🔍 Blind Spot Detection & Synthesis
After 3+ entries, the Synthesizer reads everything you've written and produces:
- A **knowledge summary** connecting themes across all your entries
- **Blind spots** — specific gaps in understanding detected from how you wrote
- A **targeted assignment** — a concrete 15-minute coding challenge targeting your weakest area
- **Concept connections** — links between entries with explanations

### 👻 Ghost Notes
An AI-generated "AI-hypothesizes" panel that quietly generates synthesis insights in the background as you accumulate entries. Ghost notes appear automatically when you have 5+ enriched entries across 2+ categories. You can claim them (turning them into real entries) or dismiss them.

### 📊 Three Views
- **Tiling View** — scrollable card wall, grouped by category with collapse support
- **Kanban View** — status-board layout organized by content type
- **Graph View** — force-directed D3.js graph showing concept relationships and synthesis connections

### 📁 Multi-Project Support
Manage multiple learning sessions (projects) simultaneously. Each project has its own:
- Entry canvas and knowledge graph
- Ghost notes history
- Collapsible category groups
- Export files

### 💾 Persistent & Resilient Storage
- All data lives in `localStorage` — no account, no server, no sign-up
- Silent rolling backup key (`codejournal-backup`) prevents data loss from storage corruption
- 20-snapshot undo ring per project (`⌘Z`)
- Automatic migration from the legacy `nodepad-*` localStorage keys

### 🌍 Multilingual Support
The AI responds in the language of your entry. Supported scripts include Arabic (with RTL font support via Vazirmatn), Hebrew, Chinese/Japanese/Korean, Russian, Hindi, and English.

### 🔗 URL Enrichment
Paste any URL as an entry. The AI fetches the page (server-side, CORS-safe) and annotates based on its actual content — title, description, and excerpt.

### 🌐 Web Grounding (for supported models)
For concept, definition, and hypothesis entries, the AI can optionally search the web to add verified source citations — powered by OpenRouter `:online` variants or OpenAI's search-preview models.

---

## How It Works

```
You type:  "closures in JavaScript capture variables by reference, not value"
                               ↓
[Instant heuristic]  Detected as: concept (high confidence → shown immediately)
                               ↓
[AI Enrichment ~2s]  contentType: "concept"
                     category:    "JavaScript / Closures"
                     annotation:  "This is subtle — the variable captured is the *binding*,
                                   not a snapshot of its value. This is why classic loop-counter
                                   bugs appear: `for(var i=0; ...)` closures all share the
                                   final value of `i`. The fix is `let` (block-scoped) or
                                   an IIFE to snapshot the value."
                     confidence:  3 (correct but surface-level)
                     influencedBy: [idx of your earlier "var vs let" entry]
```

After enough entries, the Synthesizer runs across your full canvas:
```
[Synthesis]  "You understand closures and async callbacks individually, but your entries
              suggest you haven't yet connected how closures inside Promises can leak
              references to large objects. Your confusion entries cluster around event
              loop timing."
[Blind Spot] "The relationship between the call stack, task queue, and microtask queue"
[Assignment] "Write a function that demonstrates why `Promise.resolve().then(...)` runs
              before `setTimeout(..., 0)`. Explain in a comment why this is."
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, webpack mode) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript 5.7](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Animations | [Framer Motion 11](https://www.framer.com/motion/) |
| Graph | [D3.js v7](https://d3js.org) (force simulation) |
| UI Primitives | [Radix UI](https://www.radix-ui.com) (full suite) |
| Component library | [shadcn/ui](https://ui.shadcn.com) |
| Command palette | [cmdk](https://cmdk.paco.me) |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | [Geist](https://vercel.com/font) + [Geist Mono](https://vercel.com/font) + [Vazirmatn](https://fonts.google.com/specimen/Vazirmatn) |
| AI API | OpenAI-compatible (OpenRouter / OpenAI / Z.ai / custom) |
| Analytics | [Umami](https://umami.is) (self-hosted compatible, optional) |

---

## Project Structure

```
codejournal/
├── app/
│   ├── api/
│   │   └── fetch-url/          # Server route: CORS-safe URL metadata fetcher
│   ├── globals.css             # Design tokens, CSS variables, Tailwind config
│   ├── layout.tsx              # Root layout (fonts, metadata, mobile wall)
│   ├── not-found.tsx           # Custom 404 page
│   ├── opengraph-image.tsx     # Dynamic OG image
│   └── page.tsx                # Main application (1200+ lines, all state lives here)
│
├── components/
│   ├── about-panel.tsx         # Help / guide panel (full feature reference)
│   ├── ghost-panel.tsx         # AI ghost notes sidebar panel
│   ├── graph-area.tsx          # D3 force-directed graph view
│   ├── graph-detail-panel.tsx  # Node detail panel shown on graph click
│   ├── intro-modal.tsx         # First-visit onboarding modal
│   ├── kanban-area.tsx         # Kanban board view
│   ├── kanban-minimap.tsx      # Minimap for kanban view
│   ├── mobile-wall.tsx         # Desktop-only gate (mobile not supported)
│   ├── project-sidebar.tsx     # Left sidebar: projects, settings, controls
│   ├── status-bar.tsx          # Bottom status bar (model, block count, etc.)
│   ├── synthesis-panel.tsx     # Right-side AI synthesis panel
│   ├── tile-card.tsx           # Individual entry card (the core UI unit)
│   ├── tile-index.tsx          # Alphabetical concept index panel
│   ├── tiling-area.tsx         # Tiling (scrollable card wall) view
│   ├── tiling-minimap.tsx      # Minimap overlay for tiling view
│   ├── vim-input.tsx           # Bottom input bar + ⌘K command palette
│   └── ui/                     # shadcn/ui generated primitives
│
├── lib/
│   ├── ai-enrich.ts            # Core AI enrichment: classify, annotate, score
│   ├── ai-ghost.ts             # Ghost note generation logic
│   ├── ai-settings.ts          # Provider/model config, useAISettings hook
│   ├── ai-synthesize.ts        # Synthesis, blind spots, assignment generation
│   ├── content-types.ts        # ContentType union + icon/color config
│   ├── detect-content-type.ts  # Heuristic pre-classifier (no AI needed)
│   ├── export.ts               # Markdown + knowledge doc export
│   ├── initial-data.ts         # Seed data shown on first visit
│   ├── nodepad-format.ts       # .codejournal file serialisation/parsing
│   └── utils.ts                # cn() helper, useModKey hook
│
├── public/                     # Static assets (icon, apple-icon, etc.)
├── next.config.mjs             # Next.js config (security headers, CSP)
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** 9+
- An API key from one of the supported providers (see [AI Configuration](#ai-configuration))

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/codejournal.git
cd codejournal

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

> **Note:** The build intentionally ignores TypeScript errors (`ignoreBuildErrors: true` in `next.config.mjs`) to allow rapid iteration. This is intentional — the app runs correctly at runtime.

---

## AI Configuration

CodeJournal calls AI APIs **directly from your browser** — your API key is stored in `localStorage` and never sent to any CodeJournal server. No data leaves your machine except to your chosen AI provider.

### Supported Providers

| Provider | Key Format | Free Tier | Notes |
|---|---|---|---|
| **OpenRouter** | `sk-or-v1-...` | ✅ Free models available | Recommended; access to all frontier models |
| **OpenAI** | `sk-...` | ❌ Paid only | Direct API; web search support |
| **Z.ai** | Custom | varies | GLM models |
| **Custom** | Any | — | Any OpenAI-compatible endpoint (Ollama, LM Studio, vLLM) |

### Setup

1. Click the **☰** sidebar button (top-left)
2. Open **Settings**
3. Select your provider and paste your API key
4. Choose a model — start with a free one if you're just exploring

### Recommended Models

| Model | Provider | Best For |
|---|---|---|
| Claude Sonnet 4.5 | OpenRouter | Best reasoning & annotation quality |
| GPT-4o | OpenRouter / OpenAI | Strong structured output; web grounding |
| Gemini 2.5 Pro | OpenRouter | Long context; web grounding |
| Nemotron 30B · Free | OpenRouter | No credits required; ~200 req/day |
| Nemotron 120B · Free | OpenRouter | Free MoE; better quality than 30B |

### Web Grounding

Enable **Web Grounding** in Settings to have the AI search the web for entries classified as `concept`, `definition`, or `hypothesis`. This adds real source citations. Requires a model with grounding support (GPT-4o, Gemini 2.5 Pro).

### Custom Endpoint

Any OpenAI-compatible API works. Enter your base URL in **Settings → Custom Base URL** (e.g., `http://localhost:11434/v1` for Ollama).

---

## Content Types

CodeJournal uses 9 programming-specific knowledge types. The AI classifies each entry automatically; you can also force a type using a `#tag` prefix.

| Type | Tag | Icon | Description |
|---|---|---|---|
| **concept** | `#concept` | 📚 | A programming concept you learned or explained |
| **confusion** | `#confusion` | ❓ | Something you're uncertain or confused about |
| **edgecase** | `#edgecase` | ⚡ | A boundary condition or special case you discovered |
| **synthesis** | `#synthesis` | ✨ | A connection you made between multiple concepts |
| **conflict** | `#conflict` | ⚖️ | Contradictory information or a mental model clash |
| **assignment** | `#assignment` | ✅ | A task or coding challenge (self-assigned or AI-generated) |
| **resolved** | `#resolved` | ✓ | A previous confusion you've now understood |
| **definition** | `#definition` | 📖 | A term, pattern, or principle you defined |
| **hypothesis** | `#hypothesis` | 💡 | An untested theory about how something works |

### Inline Tags

Force a type by prefixing your entry with `#typename`:

```
#hypothesis the V8 JIT compiler inlines functions shorter than 600 bytes
#confusion why does `typeof null` return "object"?
#edgecase Array.prototype.sort is not stable in older V8 versions
```

### Confidence Scoring (1–5)

The AI rates each entry on a 1–5 scale based on writing quality:

| Score | Meaning |
|---|---|
| **1** | Vague or incorrect terminology; minimal understanding |
| **2** | Partially correct; shallow; missing key aspects |
| **3** | Correct but surface-level; no edge cases mentioned |
| **4** | Clear, correct terminology; shows nuance and awareness |
| **5** | Deep understanding; identifies edge cases; explains trade-offs |

Confidence scores are tracked over time. When a confusion is resolved or an assignment sub-task completed, related concept entries in the same category receive a +1 confidence boost.

---

## Views

Switch views from the **⌘K** command palette or the status bar.

### Tiling View (default)
Scrollable card wall. Entries are grouped by AI-assigned category. Categories can be collapsed. A minimap overlay appears when you have many entries.

### Kanban View
Board layout organized by content type. Useful for tracking the status of your learning (confusions → resolved, assignments → done).

### Graph View
Force-directed graph powered by D3.js. Nodes are your entries; edges are drawn for:
- AI-detected `influencedBy` relationships (from enrichment)
- Synthesis connections (from the Synthesizer)

Node size reflects entry age; color reflects content type. Click any node to open its detail panel.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Submit entry (when input has text) |
| `⌘K` / `Ctrl+K` | Open command palette |
| `⌘Z` / `Ctrl+Z` | Undo last action (up to 20 steps per project) |
| `Escape` | Close command palette / ghost panel |
| `↑ ↓ ← →` | Navigate command palette grid |

### Command Palette Actions

| Command | Description |
|---|---|
| Tiling / Kanban / Graph | Switch view |
| Projects | Open project sidebar |
| New Project | Create a new learning session |
| Index | Open alphabetical concept index |
| Synthesis | Run the AI synthesizer |
| Export `.codejournal` | Download full project backup |
| Import `.codejournal` | Load a saved project |
| Export Markdown | Download formatted Markdown |
| Export Knowledge Doc | Download Obsidian-compatible knowledge document |
| Copy Markdown | Copy to clipboard |
| Clear Canvas | Delete all entries in current project |

---

## File Format

CodeJournal uses a proprietary `.codejournal` file format for full-fidelity project backup and portability.

### Structure

```json
{
  "version": 1,
  "exportedAt": 1747123456789,
  "project": {
    "id": "abc12345",
    "name": "My JavaScript Learning",
    "collapsedIds": [],
    "ghostNotes": [],
    "blocks": [
      {
        "id": "xyz98765",
        "text": "closures capture variables by reference",
        "timestamp": 1747123400000,
        "contentType": "concept",
        "category": "JavaScript / Closures",
        "annotation": "...",
        "confidence": 3,
        "influencedBy": ["abc11111"],
        "isPinned": false
      }
    ]
  }
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `version` | `1` | Schema version (for forward compatibility) |
| `exportedAt` | `number` | Unix timestamp of export |
| `project.blocks` | `CodeJournalBlock[]` | All entries with full AI metadata |
| `block.contentType` | `ContentType` | One of the 9 knowledge types |
| `block.confidence` | `1–5 \| null` | AI-assessed understanding score |
| `block.influencedBy` | `string[]` | Stable block IDs of related entries |
| `block.sources` | `Source[]` | Web grounding citations (if enabled) |
| `block.subTasks` | `SubTask[]` | Assignment checklist items |

Transient UI state (`isEnriching`, `isError`, `statusText`) is stripped on export and reset on import.

---

## Export Options

### 1. `.codejournal` File
Full-fidelity backup. Re-importable. Contains all AI metadata, connections, and confidence history.

### 2. Markdown Export
Rich, structured Markdown document with YAML front matter, table of contents, sections grouped by content type, and AI annotations. Renders well in GitHub, Obsidian, Notion, and as LLM context.

```markdown
---
title: "My JavaScript Learning"
date: "17 May 2026"
nodes: 23
types: ["concept", "confusion", "edgecase", "synthesis"]
source: CodeJournal — https://codejournal.space
---

# My JavaScript Learning

> **Generated by CodeJournal** · 17 May 2026 · 23 nodes

## Overview
| Type | Count |
|------|-------|
| 📚 Concepts Learned | 12 |
| 🤔 Confusions | 5 |
...
```

### 3. Knowledge Document Export
Obsidian-compatible export that includes your AI-generated synthesis, blind spots, assignment, and concept connections in `[[wiki-link]]` format. Ideal as a personal textbook chapter.

```markdown
# My Programming Knowledge — CodeJournal Export

## Knowledge Summary
You understand closures and async callbacks individually...

## Blind Spots Identified
- The relationship between the call stack and microtask queue
- Generator functions and their interaction with async/await

## Today's Assignment
Write a function that demonstrates why `Promise.resolve().then(...)` runs
before `setTimeout(..., 0)`...

## Connections Found
- [[Closures]] → [[Async Callbacks]]: Closures are what make async callbacks
  remember their lexical scope across the event loop boundary
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │          app/page.tsx                │   │
│  │  (All state: projects, blocks,       │   │
│  │   views, synthesis, ghost notes)     │   │
│  └──────────┬───────────────────────────┘   │
│             │                               │
│    ┌────────▼────────┐  ┌────────────────┐  │
│    │  VimInput        │  │ ProjectSidebar │  │
│    │  (entry bar +    │  │ (projects,     │  │
│    │   ⌘K palette)   │  │  settings)     │  │
│    └────────┬────────┘  └────────────────┘  │
│             │ addBlock()                     │
│    ┌────────▼────────────────────────────┐  │
│    │      lib/ai-enrich.ts               │  │
│    │  1. Heuristic pre-classify          │  │
│    │  2. URL fetch (via /api/fetch-url)  │  │
│    │  3. OpenAI-compatible API call      │  │
│    │  4. JSON parse + validate           │  │
│    │  5. Confidence propagation          │  │
│    └────────┬────────────────────────────┘  │
│             │                               │
│    ┌────────▼────────────────────────────┐  │
│    │  View Components                    │  │
│    │  TilingArea | KanbanArea | GraphArea│  │
│    └─────────────────────────────────────┘  │
│                                             │
│    localStorage                             │
│    ├── codejournal-projects (primary)       │
│    ├── codejournal-backup  (rolling copy)   │
│    └── codejournal-ai-settings              │
└─────────────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   AI Provider   │
              │  (OpenRouter /  │
              │   OpenAI / etc) │
              └─────────────────┘
```

### Key Design Decisions

**Client-side AI calls:** API calls are made directly from the browser using the user's stored key. No proxy server, no data storage, no authentication system needed.

**Optimistic UI:** Entries appear immediately with a heuristic-detected type. The AI enrichment updates them asynchronously (800ms debounce on edits).

**Stable block IDs:** All relational references use immutable block IDs, not text content. This means renames don't break connections.

**Recency-biased ghost context:** Ghost note generation uses a carefully built context window — 4 most-recent blocks + one representative per under-represented category + fill to 10 — to force cross-category diversity.

**Rolling backup:** Every state change writes to both `codejournal-projects` (primary) and `codejournal-backup` (fallback). If the primary key is ever corrupted or cleared, the load effect falls back to the backup automatically.

---

## Contributing

Contributions are welcome! Here's what would be most useful:

- **Bug reports** — open an issue with steps to reproduce
- **Model support** — adding new providers or models to `lib/ai-settings.ts`
- **New export formats** — adding to `lib/export.ts`
- **UI improvements** — new views, better mobile handling (currently desktop-only)
- **Accessibility** — keyboard navigation, screen reader support

### Development Notes

- All AI logic lives in `lib/ai-*.ts` — keep it isolated from UI
- State lives entirely in `app/page.tsx` — components receive props and callbacks
- The `blocks` ref pattern (`blocksRef`, `projectsRef`) avoids stale closures in async enrichment callbacks without triggering unnecessary re-renders
- Run `npm run lint` before submitting PRs

---

## License

[MIT](./LICENSE) — see the LICENSE file for full text.

---

## Acknowledgements

CodeJournal is built on top of the excellent open-source ecosystem:
[Next.js](https://nextjs.org) · [Radix UI](https://www.radix-ui.com) · [D3.js](https://d3js.org) · [Framer Motion](https://www.framer.com/motion/) · [Lucide](https://lucide.dev) · [cmdk](https://cmdk.paco.me) · [shadcn/ui](https://ui.shadcn.com)

---

*Built for programmers who want to learn smarter, not just harder.*
