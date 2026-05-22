"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, Brain, Target, Zap } from "lucide-react"

interface IntroModalProps {
  open: boolean
  onClose: () => void
}

export function IntroModal({ open, onClose }: IntroModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [open, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[500] flex items-center justify-center bg-white border-t border-border backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-[#0d0d0d] border border-gray-200 rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-mono text-sm font-black text-foreground tracking-tight">codejournal</span>
                </div>
                <p className="text-xs text-muted-foreground/60 font-mono uppercase tracking-widest">
                  Your AI programming learning journal
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-sm text-muted-foreground/40 hover:text-foreground hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-4 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Write what you learn about programming each day. The AI reads all your entries, finds your blind spots, and generates personalized coding challenges to strengthen your weak areas.
              </p>

              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <BookOpen className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Journal freely</strong> — type concepts, confusions, edge cases, hypotheses. No structure needed.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <Brain className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">AI classifies & annotates</strong> — each entry gets a type and insights you didn't explicitly state.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <Target className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Blind spots detected</strong> — after 3+ entries, click "Synthesize" to find gaps in your understanding.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <Zap className="h-4 w-4 flex-shrink-0 text-primary mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Targeted assignments</strong> — get a 15-min coding challenge that targets exactly where you're weakest.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-sm bg-gray-50 border border-white/[0.06]">
                <p className="text-xs text-muted-foreground/70">
                  <strong className="text-muted-foreground">To start:</strong> Add your OpenRouter API key in the ☰ sidebar → Settings (free models available), then type your first entry below.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
              <p className="text-xs text-muted-foreground/40">
                Click the <span className="font-mono font-black text-muted-foreground/60">?</span> button anytime for the full guide
              </p>
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-mono font-medium rounded-sm bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 hover:border-primary/50 transition-all"
              >
                Start journaling →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}




