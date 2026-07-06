import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { getCached, setCache } from '../cache';

const router = Router();

// GET /api/notifications/
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cached = getCached(`notif:${userId}`);
    if (cached) return res.json(cached);

    const notifications = await prisma.userNotification.findMany({
      where: { userId },
      include: { notification: true },
      orderBy: { notification: { createdAt: 'desc' } },
      take: 50,
    });

    const result = {
      notifications: notifications.map(n => ({
        id: n.notification.id, title: n.notification.title, message: n.notification.message,
        type: n.notification.type, category: n.notification.category,
        target: n.notification.target, read: n.read, created_at: n.notification.createdAt,
      })),
      total: notifications.length,
      unread_count: notifications.filter(n => !n.read).length,
    };
    setCache(`notif:${userId}`, result, 15_000);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.userNotification.updateMany({
      where: { notificationId: parseInt(String(req.params.id)), userId: req.user!.id },
      data: { read: true, readAt: new Date() },
    });
    return res.json({ message: 'Marked as read' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// PUT /api/notifications/read-all
router.put('/read-all', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.userNotification.updateMany({
      where: { userId: req.user!.id, read: false },
      data: { read: true, readAt: new Date() },
    });
    return res.json({ message: 'All marked as read' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/notifications/send (admin only)
router.post('/send', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, message, type, target_section, target_users } = req.body;
    if (!title || !message) return res.status(400).json({ detail: 'Title and message required' });

    const notification = await prisma.notification.create({
      data: { title, message, type: type || 'info', sentBy: req.user!.id, target: target_section || 'all' },
    });

    // Assign to users
    let users;
    if (target_users && target_users.length > 0) {
      users = await prisma.user.findMany({ where: { id: { in: target_users } } });
    } else if (target_section) {
      users = await prisma.user.findMany({ where: { section: target_section } });
    } else {
      users = await prisma.user.findMany({ where: { role: 'student' } });
    }

    for (const u of users) {
      const exists = await prisma.userNotification.findUnique({
        where: { notificationId_userId: { notificationId: notification.id, userId: u.id } },
      });
      if (!exists) {
        await prisma.userNotification.create({
          data: { notificationId: notification.id, userId: u.id },
        });
      }
    }

    // Invalidate notification cache for all affected users
    if (target_users && target_users.length > 0) {
      for (const uid of target_users) setCache(`notif:${uid}`, null, 0);
    } else {
      setCache('notif:', null, 0); // prefix invalidate handled by simple approach
    }

    return res.json({ id: notification.id, message: 'Notification sent', recipient_count: users.length });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/notifications/stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cached = getCached(`notif:stats:${userId}`);
    if (cached) return res.json(cached);
    const [total, unread] = await Promise.all([
      prisma.userNotification.count({ where: { userId } }),
      prisma.userNotification.count({ where: { userId, read: false } }),
    ]);
    const result = { total, unread };
    setCache(`notif:stats:${userId}`, result, 15_000);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
