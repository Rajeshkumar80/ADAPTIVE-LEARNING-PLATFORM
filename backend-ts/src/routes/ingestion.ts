import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, requireStudent, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// Validation schemas
const QuizAttemptSchema = z.object({
  topic_id: z.number().int().positive(),
  subject_id: z.number().int().positive().optional(),
  test_attempt_id: z.number().int().positive().optional(),
  score: z.number().min(0).max(100),
  correct: z.number().int().min(0),
  total: z.number().int().positive(),
  duration_seconds: z.number().min(0).optional(),
});

const TimeSpentSchema = z.object({
  topic_id: z.number().int().positive(),
  subject_id: z.number().int().positive().optional(),
  duration_minutes: z.number().min(0.5),
  activity: z.enum(['reading', 'quiz', 'flashcard', 'practice', 'video']),
  focus_score: z.number().min(0).max(100).optional(),
});

// POST /api/ingestion/quiz-attempt
router.post('/quiz-attempt', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = QuizAttemptSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ detail: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    }

    const { topic_id, subject_id, test_attempt_id, score, correct, total, duration_seconds } = parsed.data;

    // Store raw event
    const event = await prisma.learningEvent.create({
      data: {
        userId: req.user!.id,
        eventType: 'quiz_attempt',
        topicId: topic_id,
        subjectId: subject_id || null,
        testAttemptId: test_attempt_id || null,
        payload: JSON.stringify({ score, correct, total, duration_seconds }),
      },
    });

    // Update topic mastery via BKT (Phase 3 integration point)
    const isCorrect = score >= 60;
    let mastery = await prisma.topicMastery.findUnique({
      where: { userId_topicId: { userId: req.user!.id, topicId: topic_id } },
    });

    if (!mastery) {
      mastery = await prisma.topicMastery.create({
        data: { userId: req.user!.id, topicId: topic_id, mastery: score },
      });
    } else {
      const newMastery = mastery.mastery * 0.7 + score * 0.3;
      await prisma.topicMastery.update({
        where: { id: mastery.id },
        data: { mastery: Math.round(newMastery * 10) / 10, observations: { increment: 1 }, lastReviewed: new Date() },
      });
    }

    return res.json({
      event_id: event.id,
      mastery: mastery.mastery,
      message: `Quiz attempt recorded: ${correct}/${total} (${score}%)`,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ingestion/time-spent
router.post('/time-spent', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = TimeSpentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ detail: 'Validation failed', errors: parsed.error.flatten().fieldErrors });
    }

    const { topic_id, subject_id, duration_minutes, activity, focus_score } = parsed.data;

    const event = await prisma.learningEvent.create({
      data: {
        userId: req.user!.id,
        eventType: 'time_spent',
        topicId: topic_id,
        subjectId: subject_id || null,
        payload: JSON.stringify({ duration_minutes, activity, focus_score }),
      },
    });

    // Create/update study session
    await prisma.studySession.create({
      data: {
        userId: req.user!.id,
        subjectId: subject_id || null,
        topicId: topic_id,
        durationMinutes: Math.round(duration_minutes),
        focusScore: focus_score || 50,
      },
    });

    return res.json({ event_id: event.id, message: `Time logged: ${duration_minutes}min ${activity}` });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/ingestion/performance/:userId
router.get('/performance/:userId', authenticate, async (req: AuthRequest, res: Response) => {
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

    const events = await prisma.learningEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const quizEvents = events.filter(e => e.eventType === 'quiz_attempt');
    const studyEvents = events.filter(e => e.eventType === 'time_spent');

    const totalQuizzes = quizEvents.length;
    const avgScore = totalQuizzes > 0
      ? quizEvents.reduce((sum, e) => {
          const p = JSON.parse(e.payload);
          return sum + p.score;
        }, 0) / totalQuizzes
      : 0;

    const totalStudyMinutes = studyEvents.reduce((sum, e) => {
      const p = JSON.parse(e.payload);
      return sum + (p.duration_minutes || 0);
    }, 0);

    return res.json({
      total_events: events.length,
      quiz_attempts: totalQuizzes,
      avg_score: Math.round(avgScore * 10) / 10,
      total_study_hours: Math.round(totalStudyMinutes / 60 * 10) / 10,
      recent_events: events.slice(0, 20).map(e => ({
        id: e.id,
        type: e.eventType,
        topic_id: e.topicId,
        created_at: e.createdAt,
        payload: JSON.parse(e.payload),
      })),
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/ingestion/events
router.get('/events', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const { type, limit } = req.query as { type?: string; limit?: string };
    const where: any = { userId: req.user!.id };
    if (type) where.eventType = type;

    const events = await prisma.learningEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit || '50'),
    });

    return res.json(events.map(e => ({
      id: e.id, type: e.eventType, topic_id: e.topicId, subject_id: e.subjectId,
      payload: JSON.parse(e.payload), created_at: e.createdAt,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
