import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { authenticate, requireStudent, AuthRequest } from '../middleware/auth';
import { bktUpdate, masteryLevel, confidence, isTopicUnlocked, DEFAULT_BKT } from '../services/bkt';

const router = Router();

const bktUpdateSchema = z.object({
  topic_id: z.number().int().positive(),
  correct: z.number().int().min(0),
  total: z.number().int().min(1),
});

// GET /api/learning-state/:userId
router.get('/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const param = String(req.params.userId);
    let userId: number;
    if (param === 'me') {
      userId = req.user!.id;
    } else {
      userId = parseInt(param);
      if (req.user!.id !== userId && req.user!.role !== 'admin') {
        return res.status(403).json({ detail: 'Forbidden' });
      }
    }

    // Get all topics with their mastery and dependencies
    const masteryRecords = await prisma.topicMastery.findMany({
      where: { userId },
      include: {
        topic: {
          include: {
            subject: true,
            dependencies: { include: { prerequisite: true } },
            dependents: true,
          },
        },
      },
    });

    // Get all topics (to find ones not yet studied)
    const allTopics = await prisma.topic.findMany({
      include: {
        subject: true,
        dependencies: { include: { prerequisite: true } },
        dependents: true,
      },
    });

    // Build mastery map
    const masteryMap = new Map<number, typeof masteryRecords[0]>();
    for (const m of masteryRecords) {
      masteryMap.set(m.topicId, m);
    }

    // Build per-topic status
    const topics = allTopics.map(topic => {
      const mastery = masteryMap.get(topic.id);
      const pKnow = mastery ? mastery.pKnow : DEFAULT_BKT.pInit;
      const observations = mastery ? mastery.observations : 0;
      const lastReviewed = mastery?.lastReviewed || null;

      // Check prerequisites
      const prerequisites = topic.dependencies.map(dep => {
        const prereqMastery = masteryMap.get(dep.prerequisiteId);
        const prereqPKnow = prereqMastery ? prereqMastery.pKnow : DEFAULT_BKT.pInit;
        return {
          topic_id: dep.prerequisiteId,
          topic_name: dep.prerequisite.name,
          required_threshold: dep.threshold,
          current_mastery: Math.round(prereqPKnow * 100),
          unlocked: isTopicUnlocked(prereqPKnow, dep.threshold),
        };
      });

      const allPrereqsMet = prerequisites.every(p => p.unlocked);

      return {
        topic_id: topic.id,
        topic_name: topic.name,
        subject: topic.subject.name,
        subject_code: topic.subject.code,
        module_num: topic.moduleNum,
        mastery_percent: Math.round(pKnow * 100),
        mastery_level: masteryLevel(pKnow),
        confidence: confidence(observations),
        observations,
        last_reviewed: lastReviewed,
        prerequisites,
        is_unlocked: allPrereqsMet,
      };
    });

    // Separate weak areas
    const weakAreas = topics
      .filter(t => t.mastery_percent < 40 && t.is_unlocked)
      .sort((a, b) => a.mastery_percent - b.mastery_percent);

    // Summary
    const mastered = topics.filter(t => t.mastery_level === 'mastered').length;
    const proficient = topics.filter(t => t.mastery_level === 'proficient').length;
    const learning = topics.filter(t => t.mastery_level === 'learning').length;
    const weak = topics.filter(t => t.mastery_level === 'weak').length;

    return res.json({
      user_id: userId,
      total_topics: topics.length,
      summary: { mastered, proficient, learning, weak },
      weak_areas: weakAreas.slice(0, 10),
      topics,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/learning-state/bkt-update (manual BKT update after quiz)
router.post('/bkt-update', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = bktUpdateSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ detail: parsed.error.issues[0].message });
    const { topic_id, correct, total } = parsed.data;

    const userId = req.user!.id;

    let mastery = await prisma.topicMastery.findUnique({
      where: { userId_topicId: { userId, topicId: topic_id } },
    });

    const currentPknow = mastery ? mastery.pKnow : DEFAULT_BKT.pInit;
    const newPknow = bktUpdate(currentPknow, correct / total >= 0.6);

    if (!mastery) {
      mastery = await prisma.topicMastery.create({
        data: {
          userId, topicId: topic_id,
          pKnow: newPknow, pGuess: DEFAULT_BKT.pGuess,
          pSlip: DEFAULT_BKT.pSlip, pTransit: DEFAULT_BKT.pTransit,
          observations: 1, mastery: newPknow * 100,
        },
      });
    } else {
      await prisma.topicMastery.update({
        where: { id: mastery.id },
        data: {
          pKnow: newPknow,
          observations: { increment: 1 },
          mastery: Math.round(newPknow * 100 * 10) / 10,
          lastReviewed: new Date(),
        },
      });
    }

    return res.json({
      topic_id,
      p_know_before: Math.round(currentPknow * 1000) / 1000,
      p_know_after: Math.round(newPknow * 1000) / 1000,
      mastery_percent: Math.round(newPknow * 100),
      mastery_level: masteryLevel(newPknow),
      correct,
      total,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/learning-state/dependency-graph/:subjectId
router.get('/dependency-graph/:subjectId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const subjectId = parseInt(String(req.params.subjectId));
    const topics = await prisma.topic.findMany({
      where: { subjectId },
      include: {
        dependencies: { include: { prerequisite: true } },
        dependents: { include: { topic: true } },
      },
      orderBy: { moduleNum: 'asc' },
    });

    const graph = topics.map(t => ({
      id: t.id,
      name: t.name,
      module: t.moduleNum,
      prerequisites: t.dependencies.map(d => ({
        id: d.prerequisite.id,
        name: d.prerequisite.name,
        threshold: d.threshold,
      })),
      dependents: (t.dependents || []).map(d => ({
        id: d.topic.id,
        name: d.topic.name,
      })),
    }));

    return res.json({ subject_id: subjectId, graph });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
