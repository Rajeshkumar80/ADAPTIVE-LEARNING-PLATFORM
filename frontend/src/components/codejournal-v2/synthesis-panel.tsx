"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check } from "lucide-react"
import { useState } from "react"
import type { SynthesisResult } from "@/lib/codejournal-v2/ai-synthesize"

interface SynthesisPanelProps {
  isOpen: boolean
  onClose: () => void
  synthesis: SynthesisResult | null
  isGenerating: boolean
}

export function SynthesisPanel({ isOpen, onClose, synthesis, isGenerating }: SynthesisPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyAssignment = async () => {
    if (!synthesis?.assignment) return
    try {
      await navigator.clipboard.writeText(synthesis.assignment)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error("Failed to copy:", e)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border z-[101] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-white backdrop-blur-sm">
              <div>
                <h2 className="font-mono text-sm font-bold text-foreground uppercase tracking-wider">
                  Knowledge Synthesis
                </h2>
                <p className="font-mono text-[10px] text-muted-foreground mt-1">
                  AI-generated insights from your journal
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-sm hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    Analyzing your knowledge...
                  </p>
                </div>
              )}

              {!isGenerating && synthesis && (
                <>
                  {/* SYNTHESIS */}
                  <div className="border-l-4 border-primary bg-card rounded-sm p-4">
                    <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary mb-3">
                      Synthesis
                    </h3>
                    <p className="font-mono text-sm text-foreground leading-relaxed">
                      {synthesis.synthesis}
                    </p>
                  </div>

                  {/* BLIND SPOTS */}
                  <div className="border-l-4 border-destructive bg-card rounded-sm p-4">
                    <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-destructive mb-3">
                      Blind Spots
                    </h3>
                    <ul className="space-y-2">
                      {synthesis.blind_spots.map((spot, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="font-mono text-xs text-destructive mt-0.5">•</span>
                          <span className="font-mono text-sm text-foreground leading-relaxed flex-1">
                            {spot}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ASSIGNMENT */}
                  <div className="border-l-4 border-primary bg-card rounded-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                        Today's Assignment
                      </h3>
                      <button
                        onClick={handleCopyAssignment}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-primary/10 hover:bg-primary/20 text-primary font-mono text-[10px] uppercase tracking-wider transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-sm text-foreground leading-relaxed">
                      {synthesis.assignment}
                    </p>
                  </div>

                  {/* CONNECTIONS */}
                  {synthesis.connections.length > 0 && (
                    <div className="border-l-4 border-muted bg-card rounded-sm p-4">
                      <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Connections Found
                      </h3>
                      <div className="space-y-3">
                        {synthesis.connections.map((conn, i) => (
                          <div key={i} className="space-y-1">
                            <div className="font-mono text-sm text-foreground">
                              <span className="text-primary">{conn.from}</span>
                              <span className="text-muted-foreground mx-2">→</span>
                              <span className="text-primary">{conn.to}</span>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground leading-relaxed pl-4">
                              {conn.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {!isGenerating && !synthesis && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider text-center">
                    No synthesis generated yet
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}




