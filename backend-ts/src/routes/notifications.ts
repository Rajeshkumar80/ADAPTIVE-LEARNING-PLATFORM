import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { getCached, setCache } from '../cache';

const router = Router();

const sendNotificationSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  type: z.enum(['info', 'warning', 'success', 'error']).optional(),
  target_section: z.string().max(5).optional(),
  target_users: z.array(z.number().int().positive()).max(500).optional(),
});

// GET /api/notifications?page=1&limit=20
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = Math.max(1, parseInt(String(req.query.page)) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit)) || 20));
    const offset = (page - 1) * limit;
    const cacheKey = `notif:${userId}:${page}:${limit}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.userNotification.findMany({
        where: { userId },
        include: { notification: true },
        orderBy: { notification: { createdAt: 'desc' } },
        skip: offset, take: limit,
      }),
      prisma.userNotification.count({ where: { userId } }),
      prisma.userNotification.count({ where: { userId, read: false } }),
    ]);

    const result = {
      notifications: notifications.map(n => ({
        id: n.notification.id, title: n.notification.title, message: n.notification.message,
        type: n.notification.type, category: n.notification.category,
        target: n.notification.target, read: n.read, created_at: n.notification.createdAt,
      })),
      total, unread_count: unreadCount,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
    };
    setCache(cacheKey, result, 15_000);
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
    const parsed = sendNotificationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ detail: parsed.error.issues[0].message });
    const { title, message, type, target_section, target_users } = parsed.data;

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

    // Batch assign to users — skip duplicates via unique constraint
    await prisma.userNotification.createMany({
      data: users.map(u => ({ notificationId: notification.id, userId: u.id })),
      skipDuplicates: true,
    });

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
