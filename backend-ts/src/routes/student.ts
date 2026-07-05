import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, requireStudent, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/student/dashboard
router.get('/dashboard', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const attempts = await prisma.testAttempt.findMany({ where: { userId, isCompleted: true } });
    const mastery = await prisma.topicMastery.findMany({ where: { userId } });
    const sessions = await prisma.studySession.findMany({ where: { userId } });
    const achievements = await prisma.achievement.findMany({ where: { userId } });

    const certificates = await prisma.certificate.findMany({ where: { userId } });
    const totalHours = sessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;
    const avgScore = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0;

    // Calculate streak from study sessions
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const hasSession = sessions.some(s => s.startedAt.toISOString().startsWith(dayStr));
      if (hasSession) streak++;
      else if (i > 0) break;
    }

    return res.json({
      streak,
      avg_score: Math.round(avgScore * 10) / 10,
      hours_this_week: Math.round(totalHours * 10) / 10,
      topics_mastered: mastery.filter(m => m.mastery >= 90).length,
      total_topics: mastery.length,
      achievements_count: achievements.length,
      certificates_count: certificates.length,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/student/profile
router.get('/profile', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ detail: 'User not found' });
    return res.json({
      id: user.id, email: user.email, username: user.username,
      full_name: user.fullName, role: user.role, usn: user.usn,
      semester: user.semester, branch: user.branch, section: user.section,
      cgpa: user.cgpa, created_at: user.createdAt,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// PUT /api/student/profile
router.put('/profile', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const { semester, section, branch, full_name } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(semester && { semester }),
        ...(section && { section }),
        ...(branch && { branch }),
        ...(full_name && { fullName: full_name }),
      },
    });
    return res.json({ message: 'Profile updated', user: { full_name: user.fullName, semester: user.semester, section: user.section, branch: user.branch } });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/student/subjects
router.get('/subjects', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    const subjects = await prisma.subject.findMany({ where: { semester: user?.semester || 6 } });
    return res.json(subjects.map(s => ({ id: s.id, code: s.code, name: s.name, credits: s.credits, type: s.type })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/student/progress
router.get('/progress', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const mastery = await prisma.topicMastery.findMany({
      where: { userId: req.user!.id },
      include: { topic: { include: { subject: true } } },
    });
    return res.json(mastery.map(m => ({
      topic: m.topic.name,
      subject: m.topic.subject.name,
      mastery: m.mastery,
      forgetting_risk: m.forgettingRisk,
      last_reviewed: m.lastReviewed,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/student/leaderboard
router.get('/leaderboard', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const students = await prisma.user.findMany({ where: { role: 'student' } });
    const byCgpa = students.sort((a, b) => b.cgpa - a.cgpa).slice(0, 20).map(s => ({
      usn: s.usn, name: s.fullName, cgpa: s.cgpa, section: s.section,
    }));

    const withScores = await Promise.all(
      students.slice(0, 20).map(async (s) => {
        const attempts = await prisma.testAttempt.findMany({ where: { userId: s.id, isCompleted: true } });
        const avg = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0;
        return { usn: s.usn, name: s.fullName, avg_score: Math.round(avg * 10) / 10, section: s.section };
      })
    );
    const byTestScore = withScores.sort((a, b) => b.avg_score - a.avg_score);

    return res.json({ by_cgpa: byCgpa, by_test_score: byTestScore });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/student/achievements
router.get('/achievements', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const achievements = await prisma.achievement.findMany({ where: { userId: req.user!.id } });
    return res.json(achievements.map(a => ({ id: a.id, title: a.title, description: a.description, icon: a.icon, earned_date: a.earnedDate, rarity: a.rarity })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/student/certificates
router.get('/certificates', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const certs = await prisma.certificate.findMany({ where: { userId: req.user!.id } });
    return res.json(certs.map(c => ({ id: c.id, title: c.title, subject: c.subject, issued_date: c.issuedDate, score: c.score, type: c.type })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
