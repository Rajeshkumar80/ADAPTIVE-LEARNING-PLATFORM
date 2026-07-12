// Test achievement definitions and check logic (unit tests, no DB needed)
// The actual checkAndAwardAchievements function requires DB, so we test the logic separately

describe('Achievement Check Logic', () => {
  interface UserStats {
    totalTests: number;
    maxScore: number;
    totalQuizzes: number;
    streakDays: number;
    masteryCount: number;
  }

  const checks = [
    { title: 'First Steps', check: (s: UserStats) => s.totalTests >= 1 },
    { title: 'Quick Learner', check: (s: UserStats) => s.maxScore >= 90 },
    { title: 'Perfect Score', check: (s: UserStats) => s.maxScore >= 100 },
    { title: 'Quiz Champion', check: (s: UserStats) => s.totalQuizzes >= 20 },
    { title: 'Streak Master', check: (s: UserStats) => s.streakDays >= 7 },
    { title: 'Subject Expert', check: (s: UserStats) => s.masteryCount >= 5 },
  ];

  it('should award First Steps when user has completed 1+ tests', () => {
    const stats: UserStats = { totalTests: 1, maxScore: 70, totalQuizzes: 0, streakDays: 0, masteryCount: 0 };
    const matched = checks.filter(c => c.check(stats)).map(c => c.title);
    expect(matched).toContain('First Steps');
    expect(matched).not.toContain('Quick Learner');
  });

  it('should award Quick Learner when score >= 90', () => {
    const stats: UserStats = { totalTests: 5, maxScore: 92, totalQuizzes: 5, streakDays: 0, masteryCount: 0 };
    const matched = checks.filter(c => c.check(stats)).map(c => c.title);
    expect(matched).toContain('First Steps');
    expect(matched).toContain('Quick Learner');
    expect(matched).not.toContain('Perfect Score');
  });

  it('should award Perfect Score when score = 100', () => {
    const stats: UserStats = { totalTests: 3, maxScore: 100, totalQuizzes: 3, streakDays: 0, masteryCount: 0 };
    const matched = checks.filter(c => c.check(stats)).map(c => c.title);
    expect(matched).toContain('Perfect Score');
    expect(matched).toContain('Quick Learner');
  });

  it('should award multiple achievements at once', () => {
    const stats: UserStats = { totalTests: 25, maxScore: 100, totalQuizzes: 25, streakDays: 10, masteryCount: 6 };
    const matched = checks.filter(c => c.check(stats)).map(c => c.title);
    expect(matched).toHaveLength(6);
  });

  it('should award nothing for empty stats', () => {
    const stats: UserStats = { totalTests: 0, maxScore: 0, totalQuizzes: 0, streakDays: 0, masteryCount: 0 };
    const matched = checks.filter(c => c.check(stats)).map(c => c.title);
    expect(matched).toHaveLength(0);
  });
});
