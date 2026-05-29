'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, CheckCheck, Inbox, Clock, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AppNotification, getInbox, getAllNotifications,
  markAsRead, markAllRead, getCategoryMeta,
} from '@/lib/notifications-store';

export function NotificationDialog() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'read'>('all');
  const [mounted, setMounted] = useState(false);

  const userId = String(user?.usn || user?.username || 'guest');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  const loadNotifications = () => {
    if (isAdmin) {
      // Admin sees all notifications they/others sent
      setNotifications(getAllNotifications());
    } else {
      // Student sees their inbox
      setNotifications(getInbox(user?.section));
    }
  };

  const isRead = (n: AppNotification) => n.readBy.includes(userId);
  const unreadCount = isAdmin ? 0 : notifications.filter(n => !isRead(n)).length;

  const handleMarkRead = (id: number) => {
    markAsRead(id, userId);
    loadNotifications();
  };

  const handleMarkAllRead = () => {
    markAllRead(userId, user?.section);
    loadNotifications();
  };

  const filtered = filter === 'new'
    ? notifications.filter(n => !isRead(n))
    : filter === 'read'
      ? notifications.filter(n => isRead(n))
      : notifications;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const dialog = open ? (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={() => setOpen(false)}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }} />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: '640px', height: '70vh', margin: '0 24px', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'white', border: '1px solid #e5e2dc', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e5e2dc' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>
              {isAdmin ? 'Sent Notifications' : 'Inbox'}
            </h2>
            <p style={{ fontSize: '13px', color: '#6b6b6b', margin: '2px 0 0' }}>
              {isAdmin ? `${notifications.length} sent` : `${unreadCount} new messages`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isAdmin && unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e5e2dc', background: 'transparent', cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
            <button onClick={() => setOpen(false)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: '#f0ede8', cursor: 'pointer', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs (students only) */}
        {!isAdmin && (
          <div style={{ display: 'flex', gap: '4px', padding: '12px 24px', borderBottom: '1px solid #e5e2dc', background: '#faf8f5' }}>
            {(['all', 'new', 'read'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: filter === tab ? 'white' : 'transparent',
                  color: filter === tab ? '#1a1a1a' : '#6b6b6b',
                  boxShadow: filter === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {tab === 'all' ? `All (${notifications.length})` : tab === 'new' ? `New (${unreadCount})` : `Read (${notifications.length - unreadCount})`}
              </button>
            ))}
          </div>
        )}

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Inbox size={40} style={{ margin: '0 auto 12px', color: '#b0ada6' }} />
              <p style={{ fontSize: '14px', color: '#6b6b6b' }}>No messages</p>
            </div>
          ) : (
            filtered.map(n => {
              const cat = getCategoryMeta(n.category);
              const read = isRead(n);
              return (
                <div
                  key={n.id}
                  onClick={() => !isAdmin && handleMarkRead(n.id)}
                  style={{
                    display: 'flex', gap: '14px', padding: '16px 24px', borderBottom: '1px solid #f0ede8',
                    cursor: isAdmin ? 'default' : 'pointer',
                    background: (!isAdmin && !read) ? '#faf8f5' : 'transparent',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#f0ede8', fontSize: '20px' }}>
                    {cat.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <p style={{ fontSize: '14px', fontWeight: (!isAdmin && !read) ? 600 : 500, margin: 0, color: '#1a1a1a' }}>{n.title}</p>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', background: '#f0ede8', color: '#6b6b6b' }}>{cat.label}</span>
                      {!isAdmin && !read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} />}
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b6b6b', margin: '4px 0 0', lineHeight: 1.4 }}>{n.message}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0 0' }}>
                      <p style={{ fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                        <Clock size={11} /> {timeAgo(n.createdAt)}
                      </p>
                      {isAdmin && (
                        <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
                          To: {n.target === 'all' ? 'All Students' : `Section ${n.target}`} · {n.readBy.length} read
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Admin footer hint */}
        {isAdmin && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #e5e2dc', background: '#faf8f5', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={14} color="#6b6b6b" />
            <p style={{ fontSize: '12px', color: '#6b6b6b', margin: 0 }}>Go to Notifications page to send new messages</p>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {mounted && dialog && createPortal(dialog, document.body)}
    </>
  );
}
