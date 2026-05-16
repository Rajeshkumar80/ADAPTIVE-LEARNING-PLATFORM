'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, Star, Filter, MoreHorizontal, X, Trash2 } from 'lucide-react';

interface Entry {
  id: number;
  title: string;
  language: string;
  tags: string[];
  date: string;
  starred: boolean;
  code: string;
}

const STORAGE_KEY = 'adaptlearn_journal_entries';

const defaultEntries: Entry[] = [
  { id: 1, title: 'Binary Search Implementation', language: 'Python', tags: ['algorithm', 'searching'], date: 'May 15', starred: true, code: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1' },
  { id: 2, title: 'Quick Sort Algorithm', language: 'JavaScript', tags: ['algorithm', 'sorting'], date: 'May 14', starred: false, code: 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}' },
  { id: 3, title: 'Linked List Operations', language: 'C++', tags: ['data-structure'], date: 'May 13', starred: true, code: 'class Node {\n  public:\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};' },
  { id: 4, title: 'Database Connection Pool', language: 'Java', tags: ['database'], date: 'May 12', starred: false, code: 'public class ConnectionPool {\n    private static final int MAX = 10;\n    private List<Connection> pool;\n}' },
  { id: 5, title: 'React Custom Hooks', language: 'TypeScript', tags: ['react', 'hooks'], date: 'May 11', starred: true, code: 'export function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delay);\n    return () => clearTimeout(handler);\n  }, [value, delay]);\n  return debouncedValue;\n}' },
];

export default function JournalPage() {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState<Entry[]>(defaultEntries);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [viewing, setViewing] = useState<Entry | null>(null);
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setEntries(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const toggleStar = (id: number) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
  };

  const deleteEntry = (id: number) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setViewing(null);
    setEditing(null);
  };

  const saveEntry = (data: Partial<Entry>) => {
    if (editing) {
      setEntries(prev => prev.map(e => e.id === editing.id ? { ...e, ...data } : e));
    } else {
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const newEntry: Entry = {
        id: Date.now(),
        title: data.title || 'Untitled',
        language: data.language || 'Python',
        tags: data.tags || [],
        date: today,
        starred: false,
        code: data.code || '',
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const filtered = entries
    .filter(e =>
      search === '' ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
    .filter(e => !showOnlyStarred || e.starred);

  const languagesCount = new Set(entries.map(e => e.language)).size;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Code Journal</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Document your coding journey</p>
            </div>
            <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>
              <Plus className="w-3.5 h-3.5" />
              New entry
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Total entries</p><p className="text-2xl font-semibold tracking-tight">{entries.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Languages</p><p className="text-2xl font-semibold tracking-tight">{languagesCount}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Starred</p><p className="text-2xl font-semibold tracking-tight">{entries.filter(e => e.starred).length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Showing</p><p className="text-2xl font-semibold tracking-tight">{filtered.length}</p></CardContent></Card>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search entries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <Button
              variant={showOnlyStarred ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyStarred(!showOnlyStarred)}
            >
              <Star className="w-3 h-3" />
              {showOnlyStarred ? 'Starred only' : 'All'}
            </Button>
          </div>

          {/* Entries */}
          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-muted-foreground mb-4">No entries found</p>
                  <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>
                    <Plus className="w-3.5 h-3.5" />
                    Create your first entry
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filtered.map((entry) => (
                    <div
                      key={entry.id}
                      className="group flex items-center px-6 py-3 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => setViewing(entry)}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStar(entry.id); }}
                        className="mr-3"
                      >
                        <Star className={`w-4 h-4 ${entry.starred ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium truncate">{entry.title}</p>
                          <Badge variant="outline" className="text-[10px]">{entry.language}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {entry.tags.map((tag) => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground ml-4 w-16 text-right">{entry.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* New/Edit Entry Form */}
      {showForm && (
        <EntryForm
          entry={editing}
          onSave={saveEntry}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* View Entry */}
      {viewing && !showForm && (
        <EntryView
          entry={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); setShowForm(true); }}
          onDelete={() => deleteEntry(viewing.id)}
        />
      )}
    </div>
  );
}

// ============= Entry Form =============
function EntryForm({
  entry,
  onSave,
  onCancel,
}: {
  entry: Entry | null;
  onSave: (data: Partial<Entry>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(entry?.title || '');
  const [language, setLanguage] = useState(entry?.language || 'Python');
  const [tagsInput, setTagsInput] = useState(entry?.tags.join(', ') || '');
  const [code, setCode] = useState(entry?.code || '');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      language,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      code,
    });
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onCancel}>
      <div
        className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">
            {entry ? 'Edit entry' : 'New entry'}
          </h2>
          <button onClick={onCancel} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Binary Search Implementation"
              className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background"
              >
                <option>Python</option>
                <option>JavaScript</option>
                <option>TypeScript</option>
                <option>Java</option>
                <option>C++</option>
                <option>C</option>
                <option>Go</option>
                <option>Rust</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="algorithm, sorting"
                className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              placeholder="# Your code here"
              className="w-full px-3 py-2 border border-border rounded-md text-xs font-mono focus:outline-none focus:border-foreground resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>
            {entry ? 'Save changes' : 'Create entry'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============= Entry View =============
function EntryView({
  entry,
  onClose,
  onEdit,
  onDelete,
}: {
  entry: Entry;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight">{entry.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px]">{entry.language}</Badge>
              {entry.tags.map(t => (
                <span key={t} className="text-xs text-muted-foreground">#{t}</span>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <pre className="bg-muted/50 border border-border rounded-md p-4 text-xs font-mono overflow-x-auto whitespace-pre">
            {entry.code}
          </pre>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-between">
          <Button variant="outline" onClick={onDelete} className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onEdit}>Edit</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
