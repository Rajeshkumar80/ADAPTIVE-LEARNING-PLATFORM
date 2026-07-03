import { sm2Update, qualityFromScore, generateStudyPlan, StudyPlanItem } from '../services/sm2';

describe('SM-2 Algorithm', () => {
  describe('sm2Update', () => {
    it('first correct response: interval=1, reps=1', () => {
      const result = sm2Update(0, 2.5, 0, 4);
      expect(result.repetitions).toBe(1);
      expect(result.interval).toBe(1);
    });

    it('second correct response: interval=6, reps=2', () => {
      const result = sm2Update(1, 2.5, 1, 4);
      expect(result.repetitions).toBe(2);
      expect(result.interval).toBe(6);
    });

    it('third correct response: interval = prev * EF', () => {
      const result = sm2Update(2, 2.5, 6, 4);
      expect(result.repetitions).toBe(3);
      expect(result.interval).toBe(15); // round(6 * 2.5)
    });

    it('incorrect response resets reps and interval', () => {
      const result = sm2Update(5, 2.5, 30, 1);
      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    it('perfect score increases EF', () => {
      const result = sm2Update(0, 2.5, 0, 5);
      expect(result.easeFactor).toBeGreaterThanOrEqual(2.5);
    });

    it('hard response decreases EF', () => {
      const result = sm2Update(0, 2.5, 0, 3);
      expect(result.easeFactor).toBeLessThan(2.5);
    });

    it('EF never below 1.3', () => {
      let ef = 1.3;
      for (let i = 0; i < 20; i++) {
        const result = sm2Update(0, ef, 0, 0);
        ef = result.easeFactor;
      }
      expect(ef).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe('qualityFromScore', () => {
    it('95+ = 5', () => expect(qualityFromScore(100)).toBe(5));
    it('80-94 = 4', () => expect(qualityFromScore(85)).toBe(4));
    it('60-79 = 3', () => expect(qualityFromScore(70)).toBe(3));
    it('40-59 = 2', () => expect(qualityFromScore(50)).toBe(2));
    it('20-39 = 1', () => expect(qualityFromScore(30)).toBe(1));
    it('0-19 = 0', () => expect(qualityFromScore(10)).toBe(0));
  });
});

describe('Study Plan Generator', () => {
  const baseTopics = [
    { id: 1, name: 'Topic A', subject: 'DBMS', mastery: 20, is_unlocked: true, has_card: false, observations: 3 },
    { id: 2, name: 'Topic B', subject: 'DBMS', mastery: 80, is_unlocked: true, has_card: true, next_review: new Date(Date.now() + 86400000), observations: 5 },
    { id: 3, name: 'Topic C', subject: 'CN', mastery: 0, is_unlocked: true, has_card: false, observations: 0 },
    { id: 4, name: 'Topic D', subject: 'CN', mastery: 50, is_unlocked: false, has_card: false, observations: 2 },
  ];

  it('prioritizes weak areas over new topics', () => {
    const plan = generateStudyPlan(baseTopics);
    expect(plan.length).toBeGreaterThan(0);
    expect(plan[0].type).toBe('weak_area');
  });

  it('skips locked topics', () => {
    const plan = generateStudyPlan(baseTopics);
    const ids = plan.map((i: StudyPlanItem) => i.topic_id);
    expect(ids).not.toContain(4);
  });

  it('includes new topics', () => {
    const plan = generateStudyPlan(baseTopics);
    const newTopics = plan.filter((i: StudyPlanItem) => i.type === 'new_topic');
    expect(newTopics.length).toBeGreaterThan(0);
  });

  it('respects maxItems', () => {
    const plan = generateStudyPlan(baseTopics, 2);
    expect(plan.length).toBeLessThanOrEqual(2);
  });
});
