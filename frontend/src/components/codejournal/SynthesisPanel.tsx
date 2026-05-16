'use client';

import { SynthesisResult } from '@/lib/codejournal/types';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, BookOpen, Link2, X, Loader2, RefreshCw } from 'lucide-react';

interface Props {
  synthesis: SynthesisResult | null;
  loading: boolean;
  blockCount: number;
  onSynthesize: () => void;
  onClose: () => void;
}

export function SynthesisPanel({ synthesis, loading, blockCount, onSynthesize, onClose }: Props) {
  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-background border-l border-border z-40 flex flex-col animate-slide-up shadow-lg">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <h2 className="text-sm font-semibold">AI Synthesis</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {!synthesis && !loading && (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">🧠</div>
            <p className="text-sm font-medium mb-2">Run AI synthesis</p>
            <p className="text-xs text-muted-foreground mb-4">
              Analyzes all your entries to find blind spots, suggest connections, and generate a personalized challenge.
            </p>
            {blockCount < 3 ? (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                Add at least 3 entries to enable synthesis. You have {blockCount}.
              </p>
            ) : (
              <Button onClick={onSynthesize} size="sm">
                <Sparkles className="w-3.5 h-3.5" />
                Synthesize
              </Button>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Reading {blockCount} entries...</p>
          </div>
        )}

        {synthesis && !loading && (
          <>
            {/* Summary */}
            <section>
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <h3 className="text-xs font-medium uppercase tracking-wider">Summary</h3>
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {synthesis.summary}
              </p>
            </section>

            {/* Blind spots */}
            <section>
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5" />
                <h3 className="text-xs font-medium uppercase tracking-wider">Blind Spots</h3>
              </div>
              <ul className="space-y-2">
                {synthesis.blindSpots.map((bs, i) => (
                  <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2">
                    <span className="text-muted-foreground shrink-0">·</span>
                    {bs}
                  </li>
                ))}
              </ul>
            </section>

            {/* Assignment */}
            <section className="bg-muted/40 border border-border rounded-md p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <h3 className="text-xs font-medium uppercase tracking-wider">Today's Assignment</h3>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  ~{synthesis.assignment.estimatedMinutes} min
                </span>
              </div>
              <p className="text-sm font-semibold mb-2">{synthesis.assignment.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {synthesis.assignment.description}
              </p>
            </section>

            {/* Connections */}
            {synthesis.connections.length > 0 && (
              <section>
                <div className="flex items-center gap-1.5 mb-2">
                  <Link2 className="w-3.5 h-3.5" />
                  <h3 className="text-xs font-medium uppercase tracking-wider">
                    Connections ({synthesis.connections.length})
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {synthesis.connections.length} relationship{synthesis.connections.length === 1 ? '' : 's'} detected between your entries
                </p>
              </section>
            )}

            <div className="pt-3 border-t border-border">
              <Button onClick={onSynthesize} variant="outline" size="sm" className="w-full">
                <RefreshCw className="w-3.5 h-3.5" />
                Re-synthesize
              </Button>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Generated {new Date(synthesis.generatedAt).toLocaleTimeString()}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
