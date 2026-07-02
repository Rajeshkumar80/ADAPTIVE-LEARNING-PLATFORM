import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/tests/
router.get('/', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const tests = await prisma.test.findMany({
      where: { isActive: true },
      include: { subject: true, _count: { select: { questions: true, attempts: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(tests.map(t => ({
      id: t.id, title: t.title, description: t.description, type: t.type,
      difficulty: t.difficulty, duration_minutes: t.durationMinutes,
      total_marks: t.totalMarks, passing_marks: t.passingMarks,
      subject: t.subject ? { code: t.subject.code, name: t.subject.name } : null,
      question_count: t._count.questions, attempt_count: t._count.attempts,
      is_active: t.isActive, anti_cheat_enabled: t.antiCheatEnabled,
      starts_at: t.startsAt, ends_at: t.endsAt, created_at: t.createdAt,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/tests/
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, subject_id, type, difficulty, duration_minutes, total_marks, passing_marks, questions } = req.body;
    const test = await prisma.test.create({
      data: {
        title, description: description || '',
        subjectId: subject_id,
        type: type || 'quiz', difficulty: difficulty || 'medium',
        durationMinutes: duration_minutes || 60,
        totalMarks: total_marks || 100,
        passingMarks: passing_marks || 40,
      },
    });

    if (questions && Array.isArray(questions)) {
      for (const q of questions) {
        await prisma.question.create({
          data: {
            testId: test.id, questionText: q.question_text,
            questionType: q.question_type || 'mcq',
            options: JSON.stringify(q.options || []),
            correctAnswer: q.correct_answer,
            marks: q.marks || 1, difficulty: q.difficulty || 'medium',
          },
        });
      }
    }

    return res.json({ id: test.id, title: test.title, message: 'Test created' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/tests/:id/start
router.post('/:id/start', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const testId = parseInt(String(req.params.id));
    const test = await prisma.test.findUnique({ where: { id: testId }, include: { questions: true } });
    if (!test) return res.status(404).json({ detail: 'Test not found' });

    const attempt = await prisma.testAttempt.create({
      data: { userId: req.user!.id, testId },
    });

    // Strip correct answers for student
    const questions = test.questions.map(q => ({
      id: q.id, question_text: q.questionText, question_type: q.questionType,
      options: JSON.parse(q.options || '[]'), marks: q.marks, difficulty: q.difficulty,
    }));

    return res.json({
      attempt_id: attempt.id, test: { id: test.id, title: test.title, duration_minutes: test.durationMinutes, total_marks: test.totalMarks },
      questions,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/tests/:attemptId/submit
router.post('/:attemptId/submit', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const attemptId = parseInt(String(req.params.attemptId));
    const { answers, anti_cheat_flags } = req.body;

    const attempt = await prisma.testAttempt.findUnique({ where: { id: attemptId }, include: { test: { include: { questions: true } } } });
    if (!attempt) return res.status(404).json({ detail: 'Attempt not found' });
    if (attempt.userId !== req.user!.id) return res.status(403).json({ detail: 'Not your attempt' });

    // Grade
    let score = 0;
    let totalMarks = 0;
    for (const q of attempt.test.questions) {
      totalMarks += q.marks;
      if (answers[q.id.toString()] === q.correctAnswer) score += q.marks;
    }

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

    const updated = await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        answers: JSON.stringify(answers),
        antiCheatFlags: JSON.stringify(anti_cheat_flags || []),
        score: Math.round(percentage * 10) / 10,
        isCompleted: true,
        submittedAt: new Date(),
      },
    });

    return res.json({ score: updated.score, total_marks: totalMarks, percentage: Math.round(percentage * 10) / 10 });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/tests/my-attempts
router.get('/my-attempts', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await prisma.testAttempt.findMany({
      where: { userId: req.user!.id },
      include: { test: true },
      orderBy: { startedAt: 'desc' },
    });
    return res.json(attempts.map(a => ({
      id: a.id, test_title: a.test.title, score: a.score,
      is_completed: a.isCompleted, started_at: a.startedAt, submitted_at: a.submittedAt,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/tests/upcoming
router.get('/upcoming', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const tests = await prisma.test.findMany({
      where: { isActive: true, startsAt: { not: null } },
      include: { subject: true },
      orderBy: { startsAt: 'asc' },
    });
    return res.json(tests.map(t => ({
      id: t.id, title: t.title, subject: t.subject?.name || '',
      starts_at: t.startsAt, ends_at: t.endsAt, duration_minutes: t.durationMinutes,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
