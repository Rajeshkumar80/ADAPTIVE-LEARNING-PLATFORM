import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getCached, setCache } from '../cache';

const router = Router();

// GET /api/learning/due-today
router.get('/due-today', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const cards = await prisma.spacedRepetitionCard.findMany({
      where: { userId: req.user!.id, nextReview: { lte: now } },
      include: { topic: { include: { subject: true } } },
      orderBy: { nextReview: 'asc' },
    });
    return res.json({
      due_count: cards.length,
      topics: cards.map(c => ({
        card_id: c.id, topic: c.topic.name, subject: c.topic.subject.name,
        ease_factor: c.easeFactor, interval: c.interval, next_review: c.nextReview,
      })),
      date: now.toISOString().split('T')[0],
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/learning/update
router.post('/update', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic_id, score_percent } = req.body;
    if (!topic_id || score_percent === undefined) {
      return res.status(400).json({ detail: 'topic_id and score_percent required' });
    }

    const userId = req.user!.id;

    // Get or create mastery
    let mastery = await prisma.topicMastery.findUnique({ where: { userId_topicId: { userId, topicId: topic_id } } });
    if (!mastery) {
      mastery = await prisma.topicMastery.create({ data: { userId, topicId: topic_id, mastery: score_percent } });
    }

    // SM-2 update
    let card = await prisma.spacedRepetitionCard.findUnique({ where: { userId_topicId: { userId, topicId: topic_id } } });
    const quality = score_percent >= 95 ? 5 : score_percent >= 80 ? 4 : score_percent >= 60 ? 3 : score_percent >= 40 ? 2 : score_percent >= 20 ? 1 : 0;

    let newEF = 2.5, newInterval = 1, newReps = 0;
    if (card) {
      if (quality >= 3) {
        newReps = card.repetitions + 1;
        newInterval = newReps === 1 ? 1 : newReps === 2 ? 6 : Math.round(card.interval * card.easeFactor);
      }
      newEF = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEF = Math.max(1.3, newEF);
    } else {
      newReps = quality >= 3 ? 1 : 0;
      newInterval = quality >= 3 ? 1 : 1;
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    if (card) {
      await prisma.spacedRepetitionCard.update({
        where: { id: card.id },
        data: { easeFactor: newEF, interval: newInterval, repetitions: newReps, nextReview, lastReview: new Date() },
      });
    } else {
      await prisma.spacedRepetitionCard.create({
        data: { userId, topicId: topic_id, easeFactor: newEF, interval: newInterval, repetitions: newReps, nextReview, lastReview: new Date() },
      });
    }

    // Update mastery
    const newMastery = Math.min(100, mastery.mastery * 0.7 + score_percent * 0.3);
    const risk = newInterval >= 14 ? 'low' : newInterval >= 6 ? 'medium' : 'high';
    await prisma.topicMastery.update({
      where: { id: mastery.id },
      data: { mastery: Math.round(newMastery * 10) / 10, forgettingRisk: risk, lastReviewed: new Date() },
    });

    // Log event
    await prisma.learningEvent.create({
      data: { userId, eventType: 'mastery_update', topicId: topic_id, payload: JSON.stringify({ score: score_percent, quality }) },
    });

    // Invalidate caches
    setCache(`dashboard:${userId}`, null, 0);
    setCache(`progress:${userId}`, null, 0);
    setCache(`activity:${userId}`, null, 0);

    return res.json({ topic_id, mastery: Math.round(newMastery * 10) / 10, quality, new_interval_days: newInterval, new_ease_factor: Math.round(newEF * 100) / 100, next_review: nextReview.toISOString() });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/learning/dashboard
router.get('/dashboard', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const mastery = await prisma.topicMastery.findMany({ where: { userId }, include: { topic: { include: { subject: true } } } });
    const sessions = await prisma.studySession.findMany({ where: { userId } });
    const attempts = await prisma.testAttempt.findMany({ where: { userId, isCompleted: true } });

    // Group by subject
    const subjectMap = new Map<string, { name: string; topics: any[]; avgMastery: number }>();
    for (const m of mastery) {
      const subName = m.topic.subject.name;
      if (!subjectMap.has(subName)) subjectMap.set(subName, { name: subName, topics: [], avgMastery: 0 });
      subjectMap.get(subName)!.topics.push({ name: m.topic.name, mastery: m.mastery, risk: m.forgettingRisk });
    }
    for (const [, sub] of subjectMap) {
      sub.avgMastery = sub.topics.reduce((s, t) => s + t.mastery, 0) / (sub.topics.length || 1);
    }

    // Calculate proper streak
    const now = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const hasSession = sessions.some(s => s.startedAt.toISOString().startsWith(dayStr));
      if (hasSession) streak++;
      else if (i > 0) break;
    }

    return res.json({
      user: { name: user?.fullName, semester: user?.semester },
      semester: user?.semester || 6,
      streak_days: streak,
      total_study_hours: Math.round(sessions.reduce((s, ss) => s + ss.durationMinutes, 0) / 60 * 10) / 10,
      tests_taken: attempts.length,
      subjects: Array.from(subjectMap.values()),
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/learning/sm2-calculate
router.post('/sm2-calculate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { repetitions, ease_factor, interval, quality } = req.body;
    const q = Math.max(0, Math.min(5, quality || 3));
    let newReps: number, newInterval: number;

    if (q >= 3) {
      newReps = (repetitions || 0) + 1;
      newInterval = newReps === 1 ? 1 : newReps === 2 ? 6 : Math.round((interval || 1) * (ease_factor || 2.5));
    } else {
      newReps = 0;
      newInterval = 1;
    }

    let newEF = (ease_factor || 2.5) + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    newEF = Math.max(1.3, newEF);

    return res.json({ repetitions: newReps, ease_factor: Math.round(newEF * 100) / 100, interval: newInterval, quality: q });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
