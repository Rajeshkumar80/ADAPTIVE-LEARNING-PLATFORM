import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, requireStudent, AuthRequest } from '../middleware/auth';
import { sm2Update, qualityFromScore, generateStudyPlan } from '../services/sm2';

const router = Router();

// GET /api/study-plan/:userId
router.get('/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(String(req.params.userId));
    if (req.user!.id !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ detail: 'Forbidden' });
    }

    // Get all topics with mastery and card info
    const allTopics = await prisma.topic.findMany({
      include: {
        subject: true,
        dependencies: true,
      },
    });

    const masteryRecords = await prisma.topicMastery.findMany({ where: { userId } });
    const cards = await prisma.spacedRepetitionCard.findMany({ where: { userId } });

    const masteryMap = new Map(masteryRecords.map(m => [m.topicId, m]));
    const cardMap = new Map(cards.map(c => [c.topicId, c]));

    // Build enriched topic list
    const enrichedTopics = allTopics.map(topic => {
      const mastery = masteryMap.get(topic.id);
      const card = cardMap.get(topic.id);

      // Check if prerequisites are met
      const prereqsMet = topic.dependencies.every(dep => {
        const prereqMastery = masteryMap.get(dep.prerequisiteId);
        return prereqMastery && prereqMastery.pKnow >= dep.threshold;
      });

      return {
        id: topic.id,
        name: topic.name,
        subject: topic.subject.name,
        mastery: mastery ? mastery.pKnow * 100 : 0,
        is_unlocked: prereqsMet,
        has_card: !!card,
        next_review: card?.nextReview || null,
        observations: mastery?.observations || 0,
      };
    });

    // Generate study plan
    const plan = generateStudyPlan(enrichedTopics, 10);

    // Get due revision cards
    const now = new Date();
    const dueCards = await prisma.spacedRepetitionCard.findMany({
      where: { userId, nextReview: { lte: now } },
      include: { topic: { include: { subject: true } } },
      orderBy: { nextReview: 'asc' },
      take: 5,
    });

    return res.json({
      user_id: userId,
      today_plan: plan,
      due_reviews: dueCards.map(c => ({
        card_id: c.id,
        topic: c.topic.name,
        subject: c.topic.subject.name,
        ease_factor: c.easeFactor,
        interval: c.interval,
        next_review: c.nextReview,
      })),
      total_plan_items: plan.length,
      due_review_count: dueCards.length,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/study-plan/complete-step
router.post('/complete-step', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const { topic_id, score_percent } = req.body;
    if (!topic_id || score_percent === undefined) {
      return res.status(400).json({ detail: 'topic_id and score_percent required' });
    }

    const userId = req.user!.id;
    const quality = qualityFromScore(score_percent);

    // Get or create card
    let card = await prisma.spacedRepetitionCard.findUnique({
      where: { userId_topicId: { userId, topicId: topic_id } },
    });

    if (!card) {
      card = await prisma.spacedRepetitionCard.create({
        data: {
          userId, topicId: topic_id,
          easeFactor: 2.5, interval: 0, repetitions: 0,
          nextReview: new Date(),
        },
      });
    }

    // Run SM-2
    const result = sm2Update(card.repetitions, card.easeFactor, card.interval, quality);
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + result.interval);

    await prisma.spacedRepetitionCard.update({
      where: { id: card.id },
      data: {
        easeFactor: result.easeFactor,
        interval: result.interval,
        repetitions: result.repetitions,
        nextReview,
        lastReview: new Date(),
      },
    });

    // Also update mastery
    const mastery = await prisma.topicMastery.findUnique({
      where: { userId_topicId: { userId, topicId: topic_id } },
    });

    if (mastery) {
      const newMastery = mastery.mastery * 0.7 + score_percent * 0.3;
      await prisma.topicMastery.update({
        where: { id: mastery.id },
        data: {
          mastery: Math.round(newMastery * 10) / 10,
          lastReviewed: new Date(),
        },
      });
    }

    return res.json({
      topic_id,
      sm2: {
        repetitions: result.repetitions,
        ease_factor: result.easeFactor,
        interval_days: result.interval,
        quality,
        next_review: nextReview.toISOString(),
      },
      message: `Step complete. Next review in ${result.interval} days.`,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
