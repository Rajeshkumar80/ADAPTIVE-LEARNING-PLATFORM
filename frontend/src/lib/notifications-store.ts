/**
 * Notification Store — localStorage-based shared notification system.
 * Admin/teacher sends notifications; students receive them in their inbox.
 */

export interface AppNotification {
  id: number;
  category: string;       // emoji category key
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target: 'all' | string; // 'all' or section like 'A'/'B'
  sentBy: string;         // admin name
  createdAt: string;
  readBy: string[];       // list of usns/usernames who read it
}

const STORE_KEY = 'adaptlearn_notifications';

// Notification categories with emojis
export const NOTIFICATION_CATEGORIES = [
  { key: 'announcement', emoji: '📢', label: 'Announcement', type: 'info' as const },
  { key: 'test', emoji: '📝', label: 'Test / Exam', type: 'info' as const },
  { key: 'assignment', emoji: '📚', label: 'Assignment', type: 'warning' as const },
  { key: 'result', emoji: '🎯', label: 'Result', type: 'success' as const },
  { key: 'event', emoji: '🎉', label: 'Event', type: 'info' as const },
  { key: 'reminder', emoji: '⏰', label: 'Reminder', type: 'warning' as const },
  { key: 'holiday', emoji: '🏖️', label: 'Holiday', type: 'success' as const },
  { key: 'urgent', emoji: '🚨', label: 'Urgent', type: 'error' as const },
];

export function getCategoryMeta(key: string) {
  return NOTIFICATION_CATEGORIES.find(c => c.key === key) || NOTIFICATION_CATEGORIES[0];
}

function seedDefaults(): AppNotification[] {
  return [
    {
      id: 1, category: 'announcement', title: 'Welcome to AdaptLearn!',
      message: 'Your account is set up. Start exploring subjects, take tests, and track your progress.',
      type: 'success', target: 'all', sentBy: 'Dr. Priya Sharma',
      createdAt: new Date(Date.now() - 300000).toISOString(), readBy: [],
    },
    {
      id: 2, category: 'test', title: 'New Test Available',
      message: 'Cloud Computing Mid-Term (BCS601) has been scheduled for June 5, 2026 at 10:00 AM. Duration: 90 minutes.',
      type: 'info', target: 'all', sentBy: 'Dr. Priya Sharma',
      createdAt: new Date(Date.now() - 1800000).toISOString(), readBy: [],
    },
    {
      id: 3, category: 'assignment', title: 'Assignment Reminder',
      message: 'ML Lab submission (BCS602) is due tomorrow at 11:59 PM. Make sure to upload your notebook.',
      type: 'warning', target: 'all', sentBy: 'Dr. Priya Sharma',
      createdAt: new Date(Date.now() - 3600000).toISOString(), readBy: [],
    },
  ];
}

export function getAllNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const defaults = seedDefaults();
      localStorage.setItem(STORE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function sendNotification(n: Omit<AppNotification, 'id' | 'createdAt' | 'readBy'>): AppNotification {
  const all = getAllNotifications();
  const newNotif: AppNotification = {
    ...n,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    readBy: [],
  };
  all.unshift(newNotif);
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
  return newNotif;
}

// Student inbox — notifications targeted to them (all or their section)
export function getInbox(userSection?: string): AppNotification[] {
  return getAllNotifications().filter(n =>
    n.target === 'all' || (userSection && n.target === userSection)
  );
}

export function markAsRead(notifId: number, userId: string) {
  const all = getAllNotifications();
  const n = all.find(x => x.id === notifId);
  if (n && !n.readBy.includes(userId)) {
    n.readBy.push(userId);
    localStorage.setItem(STORE_KEY, JSON.stringify(all));
  }
}

export function markAllRead(userId: string, userSection?: string) {
  const all = getAllNotifications();
  getInbox(userSection).forEach(n => {
    const target = all.find(x => x.id === n.id);
    if (target && !target.readBy.includes(userId)) target.readBy.push(userId);
  });
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
}

export function deleteNotification(notifId: number) {
  const all = getAllNotifications().filter(n => n.id !== notifId);
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
}
