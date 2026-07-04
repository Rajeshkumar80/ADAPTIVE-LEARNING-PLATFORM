'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Bell, CheckCheck, Clock } from 'lucide-react';

interface BackendNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  category: string;
  target: string;
  read: boolean;
  created_at: string;
}

const categoryMeta: Record<string, { emoji: string; label: string }> = {
  system: { emoji: '⚙️', label: 'System' },
  test: { emoji: '📝', label: 'Test' },
  reminder: { emoji: '⏰', label: 'Reminder' },
  achievement: { emoji: '🏆', label: 'Achievement' },
  deadline: { emoji: '📅', label: 'Deadline' },
  report: { emoji: '📊', label: 'Report' },
  course: { emoji: '📚', label: 'Course' },
  announcement: { emoji: '📢', label: 'Announcement' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

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
        <Header title="Notifications" subtitle={`${unreadCount} unread`} />
        <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
                All ({notifications.length})
              </Button>
              <Button size="sm" variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>
                Unread ({unreadCount})
              </Button>
            </div>
            {unreadCount > 0 && (
              <Button size="sm" variant="outline" onClick={handleMarkAllRead}>
                <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
              </Button>
            )}
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filtered.map(n => {
                const cat = categoryMeta[n.category] || { emoji: '📌', label: n.category };
                return (
                  <Card
                    key={n.id}
                    className={`transition-colors cursor-pointer ${!n.read ? 'border-l-2 border-l-foreground bg-muted/30' : ''}`}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                          {cat.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-sm ${!n.read ? 'font-semibold' : 'font-medium text-muted-foreground'}`}>{n.title}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{cat.label}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {timeAgo(n.created_at)}
                            </span>
                          </div>
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
