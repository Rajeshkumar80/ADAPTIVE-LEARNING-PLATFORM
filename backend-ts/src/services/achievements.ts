import { prisma } from '../prisma';

interface AchievementDef {
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  check: (stats: UserStats) => boolean;
}

interface UserStats {
  totalTests: number;
  maxScore: number;
  totalQuizzes: number;
  streakDays: number;
  masteryCount: number;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { title: 'First Steps', description: 'Completed your first test', icon: '🎯', rarity: 'common', check: s => s.totalTests >= 1 },
  { title: 'Quick Learner', description: 'Scored 90%+ on a test', icon: '⚡', rarity: 'rare', check: s => s.maxScore >= 90 },
  { title: 'Perfect Score', description: 'Got 100% on any test', icon: '💯', rarity: 'epic', check: s => s.maxScore >= 100 },
  { title: 'Quiz Champion', description: 'Completed 20 quizzes', icon: '🏅', rarity: 'rare', check: s => s.totalQuizzes >= 20 },
  { title: 'Streak Master', description: '7-day study streak', icon: '🔥', rarity: 'rare', check: s => s.streakDays >= 7 },
  { title: 'Subject Expert', description: 'Mastered 5+ topics', icon: '🏆', rarity: 'legendary', check: s => s.masteryCount >= 5 },
];

export async function checkAndAwardAchievements(userId: number): Promise<string[]> {
  const [testAttempts, quizCount, masteryCount] = await Promise.all([
    prisma.testAttempt.findMany({ where: { userId, isCompleted: true }, select: { score: true } }),
    prisma.testAttempt.count({ where: { userId, isCompleted: true } }),
    prisma.userTopicProgress.count({ where: { userId, mastery: { gte: 0.8 } } }),
  ]);

  const maxScore = testAttempts.length > 0 ? Math.max(...testAttempts.map(a => a.score || 0)) : 0;

  // Calculate streak (simplified: count consecutive days with activity)
  const activities = await prisma.learningEvent.findMany({
    where: { userId },
    select: { timestamp: true },
    orderBy: { timestamp: 'desc' },
    take: 30,
  });
  const streakDays = calculateStreak(activities.map(a => a.timestamp));

  const stats: UserStats = {
    totalTests: testAttempts.length,
    maxScore,
    totalQuizzes: quizCount,
    streakDays,
    masteryCount,
  };

  // Get existing achievements
  const existing = await prisma.achievement.findMany({ where: { userId }, select: { title: true } });
  const existingTitles = new Set(existing.map(a => a.title));

  const awarded: string[] = [];

  for (const def of ACHIEVEMENT_DEFS) {
    if (!existingTitles.has(def.title) && def.check(stats)) {
      await prisma.achievement.create({
        data: {
          userId,
          title: def.title,
          description: def.description,
          icon: def.icon,
          rarity: def.rarity,
          earnedDate: new Date(),
        },
      });
      awarded.push(def.title);
    }
  }

  return awarded;
}

function calculateStreak(timestamps: Date[]): number {
  if (timestamps.length === 0) return 0;
  const days = [...new Set(timestamps.map(t => new Date(t).toDateString()))];
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}
