'use client';

import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { BookOpen, Plus, Star, Trash2, X, Search, Edit2, Save } from 'lucide-react';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  starred: boolean;
  created_at: string;
  updated_at: string;
}

const moodMeta: Record<string, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '😊', label: 'Happy', color: 'bg-green-50 text-green-700' },
  productive: { emoji: '💪', label: 'Productive', color: 'bg-blue-50 text-blue-700' },
  neutral: { emoji: '😐', label: 'Neutral', color: 'bg-gray-50 text-gray-700' },
  frustrated: { emoji: '😤', label: 'Frustrated', color: 'bg-orange-50 text-orange-700' },
  tired: { emoji: '😴', label: 'Tired', color: 'bg-purple-50 text-purple-700' },
  excited: { emoji: '🎉', label: 'Excited', color: 'bg-pink-50 text-pink-700' },
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStarred, setFilterStarred] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', content: '', mood: 'neutral', tags: '' as string });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { loadEntries(); }, [filterStarred]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { loadEntries(); }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const loadEntries = async () => {
    try {
      const data = await api.listJournalEntries({ q: searchQuery || undefined, starred: filterStarred || undefined });
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load journal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.createJournalEntry({ title: form.title, content: form.content, mood: form.mood, tags });
      setForm({ title: '', content: '', mood: 'neutral', tags: '' });
      setShowCreate(false);
      loadEntries();
    } catch (err) {
      console.error('Failed to create entry:', err);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      await api.updateJournalEntry(id, { title: form.title, content: form.content, mood: form.mood, tags });
      setEditingId(null);
      setForm({ title: '', content: '', mood: 'neutral', tags: '' });
      loadEntries();
    } catch (err) {
      console.error('Failed to update entry:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteJournalEntry(id);
      loadEntries();
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  const handleToggleStar = async (entry: JournalEntry) => {
    try {
      await api.updateJournalEntry(entry.id, { starred: !entry.starred });
      loadEntries();
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setForm({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags.join(', '),
    });
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Journal" subtitle={`${entries.length} entries`} />
        <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-4">
          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search entries..."
                  className="w-full h-8 pl-8 pr-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:border-foreground"
                />
              </div>
              <Button
                size="sm"
                variant={filterStarred ? 'default' : 'outline'}
                onClick={() => setFilterStarred(!filterStarred)}
              >
                <Star className="w-3.5 h-3.5 mr-1" /> Starred
              </Button>
            </div>
            <Button size="sm" onClick={() => { setShowCreate(true); setEditingId(null); setForm({ title: '', content: '', mood: 'neutral', tags: '' }); }}>
              <Plus className="w-3.5 h-3.5 mr-1" /> New Entry
            </Button>
          </div>

          {/* Create/Edit Form */}
          {(showCreate || editingId) && (
            <Card className="border-2">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{editingId ? 'Edit Entry' : 'New Journal Entry'}</p>
                  <button onClick={() => { setShowCreate(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Title"
                  className="w-full h-9 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:border-foreground"
                />
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your thoughts..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:border-foreground resize-none"
                />
                <div className="flex items-center gap-3">
                  <select
                    value={form.mood}
                    onChange={(e) => setForm({ ...form, mood: e.target.value })}
                    className="h-8 px-2 text-sm border border-border rounded-md bg-background"
                  >
                    {Object.entries(moodMeta).map(([key, m]) => (
                      <option key={key} value={key}>{m.emoji} {m.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="Tags (comma separated)"
                    className="flex-1 h-8 px-3 text-sm border border-border rounded-md bg-background focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setShowCreate(false); setEditingId(null); }}>Cancel</Button>
                  <Button size="sm" onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}>
                    <Save className="w-3.5 h-3.5 mr-1" /> {editingId ? 'Update' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Entries List */}
          {entries.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No journal entries yet. Start writing!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {entries.map(entry => {
                const mood = moodMeta[entry.mood] || moodMeta.neutral;
                return (
                  <Card key={entry.id} className="transition-colors hover:bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold">{entry.title}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${mood.color}`}>{mood.emoji} {mood.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {entry.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-[10px]">{tag}</Badge>
                            ))}
                            <span className="text-[10px] text-muted-foreground">{timeAgo(entry.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleToggleStar(entry)} className="p-1 hover:bg-muted rounded">
                            <Star className={`w-4 h-4 ${entry.starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                          </button>
                          <button onClick={() => startEdit(entry)} className="p-1 hover:bg-muted rounded">
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button onClick={() => handleDelete(entry.id)} className="p-1 hover:bg-muted rounded">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
