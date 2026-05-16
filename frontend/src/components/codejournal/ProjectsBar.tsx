'use client';

import { useState } from 'react';
import { CodeJournalProject } from '@/lib/codejournal/types';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  projects: CodeJournalProject[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectsBar({ projects, activeId, onSwitch, onCreate, onRename, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (p: CodeJournalProject) => {
    setEditingId(p.id);
    setEditValue(p.name);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="border-b border-border bg-muted/30">
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
        {projects.map((p) => {
          const isActive = p.id === activeId;
          const isEditing = editingId === p.id;

          return (
            <div
              key={p.id}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-md text-xs whitespace-nowrap transition-colors group',
                isActive
                  ? 'bg-background border border-border'
                  : 'hover:bg-background/60 cursor-pointer'
              )}
              onClick={() => !isEditing && !isActive && onSwitch(p.id)}
            >
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    autoFocus
                    className="bg-transparent border-b border-foreground outline-none text-xs w-32"
                  />
                  <button onClick={saveEdit} className="p-0.5 hover:bg-muted rounded">
                    <Check className="w-3 h-3" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-0.5 hover:bg-muted rounded">
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <>
                  <span className={cn('font-medium', !isActive && 'text-muted-foreground')}>
                    {p.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {p.blocks.length}
                  </span>
                  {isActive && (
                    <div className="flex items-center gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(p); }}
                        className="p-0.5 hover:bg-muted rounded"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      {projects.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete project "${p.name}"?`)) onDelete(p.id);
                          }}
                          className="p-0.5 hover:bg-muted rounded hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        <Button onClick={onCreate} variant="ghost" size="sm" className="h-7 text-xs ml-auto">
          <Plus className="w-3 h-3" />
          New project
        </Button>
      </div>
    </div>
  );
}
