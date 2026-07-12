import { z } from 'zod';

const sendNotificationSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  type: z.enum(['info', 'warning', 'success', 'error']).optional(),
  target_section: z.string().max(5).optional(),
  target_users: z.array(z.number().int().positive()).max(500).optional(),
});

const learningUpdateSchema = z.object({
  topic_id: z.number().int().positive(),
  score_percent: z.number().min(0).max(100),
});

describe('Notifications Schema', () => {
  it('passes with valid data', () => {
    const r = sendNotificationSchema.safeParse({ title: 'Test', message: 'Hello' });
    expect(r.success).toBe(true);
  });

  it('passes with all fields', () => {
    const r = sendNotificationSchema.safeParse({
      title: 'Exam Notice', message: 'Mid-term next week',
      type: 'warning', target_section: 'A', target_users: [1, 2, 3],
    });
    expect(r.success).toBe(true);
  });

  it('fails without title', () => {
    const r = sendNotificationSchema.safeParse({ message: 'Hello' });
    expect(r.success).toBe(false);
  });

  it('fails without message', () => {
    const r = sendNotificationSchema.safeParse({ title: 'Test' });
    expect(r.success).toBe(false);
  });

  it('fails with invalid type', () => {
    const r = sendNotificationSchema.safeParse({ title: 'T', message: 'M', type: 'urgent' });
    expect(r.success).toBe(false);
  });

  it('fails with title > 200 chars', () => {
    const r = sendNotificationSchema.safeParse({ title: 'x'.repeat(201), message: 'M' });
    expect(r.success).toBe(false);
  });

  it('fails with message > 2000 chars', () => {
    const r = sendNotificationSchema.safeParse({ title: 'T', message: 'x'.repeat(2001) });
    expect(r.success).toBe(false);
  });

  it('fails with target_users > 500', () => {
    const r = sendNotificationSchema.safeParse({ title: 'T', message: 'M', target_users: Array(501).fill(1) });
    expect(r.success).toBe(false);
  });

  it('fails with negative user id', () => {
    const r = sendNotificationSchema.safeParse({ title: 'T', message: 'M', target_users: [-1] });
    expect(r.success).toBe(false);
  });
});

describe('Learning Update Schema', () => {
  it('passes with valid data', () => {
    const r = learningUpdateSchema.safeParse({ topic_id: 1, score_percent: 85 });
    expect(r.success).toBe(true);
  });

  it('passes with boundary values', () => {
    expect(learningUpdateSchema.safeParse({ topic_id: 1, score_percent: 0 }).success).toBe(true);
    expect(learningUpdateSchema.safeParse({ topic_id: 1, score_percent: 100 }).success).toBe(true);
  });

  it('fails with score > 100', () => {
    expect(learningUpdateSchema.safeParse({ topic_id: 1, score_percent: 101 }).success).toBe(false);
  });

  it('fails with negative score', () => {
    expect(learningUpdateSchema.safeParse({ topic_id: 1, score_percent: -1 }).success).toBe(false);
  });

  it('fails with zero topic_id', () => {
    expect(learningUpdateSchema.safeParse({ topic_id: 0, score_percent: 50 }).success).toBe(false);
  });

  it('fails with negative topic_id', () => {
    expect(learningUpdateSchema.safeParse({ topic_id: -1, score_percent: 50 }).success).toBe(false);
  });

  it('fails without topic_id', () => {
    expect(learningUpdateSchema.safeParse({ score_percent: 50 }).success).toBe(false);
  });

  it('fails without score_percent', () => {
    expect(learningUpdateSchema.safeParse({ topic_id: 1 }).success).toBe(false);
  });

  it('fails with non-integer topic_id', () => {
    expect(learningUpdateSchema.safeParse({ topic_id: 1.5, score_percent: 50 }).success).toBe(false);
  });
});

describe('SM-2 Quality Mapping', () => {
  // Mirrors the quality mapping in learning.ts POST /update
  function scoreToQuality(score: number): number {
    return score >= 95 ? 5 : score >= 80 ? 4 : score >= 60 ? 3 : score >= 40 ? 2 : score >= 20 ? 1 : 0;
  }

  it('maps 95+ to quality 5', () => { expect(scoreToQuality(95)).toBe(5); expect(scoreToQuality(100)).toBe(5); });
  it('maps 80-94 to quality 4', () => { expect(scoreToQuality(80)).toBe(4); expect(scoreToQuality(94)).toBe(4); });
  it('maps 60-79 to quality 3', () => { expect(scoreToQuality(60)).toBe(3); expect(scoreToQuality(79)).toBe(3); });
  it('maps 40-59 to quality 2', () => { expect(scoreToQuality(40)).toBe(2); expect(scoreToQuality(59)).toBe(2); });
  it('maps 20-39 to quality 1', () => { expect(scoreToQuality(20)).toBe(1); expect(scoreToQuality(39)).toBe(1); });
  it('maps 0-19 to quality 0', () => { expect(scoreToQuality(0)).toBe(0); expect(scoreToQuality(19)).toBe(0); });
});

describe('Pagination Logic', () => {
  function paginate<T>(items: T[], page: number, limit: number) {
    const offset = (page - 1) * limit;
    return { items: items.slice(offset, offset + limit), total: items.length, pages: Math.ceil(items.length / limit) };
  }

  const data = Array.from({ length: 50 }, (_, i) => i + 1);

  it('returns first page correctly', () => {
    const r = paginate(data, 1, 20);
    expect(r.items).toHaveLength(20);
    expect(r.items[0]).toBe(1);
    expect(r.pages).toBe(3);
  });

  it('returns last page with remaining items', () => {
    const r = paginate(data, 3, 20);
    expect(r.items).toHaveLength(10);
  });

  it('returns empty for out-of-range page', () => {
    const r = paginate(data, 10, 20);
    expect(r.items).toHaveLength(0);
  });
});
