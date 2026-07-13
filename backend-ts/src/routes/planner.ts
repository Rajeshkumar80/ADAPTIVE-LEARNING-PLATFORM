import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getCached, setCache } from '../cache';
import { dqnSchedule } from '../services/sm2';

const router = Router();

// GET /api/planner/today — DQN-powered study plan
router.get('/today', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cached = await getCached(`planner:today:${userId}`);
    if (cached) return res.json(cached);

    // Get mastery data for all unlocked topics
    const [masteryRecords, dueCards, upcomingTests] = await Promise.all([
      prisma.topicMastery.findMany({
        where: { userId },
        include: { topic: { include: { subject: true } } },
      }),
      prisma.spacedRepetitionCard.findMany({
        where: { userId, nextReview: { lte: new Date() } },
        include: { topic: { include: { subject: true } } },
        take: 5,
      }),
      prisma.test.findMany({
        where: { startsAt: { gte: new Date() } },
        include: { subject: true },
        orderBy: { startsAt: 'asc' },
        take: 3,
      }),
    ]);

    // Get prerequisite counts per topic
    const topicIds = masteryRecords.map(m => m.topicId);
    const deps = await prisma.topicDependency.findMany({
      where: { topicId: { in: topicIds } },
    });
    const prereqCounts = new Map<number, { total: number; mastered: number }>();
    for (const d of deps) {
      const existing = prereqCounts.get(d.topicId) || { total: 0, mastered: 0 };
      existing.total++;
      const prereqMastery = masteryRecords.find(m => m.topicId === d.prerequisiteId);
      if (prereqMastery && prereqMastery.mastery >= 60) existing.mastered++;
      prereqCounts.set(d.topicId, existing);
    }

    // Build DQN input from mastery records
    const dqnTopics = masteryRecords.map(m => {
      const prereqInfo = prereqCounts.get(m.topicId) || { total: 0, mastered: 0 };
      const card = dueCards.find(c => c.topicId === m.topicId);
      return {
        topic_id: m.topicId,
        topic_name: m.topic.name,
        subject: m.topic.subject.name,
        mastery: m.mastery,
        observations: m.observations,
        is_unlocked: true,
        has_card: !!card,
        next_review: card?.nextReview || null,
        prerequisites_mastered: prereqInfo.mastered,
        total_prerequisites: prereqInfo.total,
      };
    });

    // Run DQN scheduler
    const dqnItems = dqnSchedule(dqnTopics, 10);

    // Build daily plan from DQN output
    const items: any[] = [];
    let slot = 9;

    for (const item of dqnItems) {
      const duration = item.type === 'review' ? 30 : item.type === 'weak_area' ? 45 : 40;
      items.push({
        id: items.length + 1,
        time: `${slot}:00`,
        subject: item.subject,
        topic: item.topic_name,
        duration,
        activity: item.type === 'review' ? 'Spaced Repetition Review'
          : item.type === 'weak_area' ? 'Focused Weak Area Study'
          : 'New Topic Introduction',
        status: 'pending',
        q_value: item.q_value,
        reason: item.reason,
      });
      slot++;
      if (items.length >= 8) break;
    }

    // Add upcoming test prep
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

    // Fallback
    if (items.length === 0) {
      items.push({
        id: 1, time: '09:00', subject: 'General', topic: 'Free study — review notes or practice problems',
        duration: 60, activity: 'Self Study', status: 'pending',
      });
    }

    const result = { items, date: new Date().toISOString().split('T')[0], scheduler: 'dqn' };
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
