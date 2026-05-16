'use client';

import { useMemo } from 'react';
import { CodeJournalBlock, CONTENT_TYPES, CONTENT_TYPE_LIST } from '@/lib/codejournal/types';
import { TileCard } from './TileCard';

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

  // Show only columns with content or always show 4 main ones
  const columns = CONTENT_TYPE_LIST.filter(ct =>
    grouped[ct].length > 0 ||
    ['concept', 'confusion', 'edgecase', 'resolved'].includes(ct)
  );

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-sm font-medium mb-1">Kanban board is empty</p>
        <p className="text-xs text-muted-foreground">Add entries to organize them by type</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(ct => {
        const cfg = CONTENT_TYPES[ct];
        const items = grouped[ct];
        return (
          <div key={ct} className="flex-shrink-0 w-72">
            <div className="flex items-center gap-2 mb-3 px-2">
              <span className="text-base">{cfg.icon}</span>
              <h2 className={`text-xs font-medium uppercase tracking-wider ${cfg.color}`}>
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
