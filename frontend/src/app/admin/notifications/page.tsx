'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Send, Users, CheckCircle2, Clock, Trash2 } from 'lucide-react';

const NOTIFICATION_CATEGORIES = [
  { key: 'announcement', emoji: '📢', label: 'Announcement', type: 'info' as const },
  { key: 'test', emoji: '📝', label: 'Test / Exam', type: 'info' as const },
  { key: 'assignment', emoji: '📚', label: 'Assignment', type: 'warning' as const },
  { key: 'result', emoji: '🎯', label: 'Result', type: 'success' as const },
  { key: 'event', emoji: '🎉', label: 'Event', type: 'info' as const },
  { key: 'reminder', emoji: '⏰', label: 'Reminder', type: 'warning' as const },
  { key: 'holiday', emoji: '🏖️', label: 'Holiday', type: 'success' as const },
  { key: 'urgent', emoji: '🚨', label: 'Urgent', type: 'error' as const },
];

function getCategoryMeta(key: string) {
  return NOTIFICATION_CATEGORIES.find(c => c.key === key) || NOTIFICATION_CATEGORIES[0];
}

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState('announcement');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'all' | 'A' | 'B'>('all');
  const [sent, setSent] = useState<any[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadSent(); }, []);

  const loadSent = async () => {
    try {
      const data = await api.getNotifications();
      setSent(Array.isArray(data) ? data : data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setSent([]);
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setLoading(true);
    try {
      const cat = getCategoryMeta(category);
      await api.sendNotification({
        title: title.trim(),
        message: message.trim(),
        type: cat.type,
        target_section: target === 'all' ? undefined : target,
      });
      setResult(`Sent to ${target === 'all' ? 'all students' : `Section ${target}`}`);
      setTitle('');
      setMessage('');
      await loadSent();
      setTimeout(() => setResult(null), 3000);
    } catch (err) {
      console.error('Failed to send notification:', err);
      setResult('Failed to send notification');
      setTimeout(() => setResult(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Notifications" subtitle="Send messages to students" />
        <main className="flex-1 p-6 max-w-5xl w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Compose — left */}
            <Card className="lg:col-span-2 h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Send className="w-4 h-4" /> Compose
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category with emojis */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {NOTIFICATION_CATEGORIES.map(cat => (
                      <button
                        key={cat.key}
                        onClick={() => setCategory(cat.key)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-colors ${
                          category === cat.key ? 'border-foreground bg-muted' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <span className="truncate">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Send To</label>
                  <div className="flex gap-2">
                    {(['all', 'A', 'B'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTarget(t)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                          target === t ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-muted'
                        }`}
                      >
                        {t === 'all' ? 'All' : `Sec ${t}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Notification title..."
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-foreground resize-none"
                  />
                </div>

                <Button onClick={handleSend} disabled={!title.trim() || !message.trim()} className="w-full">
                  <Send className="w-3.5 h-3.5 mr-1" /> Send Notification
                </Button>
                {result && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {result}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sent history — right */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Sent History ({sent.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {sent.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No notifications sent yet</p>
                  ) : (
                    sent.map(n => {
                      const cat = getCategoryMeta(n.category);
                      return (
                        <div key={n.id} className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                            {cat.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium">{n.title}</p>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{cat.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {timeAgo(n.createdAt)}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" /> {n.target === 'all' ? 'All Students' : `Section ${n.target}`}
                              </span>
                              <span className="text-[10px] text-green-600">{n.readBy.length} read</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
