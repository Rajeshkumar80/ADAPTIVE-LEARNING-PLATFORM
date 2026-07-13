import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getCached, setCache } from '../cache';

const router = Router();

// GET /api/planner/today
router.get('/today', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cached = await getCached(`planner:today:${userId}`);
    if (cached) return res.json(cached);

    // Batch: get due cards, weak topics, upcoming tests in parallel
    const [dueCards, weakTopics, upcomingTests] = await Promise.all([
      prisma.spacedRepetitionCard.findMany({
        where: { userId, nextReview: { lte: new Date() } },
        include: { topic: { include: { subject: true } } },
        take: 5,
      }),
      prisma.topicMastery.findMany({
        where: { userId, mastery: { lt: 50 } },
        include: { topic: { include: { subject: true } } },
        orderBy: { mastery: 'asc' },
        take: 5,
      }),
      prisma.test.findMany({
        where: { startsAt: { gte: new Date() } },
        include: { subject: true },
        orderBy: { startsAt: 'asc' },
        take: 3,
      }),
    ]);

    const items: any[] = [];
    let slot = 9;

    // 1. Due review cards
    for (const card of dueCards) {
      items.push({
        id: items.length + 1,
        time: `${slot}:00`,
        subject: card.topic.subject.name,
        topic: card.topic.name,
        duration: 30,
        activity: 'Spaced Repetition Review',
        status: 'pending',
      });
      slot++;
    }

    // 2. Weak topics — schedule study sessions
    for (const weak of weakTopics) {
      if (items.length >= 8) break;
      items.push({
        id: items.length + 1,
        time: `${slot}:00`,
        subject: weak.topic.subject.name,
        topic: `Study: ${weak.topic.name} (mastery ${Math.round(weak.mastery)}%)`,
        duration: 45,
        activity: 'Focused Study',
        status: 'pending',
      });
      slot++;
    }

    // 3. Upcoming test prep
    for (const test of upcomingTests) {
      if (items.length >= 10) break;
      const daysUntil = Math.ceil((new Date(test.startsAt!).getTime() - Date.now()) / 86400000);
      items.push({
        id: items.length + 1,
        time: `${slot}:00`,
        subject: test.subject?.name || test.title,
        topic: `Prepare: ${test.title} (in ${daysUntil}d)`,
        duration: 60,
        activity: 'Test Preparation',
        status: 'pending',
      });
      slot++;
    }

    // Fallback: if nothing to do
    if (items.length === 0) {
      items.push({
        id: 1, time: '09:00', subject: 'General', topic: 'Free study — review notes or practice problems',
        duration: 60, activity: 'Self Study', status: 'pending',
      });
    }

    const result = { items, date: new Date().toISOString().split('T')[0] };
    await setCache(`planner:today:${userId}`, result, 30_000);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/planner/goals
router.get('/goals', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [mastery, upcomingTests] = await Promise.all([
      prisma.topicMastery.findMany({ where: { userId }, include: { topic: true } }),
      prisma.test.findMany({
        where: { startsAt: { gte: new Date() } },
        orderBy: { startsAt: 'asc' },
        take: 3,
      }),
    ]);

    const goals: any[] = [];

    // Goal 1: Master weakest topic
    const weakest = mastery.sort((a, b) => a.mastery - b.mastery)[0];
    if (weakest) {
      goals.push({
        id: 1,
        title: `Master ${weakest.topic.name}`,
        progress: Math.round(weakest.mastery),
        deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      });
    }

    // Goal 2: Average mastery above 70
    const avgMastery = mastery.length > 0
      ? Math.round(mastery.reduce((s, m) => s + m.mastery, 0) / mastery.length)
      : 0;
    goals.push({
      id: 2,
      title: 'Average mastery above 70%',
      progress: avgMastery,
      deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    });

    // Goal 3: Prepare for upcoming test
    if (upcomingTests.length > 0) {
      const test = upcomingTests[0];
      const daysUntil = Math.ceil((new Date(test.startsAt!).getTime() - Date.now()) / 86400000);
      goals.push({
        id: 3,
        title: `Pass ${test.title}`,
        progress: Math.max(0, 100 - daysUntil * 10),
        deadline: new Date(test.startsAt!).toISOString().split('T')[0],
      });
    }

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
