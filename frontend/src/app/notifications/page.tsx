'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  AppNotification, getInbox, markAsRead, markAllRead, getCategoryMeta,
} from '@/lib/notifications-store';
import { Bell, CheckCheck, Clock } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const userId = String(user?.usn || user?.username || 'guest');

  useEffect(() => { load(); }, [user]);

  const load = () => setNotifications(getInbox(user?.section));

  const isRead = (n: AppNotification) => n.readBy.includes(userId);
  const unreadCount = notifications.filter(n => !isRead(n)).length;

  const handleMarkRead = (id: number) => { markAsRead(id, userId); load(); };
  const handleMarkAllRead = () => { markAllRead(userId, user?.section); load(); };

  const filtered = filter === 'unread' ? notifications.filter(n => !isRead(n)) : notifications;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Notifications" subtitle={`${unreadCount} unread`} />
        <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-4">
          {/* Actions */}
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

          {/* List */}
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
                const cat = getCategoryMeta(n.category);
                const read = isRead(n);
                return (
                  <Card key={n.id} className={`transition-colors cursor-pointer ${!read ? 'border-l-2 border-l-foreground bg-muted/30' : ''}`} onClick={() => handleMarkRead(n.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                          {cat.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-sm ${!read ? 'font-semibold' : 'font-medium text-muted-foreground'}`}>{n.title}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{cat.label}</span>
                            {!read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {timeAgo(n.createdAt)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">From: {n.sentBy}</span>
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
