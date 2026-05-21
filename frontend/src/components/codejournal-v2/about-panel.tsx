"use client"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { CONTENT_TYPE_CONFIG } from "@/lib/codejournal-v2/content-types"
import {
  Sparkles, Layers, Kanban, GitFork,
  Download, Brain, Zap, Target, BookOpen, Search
} from "lucide-react"
import { useModKey } from "@/lib/codejournal-v2/utils"

interface AboutPanelProps {
  open: boolean
  onClose: () => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 border-b border-border pb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-sm bg-primary/10 border border-primary/20 font-mono text-[10px] font-black text-primary">
        {n}
      </div>
      <div className="space-y-1 pt-0.5">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {keys.map((k, i) => (
          <kbd key={i} className="px-1.5 py-0.5 rounded-sm bg-secondary border border-border font-mono text-[10px] text-foreground">
            {k}
          </kbd>
        ))}
      </div>
    </div>
  )
}

const CONTENT_TYPE_HIGHLIGHTS = [
  "concept", "confusion", "edgecase", "hypothesis", "conflict", "assignment", "resolved", "definition"
] as const

export function AboutPanel({ open, onClose }: AboutPanelProps) {
  const mod = useModKey()
  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col gap-0 p-0 bg-card border-l border-border z-[200] overflow-hidden"
      >
        <SheetTitle className="sr-only">About CodeJournal</SheetTitle>

        {/* Header */}
        <div className="flex-shrink-0 px-8 pt-8 pb-6 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="font-mono text-xl font-black text-foreground tracking-tight">codejournal</h1>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
            An AI-powered programming learning journal that reads your daily entries, detects your weak points, and generates personalized coding assignments to strengthen your understanding.
          </p>
          <p className="mt-2 text-xs font-mono text-primary/60 uppercase tracking-widest">
            Write what you learned · AI finds your gaps · Get targeted assignments
          </p>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

          {/* The idea */}
          <Section title="The Problem We Solve">
            <p className="text-sm text-muted-foreground leading-relaxed">
              When learning programming, students often don't know what they don't know. They study concepts in isolation, miss connections between topics, and have no way to identify their blind spots. Traditional learning tools track completion — not comprehension.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">CodeJournal flips this.</strong> Instead of following a fixed curriculum, you write freely about what you learned each day. The AI reads across your entire history to find patterns, detect misconceptions, discover connections between concepts, and generate personalized assignments that target exactly where you're weakest.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              It's not a chatbot. It's not a course. It's a thinking tool that makes your learning visible and actionable.
            </p>
          </Section>

          {/* How it works */}
          <Section title="How It Works">
            <div className="space-y-3">
              {[
                { icon: BookOpen, title: "1. You write journal entries", desc: "Type what you learned today — a concept you grasped, something that confused you, an edge case you discovered, a hypothesis you formed. No structure required." },
                { icon: Brain, title: "2. AI classifies and annotates", desc: "Each entry is automatically classified into a programming-specific type (concept, confusion, edge case, etc.) and annotated with insights you didn't explicitly state — related concepts, common pitfalls, deeper implications." },
                { icon: Search, title: "3. Connections emerge", desc: "As entries accumulate, the AI discovers relationships between your concepts. The graph view shows how your knowledge connects — which ideas are central, which are isolated." },
                { icon: Target, title: "4. Blind spots are detected", desc: "The synthesizer analyzes all your entries together and identifies specific gaps in your understanding — things you've been avoiding, misconceptions in your writing, areas where your mental model is incomplete." },
                { icon: Zap, title: "5. Personalized assignments generated", desc: "Based on your weakest areas, CodeJournal generates a concrete 15-minute coding challenge. These aren't generic exercises — they target the exact edge cases and concepts you're most likely to get wrong." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3 p-3 rounded-sm bg-secondary/30 border border-border/50">
                  <Icon className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">{title}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Quick start */}
          <Section title="Getting Started">
            <div className="space-y-4">
              <Step n={1} title="Add your API key">
                Open the sidebar (☰ top-left) → Settings. The default provider is OpenRouter — create a free account at openrouter.ai and paste your key. You can use <strong className="text-foreground/80">free models</strong> with no credits needed.
              </Step>
              <Step n={2} title="Write your first entries">
                Type what you learned today in the input bar at the bottom. Examples: "Learned that closures capture variables by reference, not by value" or "Confused about why async/await doesn't make code parallel". Press Enter to submit.
              </Step>
              <Step n={3} title="Watch AI enrich your entries">
                Each entry gets classified (concept, confusion, edge case, etc.) and annotated with additional insights. The colored left border shows the type at a glance.
              </Step>
              <Step n={4} title="Add at least 3 entries">
                Once you have 3+ enriched entries, the "Synthesize" button appears in the sidebar. This is where the magic happens.
              </Step>
              <Step n={5} title="Click Synthesize">
                The AI reads ALL your entries together and generates: a synthesis connecting your concepts, blind spots it detected, a personalized coding assignment, and a map of connections between your ideas.
              </Step>
              <Step n={6} title="Do the assignment">
                Copy the generated assignment and work through it. It's designed to take ~15 minutes and targets exactly where your understanding is weakest. Then journal about what you learned — the cycle continues.
              </Step>
            </div>
          </Section>

          {/* Entry types */}
          <Section title="Entry Types">
            <p className="text-sm text-muted-foreground mb-3">
              CodeJournal classifies your entries into 9 programming-specific types. Each type gets a distinct color so you can see the shape of your learning at a glance.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPE_HIGHLIGHTS.map((type) => {
                const config = CONTENT_TYPE_CONFIG[type]
                if (!config) return null
                const Icon = config.icon
                return (
                  <div key={type} className="flex items-center gap-2.5 px-3 py-2 rounded-sm bg-secondary/50 border border-border/50">
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: config.accentVar }} />
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: config.accentVar }}>
                        {config.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Also: synthesis (connecting multiple concepts together).
            </p>
          </Section>

          {/* The Synthesis Panel */}
          <Section title="The Synthesis Panel">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              This is the core feature. When you click "Synthesize", the AI analyzes all your entries and produces four outputs:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-1 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Synthesis</p>
                  <p className="text-sm text-muted-foreground">A 2-3 sentence paragraph connecting concepts across all your entries — what patterns emerge from your learning.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-1 rounded-full bg-destructive" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Blind Spots</p>
                  <p className="text-sm text-muted-foreground">2-3 specific gaps or misconceptions detected from how you wrote about concepts. Things you're missing or getting subtly wrong.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-1 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Assignment</p>
                  <p className="text-sm text-muted-foreground">One concrete 15-minute coding challenge targeting your weakest concept. Designed to expose the exact edge case you'd likely miss. Copy it with one click.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-1 rounded-full bg-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Connections</p>
                  <p className="text-sm text-muted-foreground">Concept pairs showing how your ideas relate to each other, with reasons. These also appear as edges in the Graph view.</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Views */}
          <Section title="Views">
            <div className="space-y-3">
              <div className="flex gap-3 p-3 rounded-sm bg-secondary/30 border border-border/50">
                <Layers className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Tiling <span className="font-mono text-[10px] text-muted-foreground/50 ml-1">{mod}1</span></p>
                  <p className="text-sm text-muted-foreground">Default view. Entries are laid out in a spatial grid. Each new entry splits the available space. Navigate pages horizontally.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-sm bg-secondary/30 border border-border/50">
                <Kanban className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Kanban <span className="font-mono text-[10px] text-muted-foreground/50 ml-1">{mod}2</span></p>
                  <p className="text-sm text-muted-foreground">Entries grouped into columns by type. Great for seeing how many concepts vs confusions vs hypotheses you have.</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-sm bg-secondary/30 border border-border/50">
                <GitFork className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Graph <span className="font-mono text-[10px] text-muted-foreground/50 ml-1">{mod}3</span></p>
                  <p className="text-sm text-muted-foreground">Interactive force-directed graph showing connections between your concepts. Highly-connected nodes drift to the center. After synthesis, connection edges appear in orange showing how concepts relate.</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Export */}
          <Section title="Export Your Knowledge">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Download className="h-4 w-4 flex-shrink-0 text-primary/70 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Knowledge Doc Export</p>
                  <p className="text-sm text-muted-foreground">Export your entire learning journey as an Obsidian-compatible markdown file. Includes your synthesis, blind spots, assignment, all entries with annotations, and connections in [[wiki-link]] format.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sparkles className="h-4 w-4 flex-shrink-0 text-primary/70 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">Your data stays local</p>
                  <p className="text-sm text-muted-foreground">Everything is stored in your browser's localStorage. No account needed. Entries are sent to the AI provider using your own API key — nothing is stored on our servers.</p>
                </div>
              </div>
            </div>
          </Section>

          {/* Keyboard shortcuts */}
          <Section title="Keyboard Shortcuts">
            <div className="rounded-sm border border-border overflow-hidden">
              <div className="px-3 divide-y divide-border/40">
                <Shortcut keys={[mod, "K"]} label="Command menu" />
                <Shortcut keys={[mod, "Z"]} label="Undo last action" />
                <Shortcut keys={["Enter"]} label="Submit a new entry" />
                <Shortcut keys={["Esc"]} label="Close panels" />
              </div>
            </div>
          </Section>

          {/* Example workflow */}
          <Section title="Example Learning Session">
            <div className="space-y-2 p-4 rounded-sm bg-secondary/30 border border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-primary font-mono text-xs">Entry 1:</span> "Today I learned that JavaScript promises are microtasks, not macrotasks. They execute before setTimeout callbacks."
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-primary font-mono text-xs">Entry 2:</span> "Confused about why my async function returns a pending promise when I forget to await it"
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-primary font-mono text-xs">Entry 3:</span> "Edge case: if you return a thenable from a promise constructor, it gets recursively resolved"
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-primary font-mono text-xs">Entry 4:</span> "I think the event loop processes all microtasks before moving to the next macrotask"
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3 border-t border-border/50 pt-3">
                <span className="text-destructive font-mono text-xs">→ Synthesize:</span> The AI might detect that you haven't considered error handling in promise chains (blind spot), and generate an assignment like: "Write a function that chains 3 promises where the second one rejects — handle it so the third still runs. What happens if you use .then().catch() vs try/catch in async/await?"
              </p>
            </div>
          </Section>

          {/* Footer */}
          <div className="pt-2 pb-4 border-t border-border">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3 w-3 text-primary/40" />
              <span className="font-mono text-[10px] font-bold text-muted-foreground/40 ml-1">codejournal</span>
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  )
}


