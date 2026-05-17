'use client';

import { CodeJournalBlock, CONTENT_TYPES } from '@/lib/codejournal/types';
import { Loader2, Trash2, Pin, PinOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  block: CodeJournalBlock;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onClick?: (block: CodeJournalBlock) => void;
}

export function TileCard({ block, onDelete, onTogglePin, onClick }: Props) {
  const cfg = CONTENT_TYPES[block.contentType] ?? CONTENT_TYPES['concept'];
  const Icon = cfg.Icon;
  const time = new Date(block.timestamp);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      onClick={() => onClick?.(block)}
      className={cn(
        'group relative bg-card border border-border rounded-lg p-4 transition-all cursor-pointer hover:border-foreground/30 hover:shadow-sm',
        block.isError && 'border-red-200 bg-red-50/50',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
          <span className={cn('text-[10px] font-medium uppercase tracking-wider', cfg.color)}>
            {cfg.label}
          </span>
          {block.isEnriching && (
            <Loader2 className="w-3 h-3 animate-spin text-muted-foreground ml-1" />
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onTogglePin && (
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(block.id); }}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
            >
              {block.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Text */}
      <p className="text-sm text-foreground leading-relaxed mb-2 break-words">
        {block.text}
      </p>

      {/* AI Annotation */}
      {block.annotation && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-start gap-1.5">
            <Sparkles className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {block.annotation}
            </p>
          </div>
        </div>
      )}

      {/* Footer: meta */}
      <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
        <span className="font-mono truncate">{block.category}</span>
        <div className="flex items-center gap-2">
          {block.confidence && (
            <span className="font-mono" title={`Confidence: ${block.confidence}/5`}>
              {'●'.repeat(block.confidence)}{'○'.repeat(5 - block.confidence)}
            </span>
          )}
          <span className="font-mono">{timeStr}</span>
        </div>
      </div>

      {block.isPinned && (
        <Pin className="absolute top-2 right-2 w-3 h-3 text-foreground/40" />
      )}
    </div>
  );
}
