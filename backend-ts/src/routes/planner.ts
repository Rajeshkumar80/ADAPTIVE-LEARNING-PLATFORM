import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getCached, setCache } from '../cache';

const router = Router();

// GET /api/planner/today
router.get('/today', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cached = getCached(`planner:today:${userId}`);
    if (cached) return res.json(cached);

    const dueCards = await prisma.spacedRepetitionCard.findMany({
      where: { userId, nextReview: { lte: new Date() } },
      include: { topic: { include: { subject: true } } },
      take: 10,
    });

    const items = dueCards.map((c, i) => ({
      id: i + 1,
      time: `${9 + i}:00`,
      subject: c.topic.subject.name,
      topic: c.topic.name,
      duration: 45,
      activity: 'review',
      status: 'pending' as const,
    }));

    const result = { items, date: new Date().toISOString().split('T')[0] };
    setCache(`planner:today:${userId}`, result, 30_000);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/planner/goals
router.get('/goals', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const mastery = await prisma.topicMastery.findMany({ where: { userId: req.user!.id } });
    const goals = mastery.slice(0, 5).map((m, i) => ({
      id: i + 1, title: `Master topic ${m.topicId}`, progress: Math.round(m.mastery),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }));
    return res.json(goals);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/planner/mastery
router.get('/mastery', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const mastery = await prisma.topicMastery.findMany({
      where: { userId: req.user!.id },
      include: { topic: true },
    });
    return res.json(mastery.map(m => ({
      topic: m.topic.name, mastery: m.mastery, risk: m.forgettingRisk,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
