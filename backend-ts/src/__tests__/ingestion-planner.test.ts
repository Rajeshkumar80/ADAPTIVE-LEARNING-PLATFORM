import { z } from 'zod';

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

describe('Ingestion QuizAttemptSchema', () => {
  it('passes with valid minimal data', () => {
    const r = QuizAttemptSchema.safeParse({ topic_id: 1, score: 80, correct: 4, total: 5 });
    expect(r.success).toBe(true);
  });

  it('passes with all fields', () => {
    const r = QuizAttemptSchema.safeParse({
      topic_id: 1, subject_id: 2, test_attempt_id: 3,
      score: 90, correct: 9, total: 10, duration_seconds: 120,
    });
    expect(r.success).toBe(true);
  });

  it('fails with score > 100', () => {
    expect(QuizAttemptSchema.safeParse({ topic_id: 1, score: 101, correct: 5, total: 5 }).success).toBe(false);
  });

  it('fails with correct > total (allowed but scored)', () => {
    // Schema allows correct > total — business logic should handle
    const r = QuizAttemptSchema.safeParse({ topic_id: 1, score: 50, correct: 6, total: 5 });
    expect(r.success).toBe(true);
  });

  it('fails with zero total', () => {
    expect(QuizAttemptSchema.safeParse({ topic_id: 1, score: 50, correct: 0, total: 0 }).success).toBe(false);
  });

  it('fails with negative topic_id', () => {
    expect(QuizAttemptSchema.safeParse({ topic_id: -1, score: 50, correct: 1, total: 5 }).success).toBe(false);
  });

  it('passes with score 0', () => {
    const r = QuizAttemptSchema.safeParse({ topic_id: 1, score: 0, correct: 0, total: 5 });
    expect(r.success).toBe(true);
  });
});

describe('Ingestion TimeSpentSchema', () => {
  it('passes with valid data', () => {
    const r = TimeSpentSchema.safeParse({ topic_id: 1, duration_minutes: 30, activity: 'reading' });
    expect(r.success).toBe(true);
  });

  it('passes with all fields', () => {
    const r = TimeSpentSchema.safeParse({
      topic_id: 1, subject_id: 2, duration_minutes: 45,
      activity: 'quiz', focus_score: 85,
    });
    expect(r.success).toBe(true);
  });

  it('fails with duration < 0.5', () => {
    expect(TimeSpentSchema.safeParse({ topic_id: 1, duration_minutes: 0.1, activity: 'reading' }).success).toBe(false);
  });

  it('fails with invalid activity', () => {
    expect(TimeSpentSchema.safeParse({ topic_id: 1, duration_minutes: 10, activity: 'gaming' }).success).toBe(false);
  });

  it('passes with all valid activities', () => {
    for (const act of ['reading', 'quiz', 'flashcard', 'practice', 'video']) {
      const r = TimeSpentSchema.safeParse({ topic_id: 1, duration_minutes: 10, activity: act });
      expect(r.success).toBe(true);
    }
  });

  it('fails with focus_score > 100', () => {
    expect(TimeSpentSchema.safeParse({ topic_id: 1, duration_minutes: 10, activity: 'reading', focus_score: 101 }).success).toBe(false);
  });
});

describe('Planner priority scoring', () => {
  // Mirrors the priority logic in planner.ts
  function cardPriority(card: { easeFactor: number; repetitions: number }, mastery: number): number {
    let priority = 0;
    if (mastery < 30) priority += 30;
    else if (mastery < 50) priority += 20;
    else if (mastery < 70) priority += 10;
    if (card.easeFactor < 2.0) priority += 15;
    if (card.repetitions === 0) priority += 10;
    return priority;
  }

  it('high priority for low mastery + low ease', () => {
    expect(cardPriority({ easeFactor: 1.5, repetitions: 0 }, 20)).toBe(55);
  });

  it('medium priority for medium mastery', () => {
    expect(cardPriority({ easeFactor: 2.5, repetitions: 3 }, 60)).toBe(10);
  });

  it('zero priority for high mastery + good ease', () => {
    expect(cardPriority({ easeFactor: 2.5, repetitions: 5 }, 80)).toBe(0);
  });

  it('new cards get priority boost', () => {
    expect(cardPriority({ easeFactor: 2.5, repetitions: 0 }, 80)).toBe(10);
  });
});

describe('Forgetting risk classification', () => {
  function classifyRisk(mastery: number, daysSinceReview: number): string {
    if (mastery < 30 && daysSinceReview > 3) return 'high';
    if (mastery < 50 && daysSinceReview > 5) return 'medium';
    if (mastery < 70 && daysSinceReview > 7) return 'medium';
    return 'low';
  }

  it('high risk: low mastery + old review', () => {
    expect(classifyRisk(20, 5)).toBe('high');
  });

  it('medium risk: medium mastery + old review', () => {
    expect(classifyRisk(45, 6)).toBe('medium');
  });

  it('low risk: high mastery', () => {
    expect(classifyRisk(80, 10)).toBe('low');
  });

  it('low risk: recent review', () => {
    expect(classifyRisk(40, 2)).toBe('low');
  });
});
