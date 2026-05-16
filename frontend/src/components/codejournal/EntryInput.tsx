'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { CONTENT_TYPE_LIST, CONTENT_TYPES } from '@/lib/codejournal/types';

interface Props {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export function EntryInput({ onSubmit, disabled }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Show inline tag hint
  const startsWithHash = text.startsWith('#');
  const matchingTag = startsWithHash
    ? CONTENT_TYPE_LIST.find(ct => `#${ct}`.startsWith(text.toLowerCase().split(' ')[0]))
    : null;

  return (
    <div className="border-t border-border bg-background">
      {/* Inline tag autocomplete */}
      {matchingTag && text.split(' ').length === 1 && (
        <div className="px-6 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {CONTENT_TYPE_LIST
              .filter(ct => `#${ct}`.startsWith(text.toLowerCase()))
              .slice(0, 9)
              .map(ct => {
                const cfg = CONTENT_TYPES[ct];
                const Icon = cfg.Icon;
                return (
                  <button
                    key={ct}
                    onClick={() => setText(`#${ct} `)}
                    className="text-[11px] px-2 py-0.5 border border-border rounded hover:bg-muted flex items-center gap-1"
                  >
                    <Icon className={`w-2.5 h-2.5 ${cfg.color}`} /> #{ct}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowHints(true)}
              onBlur={() => setTimeout(() => setShowHints(false), 200)}
              placeholder="What did you learn today? AI will classify and annotate..."
              rows={1}
              disabled={disabled}
              className="w-full resize-none px-3 py-2.5 pr-10 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
            />
            <Sparkles className="absolute right-3 top-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || disabled}
            className="h-10 px-4 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            {disabled ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Add
          </button>
        </div>
        {showHints && !text && (
          <div className="max-w-4xl mx-auto mt-2 text-[11px] text-muted-foreground flex items-center gap-3">
            <span>Press <kbd className="px-1 py-0.5 bg-muted rounded font-mono">Enter</kbd> to submit</span>
            <span>·</span>
            <span>Type <kbd className="px-1 py-0.5 bg-muted rounded font-mono">#concept</kbd> to force a type</span>
          </div>
        )}
      </div>
    </div>
  );
}
