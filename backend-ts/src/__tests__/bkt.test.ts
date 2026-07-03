import { bktUpdate, bktUpdateFromQuiz, masteryLevel, confidence, isTopicUnlocked, DEFAULT_BKT } from '../services/bkt';

describe('BKT Algorithm', () => {
  describe('bktUpdate', () => {
    it('increases mastery after correct response', () => {
      const result = bktUpdate(0.5, true);
      expect(result).toBeGreaterThan(0.5);
    });

    it('decreases mastery after incorrect response', () => {
      const result = bktUpdate(0.5, false);
      expect(result).toBeLessThan(0.5);
    });

    it('first correct response from default prior increases mastery', () => {
      const result = bktUpdate(DEFAULT_BKT.pInit, true);
      expect(result).toBeGreaterThan(DEFAULT_BKT.pInit);
    });

    it('first incorrect response stays reasonable (math allows slight increase from pTransit)', () => {
      const result = bktUpdate(DEFAULT_BKT.pInit, false);
      expect(result).toBeLessThan(0.3);
    });

    it('multiple correct responses converge toward 0.99', () => {
      let p = DEFAULT_BKT.pInit;
      for (let i = 0; i < 20; i++) {
        p = bktUpdate(p, true);
      }
      expect(p).toBeGreaterThanOrEqual(0.95);
    });

    it('mastery floor is 0.01', () => {
      let p = 0.02;
      for (let i = 0; i < 50; i++) {
        p = bktUpdate(p, false);
      }
      expect(p).toBeGreaterThanOrEqual(0.01);
    });

    it('mastery ceiling is 0.99', () => {
      let p = 0.98;
      for (let i = 0; i < 50; i++) {
        p = bktUpdate(p, true);
      }
      expect(p).toBeLessThanOrEqual(0.99);
    });

    it('correct after incorrect still increases mastery', () => {
      const afterWrong = bktUpdate(0.5, false);
      const afterRight = bktUpdate(afterWrong, true);
      expect(afterRight).toBeGreaterThan(afterWrong);
    });
  });

  describe('bktUpdateFromQuiz', () => {
    it('all correct pushes mastery up', () => {
      const result = bktUpdateFromQuiz(0.3, 5, 5);
      expect(result).toBeGreaterThan(0.5);
    });

    it('all wrong keeps mastery low', () => {
      const result = bktUpdateFromQuiz(0.3, 0, 5);
      expect(result).toBeLessThan(0.5);
    });
  });

  describe('masteryLevel', () => {
    it('mastered >= 0.9', () => {
      expect(masteryLevel(0.95)).toBe('mastered');
      expect(masteryLevel(0.9)).toBe('mastered');
    });

    it('proficient >= 0.7', () => {
      expect(masteryLevel(0.8)).toBe('proficient');
      expect(masteryLevel(0.7)).toBe('proficient');
    });

    it('learning >= 0.4', () => {
      expect(masteryLevel(0.5)).toBe('learning');
      expect(masteryLevel(0.4)).toBe('learning');
    });

    it('weak < 0.4', () => {
      expect(masteryLevel(0.3)).toBe('weak');
      expect(masteryLevel(0.1)).toBe('weak');
    });
  });

  describe('confidence', () => {
    it('increases with more observations', () => {
      expect(confidence(10)).toBeGreaterThan(confidence(1));
    });

    it('maxes out at 0.95', () => {
      expect(confidence(1000)).toBeLessThanOrEqual(0.95);
    });
  });

  describe('isTopicUnlocked', () => {
    it('unlocked when mastery >= threshold', () => {
      expect(isTopicUnlocked(0.7, 0.5)).toBe(true);
      expect(isTopicUnlocked(0.5, 0.5)).toBe(true);
    });

    it('locked when mastery < threshold', () => {
      expect(isTopicUnlocked(0.3, 0.5)).toBe(false);
    });
  });
});
