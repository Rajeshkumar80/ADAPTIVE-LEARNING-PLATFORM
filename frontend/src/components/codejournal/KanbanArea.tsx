'use client';

import { useMemo } from 'react';
import { CodeJournalBlock, CONTENT_TYPES, CONTENT_TYPE_LIST } from '@/lib/codejournal/types';
import { TileCard } from './TileCard';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

interface Props {
  blocks: CodeJournalBlock[];
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onBlockClick?: (block: CodeJournalBlock) => void;
}

export function KanbanArea({ blocks, onDelete, onTogglePin, onBlockClick }: Props) {
  const grouped = useMemo(() => {
    const map: Record<string, CodeJournalBlock[]> = {};
    for (const ct of CONTENT_TYPE_LIST) map[ct] = [];
    for (const block of blocks) {
      if (map[block.contentType]) {
        map[block.contentType].push(block);
      }
    }
    return map;
  }, [blocks]);

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <LayoutGrid className="w-10 h-10 text-muted-foreground/40 mb-4" />
        <p className="text-sm font-medium mb-1">Kanban board is empty</p>
        <p className="text-xs text-muted-foreground">Add entries to organize them by type</p>
      </div>
    );
  }

  // Show all 9 columns always for consistency
  const columns = CONTENT_TYPE_LIST;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(ct => {
        const cfg = CONTENT_TYPES[ct];
        const Icon = cfg.Icon;
        const items = grouped[ct];
        return (
          <div key={ct} className="flex-shrink-0 w-72">
            <div className="flex items-center gap-2 mb-3 px-2 py-1.5 bg-muted/30 rounded-md">
              <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
              <h2 className={cn('text-xs font-medium uppercase tracking-wider', cfg.color)}>
                {cfg.label}
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                {items.length}
              </span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {items.length === 0 ? (
                <div className="text-xs text-muted-foreground/60 text-center py-8 border border-dashed border-border rounded-md">
                  No {cfg.label.toLowerCase()} entries
                </div>
              ) : (
                items.map(block => (
                  <TileCard
                    key={block.id}
                    block={block}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onClick={onBlockClick}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
