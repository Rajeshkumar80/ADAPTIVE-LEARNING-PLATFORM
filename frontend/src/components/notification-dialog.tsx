'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, CheckCheck, Info, AlertTriangle, CheckCircle2, XCircle, Inbox, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
  success: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

// Dummy messages for demo
const DUMMY_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Welcome to AdaptLearn!', message: 'Your account is set up. Start exploring subjects, take tests, and track your progress.', type: 'success', is_read: false, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 2, title: 'New Test Available', message: 'Cloud Computing Mid-Term (BCS601) has been scheduled for June 5, 2026 at 10:00 AM. Duration: 90 minutes.', type: 'info', is_read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 3, title: 'Assignment Reminder', message: 'ML Lab submission (BCS602) is due tomorrow at 11:59 PM. Make sure to upload your notebook.', type: 'warning', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 4, title: 'Test Result Published', message: 'Your Data Structures Mid-Term score: 85/100 (85%). Grade: A. Certificate issued!', type: 'success', is_read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 5, title: 'Study Streak Achievement!', message: 'Congratulations! You have maintained a 7-day study streak. Keep it up to unlock the "Monthly Warrior" badge.', type: 'success', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 6, title: 'New Achievement Unlocked', message: 'You earned the "Quiz Master" badge for completing 10 tests. View it in your achievements page.', type: 'success', is_read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 7, title: 'CNS Assignment Graded', message: 'Your Cryptography assignment has been graded. Score: 18/20. Feedback available in the tests section.', type: 'info', is_read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 8, title: 'System Maintenance', message: 'Platform will undergo maintenance on Sunday 2:00 AM - 4:00 AM IST. Please save your work before then.', type: 'warning', is_read: true, created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 9, title: 'AI Tutor Update', message: 'AI Tutor now supports document upload! Upload PDFs and ask questions about your study material.', type: 'info', is_read: true, created_at: new Date(Date.now() - 432000000).toISOString() },
  { id: 10, title: 'Semester Registration Open', message: '6th semester subject registration is now open. Select your electives before June 15.', type: 'info', is_read: true, created_at: new Date(Date.now() - 604800000).toISOString() },
];

export function NotificationDialog() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(DUMMY_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'new' | 'old'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const filtered = filter === 'new'
    ? notifications.filter(n => !n.is_read)
    : filter === 'old'
      ? notifications.filter(n => n.is_read)
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
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={() => setOpen(false)}
    >
      {/* Glass blur background */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }} />

      {/* Centered dialog box */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: '720px', height: '70vh', margin: '0 24px', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: 'white', border: '1px solid hsl(40 10% 88%)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid hsl(40 10% 88%)' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Inbox</h2>
            <p style={{ fontSize: '13px', color: 'hsl(20 5% 45%)', margin: '2px 0 0' }}>{unreadCount} new messages</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px', border: '1px solid hsl(40 10% 88%)', background: 'transparent', cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
            <button onClick={() => setOpen(false)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'hsl(40 12% 91%)', cursor: 'pointer', display: 'flex' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tabs: All / New / Old */}
        <div style={{ display: 'flex', gap: '4px', padding: '12px 24px', borderBottom: '1px solid hsl(40 10% 88%)', background: 'hsl(40 20% 97%)' }}>
          {(['all', 'new', 'old'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: filter === tab ? 'white' : 'transparent',
                color: filter === tab ? 'hsl(20 10% 10%)' : 'hsl(20 5% 45%)',
                boxShadow: filter === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {tab === 'all' ? `All (${notifications.length})` : tab === 'new' ? `New (${unreadCount})` : `Read (${notifications.length - unreadCount})`}
            </button>
          ))}
        </div>

        {/* Messages list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Inbox size={40} style={{ margin: '0 auto 12px', color: 'hsl(20 5% 70%)' }} />
              <p style={{ fontSize: '14px', color: 'hsl(20 5% 45%)' }}>No messages</p>
            </div>
          ) : (
            filtered.map(n => {
              const config = typeConfig[n.type] || typeConfig.info;
              const Icon = config.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '16px 24px',
                    borderBottom: '1px solid hsl(40 10% 93%)',
                    cursor: 'pointer',
                    background: !n.is_read ? 'hsl(40 20% 97%)' : 'transparent',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'hsl(40 15% 95%)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = !n.is_read ? 'hsl(40 20% 97%)' : 'transparent'; }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} className={config.bg}>
                    <Icon size={20} className={config.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontSize: '14px', fontWeight: !n.is_read ? 600 : 500, margin: 0, color: !n.is_read ? 'hsl(20 10% 10%)' : 'hsl(20 5% 35%)' }}>
                        {n.title}
                      </p>
                      {!n.is_read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />}
                    </div>
                    <p style={{ fontSize: '13px', color: 'hsl(20 5% 45%)', margin: '4px 0 0', lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ fontSize: '11px', color: 'hsl(20 5% 60%)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {timeAgo(n.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Bell trigger */}
      <button
        onClick={() => setOpen(true)}
        className="relative h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Render dialog via portal to body so it's not constrained by parent */}
      {mounted && dialog && createPortal(dialog, document.body)}
    </>
  );
}
