import {
  testCreationSchema,
  journalEntrySchema,
  notificationSchema,
  bktUpdateSchema,
} from '../middleware/validation';

describe('Validation Schemas', () => {
  describe('testCreationSchema', () => {
    it('passes with valid data', () => {
      const result = testCreationSchema({ title: 'DSA Mid-Term', duration_minutes: 60 });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('fails without title', () => {
      const result = testCreationSchema({});
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Title is required (min 2 characters)');
    });

    it('fails with short title', () => {
      const result = testCreationSchema({ title: 'A' });
      expect(result.valid).toBe(false);
    });

    it('fails with invalid duration', () => {
      const result = testCreationSchema({ title: 'Test', duration_minutes: -5 });
      expect(result.valid).toBe(false);
    });
  });

  describe('journalEntrySchema', () => {
    it('passes with valid data', () => {
      const result = journalEntrySchema({ title: 'My Journal', mood: 'happy' });
      expect(result.valid).toBe(true);
    });

    it('fails without title', () => {
      const result = journalEntrySchema({});
      expect(result.valid).toBe(false);
    });

    it('fails with invalid mood', () => {
      const result = journalEntrySchema({ title: 'Entry', mood: 'invalid_mood' });
      expect(result.valid).toBe(false);
    });
  });

  describe('notificationSchema', () => {
    it('passes with valid data', () => {
      const result = notificationSchema({ title: 'Test', message: 'Hello', type: 'info' });
      expect(result.valid).toBe(true);
    });

    it('fails without title', () => {
      const result = notificationSchema({ message: 'Hello' });
      expect(result.valid).toBe(false);
    });

    it('fails with invalid type', () => {
      const result = notificationSchema({ title: 'T', message: 'M', type: 'invalid' });
      expect(result.valid).toBe(false);
    });
  });

  describe('bktUpdateSchema', () => {
    it('passes with valid data', () => {
      const result = bktUpdateSchema({ topic_id: 1, correct: 3, total: 5 });
      expect(result.valid).toBe(true);
    });

    it('fails without topic_id', () => {
      const result = bktUpdateSchema({ correct: 3, total: 5 });
      expect(result.valid).toBe(false);
    });

    it('fails with negative correct', () => {
      const result = bktUpdateSchema({ topic_id: 1, correct: -1, total: 5 });
      expect(result.valid).toBe(false);
    });

    it('fails with total < 1', () => {
      const result = bktUpdateSchema({ topic_id: 1, correct: 0, total: 0 });
      expect(result.valid).toBe(false);
    });
  });
});
