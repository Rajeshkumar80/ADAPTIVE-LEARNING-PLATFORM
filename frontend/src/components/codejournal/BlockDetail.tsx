'use client';

import { CodeJournalBlock, CONTENT_TYPES } from '@/lib/codejournal/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Pin, PinOff, Trash2, Link2 } from 'lucide-react';

interface Props {
  block: CodeJournalBlock;
  relatedBlocks: CodeJournalBlock[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSelectRelated: (block: CodeJournalBlock) => void;
}

export function BlockDetail({ block, relatedBlocks, onClose, onDelete, onTogglePin, onSelectRelated }: Props) {
  const cfg = CONTENT_TYPES[block.contentType] ?? CONTENT_TYPES['concept'];
  const Icon = cfg.Icon;
  const time = new Date(block.timestamp).toLocaleString();

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-background rounded-lg max-w-2xl w-full overflow-hidden border border-border max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${cfg.color}`} />
            <Badge variant="outline" className={cfg.color}>{cfg.label}</Badge>
            <span className="text-xs text-muted-foreground font-mono ml-2">{block.category}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main text */}
          <div>
            <p className="text-base leading-relaxed">{block.text}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-2">{time}</p>
          </div>

          {/* Confidence */}
          {block.confidence && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Confidence:</span>
              <span className="font-mono">
                {'●'.repeat(block.confidence)}{'○'.repeat(5 - block.confidence)}
              </span>
              <span className="text-muted-foreground">({block.confidence}/5)</span>
            </div>
          )}

          {/* AI annotation */}
          {block.annotation && (
            <div className="bg-muted/40 border border-border rounded-md p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase tracking-wider">AI Insight</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{block.annotation}</p>
            </div>
          )}

          {/* Related entries */}
          {relatedBlocks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Link2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Related ({relatedBlocks.length})
                </span>
              </div>
              <div className="space-y-2">
                {relatedBlocks.map(b => {
                  const rcfg = CONTENT_TYPES[b.contentType] ?? CONTENT_TYPES['concept'];
                  const RIcon = rcfg.Icon;
                  return (
                    <button
                      key={b.id}
                      onClick={() => onSelectRelated(b)}
                      className="w-full text-left p-3 border border-border rounded-md hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <RIcon className={`w-3 h-3 ${rcfg.color}`} />
                        <span className={`text-[10px] uppercase tracking-wider ${rcfg.color}`}>
                          {rcfg.label}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{b.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sources */}
          {block.sources && block.sources.length > 0 && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wider mb-2 block">Sources</span>
              <ul className="space-y-1">
                {block.sources.map((s, i) => (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-foreground hover:underline"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => { onDelete(block.id); onClose(); }}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onTogglePin(block.id)}>
              {block.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              {block.isPinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
