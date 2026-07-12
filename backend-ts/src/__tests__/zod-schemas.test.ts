import { z } from 'zod';

const createStudentSchema = z.object({
  email: z.string().email(), username: z.string().min(3), password: z.string().min(6).optional(),
  full_name: z.string().max(100).optional(), usn: z.string().optional(),
  semester: z.number().int().min(1).max(8).optional(), branch: z.string().max(50).optional(),
  section: z.string().max(5).optional(), cgpa: z.number().min(0).max(10).optional(),
});

const journalCreateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(5000).optional(),
  mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

const learningUpdateSchema = z.object({
  topic_id: z.number().int().positive(),
  score_percent: z.number().min(0).max(100),
});

const profileSchema = z.object({
  semester: z.number().int().min(1).max(8).optional(),
  section: z.string().max(5).optional(),
  branch: z.string().max(50).optional(),
  full_name: z.string().max(100).optional(),
});

describe('Zod Route Validation', () => {
  describe('createStudentSchema', () => {
    it('passes with valid data', () => {
      const r = createStudentSchema.safeParse({ email: 'a@b.com', username: 'student1' });
      expect(r.success).toBe(true);
    });

    it('fails with invalid email', () => {
      const r = createStudentSchema.safeParse({ email: 'not-email', username: 'student1' });
      expect(r.success).toBe(false);
    });

    it('fails with short username', () => {
      const r = createStudentSchema.safeParse({ email: 'a@b.com', username: 'ab' });
      expect(r.success).toBe(false);
    });

    it('fails with cgpa > 10', () => {
      const r = createStudentSchema.safeParse({ email: 'a@b.com', username: 'student1', cgpa: 11 });
      expect(r.success).toBe(false);
    });

    it('fails with semester > 8', () => {
      const r = createStudentSchema.safeParse({ email: 'a@b.com', username: 'student1', semester: 9 });
      expect(r.success).toBe(false);
    });
  });

  describe('journalCreateSchema', () => {
    it('passes with valid data', () => {
      const r = journalCreateSchema.safeParse({ title: 'My Entry', mood: 'good', tags: ['study'] });
      expect(r.success).toBe(true);
    });

    it('fails without title', () => {
      const r = journalCreateSchema.safeParse({ content: 'no title' });
      expect(r.success).toBe(false);
    });

    it('fails with invalid mood', () => {
      const r = journalCreateSchema.safeParse({ title: 'Test', mood: 'excited' });
      expect(r.success).toBe(false);
    });

    it('passes with empty optional fields', () => {
      const r = journalCreateSchema.safeParse({ title: 'Minimal' });
      expect(r.success).toBe(true);
    });

    it('fails with tags > 10', () => {
      const r = journalCreateSchema.safeParse({ title: 'T', tags: Array(11).fill('tag') });
      expect(r.success).toBe(false);
    });
  });

  describe('learningUpdateSchema', () => {
    it('passes with valid data', () => {
      const r = learningUpdateSchema.safeParse({ topic_id: 1, score_percent: 85 });
      expect(r.success).toBe(true);
    });

    it('fails with negative topic_id', () => {
      const r = learningUpdateSchema.safeParse({ topic_id: -1, score_percent: 85 });
      expect(r.success).toBe(false);
    });

    it('fails with score > 100', () => {
      const r = learningUpdateSchema.safeParse({ topic_id: 1, score_percent: 101 });
      expect(r.success).toBe(false);
    });

    it('passes with score 0', () => {
      const r = learningUpdateSchema.safeParse({ topic_id: 1, score_percent: 0 });
      expect(r.success).toBe(true);
    });

    it('passes with score 100', () => {
      const r = learningUpdateSchema.safeParse({ topic_id: 1, score_percent: 100 });
      expect(r.success).toBe(true);
    });

    it('fails without topic_id', () => {
      const r = learningUpdateSchema.safeParse({ score_percent: 50 });
      expect(r.success).toBe(false);
    });
  });

  describe('profileSchema', () => {
    it('passes with valid data', () => {
      const r = profileSchema.safeParse({ semester: 6, section: 'A', branch: 'CSE' });
      expect(r.success).toBe(true);
    });

    it('passes empty (all optional)', () => {
      const r = profileSchema.safeParse({});
      expect(r.success).toBe(true);
    });

    it('fails with semester 0', () => {
      const r = profileSchema.safeParse({ semester: 0 });
      expect(r.success).toBe(false);
    });

    it('fails with semester 9', () => {
      const r = profileSchema.safeParse({ semester: 9 });
      expect(r.success).toBe(false);
    });
  });
});
