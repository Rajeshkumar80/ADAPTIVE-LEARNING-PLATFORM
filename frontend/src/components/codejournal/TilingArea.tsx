'use client';

import { useMemo } from 'react';
import { CodeJournalBlock } from '@/lib/codejournal/types';
import { TileCard } from './TileCard';
import { ChevronDown, ChevronRight, Pin, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  blocks: CodeJournalBlock[];
  collapsedCategories: string[];
  onToggleCategory: (cat: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onBlockClick?: (block: CodeJournalBlock) => void;
}

export function TilingArea({
  blocks,
  collapsedCategories = [],
  onToggleCategory,
  onDelete,
  onTogglePin,
  onBlockClick,
}: Props) {
  const grouped = useMemo(() => {
    const map: Record<string, CodeJournalBlock[]> = {};
    // Pinned first
    const pinned = blocks.filter(b => b.isPinned);
    const rest = blocks.filter(b => !b.isPinned);

    if (pinned.length > 0) map['Pinned'] = pinned;

    for (const block of rest) {
      if (!map[block.category]) map[block.category] = [];
      map[block.category].push(block);
    }
    return map;
  }, [blocks]);

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground/40 mb-4" />
        <p className="text-sm font-medium mb-1">Start writing</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Type anything you learned today in the box below. AI will classify, annotate, and connect it.
        </p>
        <div className="mt-6 text-[11px] text-muted-foreground space-y-1">
          <p>Try entering:</p>
          <p className="font-mono">"closures capture variables by reference"</p>
          <p className="font-mono">"why does typeof null return object?"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => {
        const isCollapsed = collapsedCategories.includes(category);
        const isPinnedCategory = category === 'Pinned';
        return (
          <div key={category}>
            <button
              onClick={() => onToggleCategory(category)}
              className="flex items-center gap-2 mb-3 group"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              {isPinnedCategory && <Pin className="w-3 h-3 text-muted-foreground" />}
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                {category}
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">
                {items.length}
              </span>
            </button>
            {!isCollapsed && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map(block => (
                  <TileCard
                    key={block.id}
                    block={block}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onClick={onBlockClick}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
