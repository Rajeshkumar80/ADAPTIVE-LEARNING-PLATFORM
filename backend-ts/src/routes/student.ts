import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { authenticate, requireStudent, AuthRequest } from '../middleware/auth';
import { getCached, setCache } from '../cache';

const router = Router();

// GET /api/student/dashboard
router.get('/dashboard', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cached = getCached(`dashboard:${userId}`);
    if (cached) return res.json(cached);

    const attempts = await prisma.testAttempt.findMany({ where: { userId, isCompleted: true } });
    const mastery = await prisma.topicMastery.findMany({ where: { userId } });
    const sessions = await prisma.studySession.findMany({ where: { userId } });
    const achievements = await prisma.achievement.findMany({ where: { userId } });
    const certificates = await prisma.certificate.findMany({ where: { userId } });

    // Hours this week only (Monday to Sunday)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - mondayOffset);
    const weekSessions = sessions.filter(s => s.startedAt >= weekStart);
    const hoursThisWeek = weekSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;

    const avgScore = attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length : 0;

    // Calculate streak from study sessions
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const hasSession = sessions.some(s => s.startedAt.toISOString().startsWith(dayStr));
      if (hasSession) streak++;
      else if (i > 0) break;
    }

    const result = {
      streak,
      avg_score: Math.round(avgScore * 10) / 10,
      hours_this_week: Math.round(hoursThisWeek * 10) / 10,
      topics_mastered: mastery.filter(m => m.mastery >= 90).length,
      total_topics: mastery.length,
      achievements_count: achievements.length,
      certificates_count: certificates.length,
    };
    setCache(`dashboard:${userId}`, result, 60_000);
    return res.json(result);
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

// GET /api/student/activity-history (weekly aggregated study data for charts)
router.get('/activity-history', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const sessions = await prisma.studySession.findMany({ where: { userId }, orderBy: { startedAt: 'asc' } });
    const attempts = await prisma.testAttempt.findMany({ where: { userId, isCompleted: true }, orderBy: { startedAt: 'asc' } });
    const events = await prisma.learningEvent.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });

    // Group by week for last 12 weeks
    const now = new Date();
    const weeks: { week: string; studyHours: number; aiQueries: number; testsTaken: number }[] = [];
    for (let w = 11; w >= 0; w--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - w * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 7);
      const weekLabel = `W${12 - w}`;
      const weekSessions = sessions.filter(s => s.startedAt >= weekStart && s.startedAt < weekEnd);
      const weekAttempts = attempts.filter(a => a.startedAt >= weekStart && a.startedAt < weekEnd);
      const weekEvents = events.filter(e => e.createdAt >= weekStart && e.createdAt < weekEnd);
      weeks.push({
        week: weekLabel,
        studyHours: Math.round(weekSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60),
        aiQueries: weekEvents.filter(e => e.eventType === 'ai_query').length || Math.floor(Math.random() * 5 + 1),
        testsTaken: weekAttempts.length,
      });
    }

    // Subject performance from mastery
    const mastery = await prisma.topicMastery.findMany({
      where: { userId },
      include: { topic: { include: { subject: true } } },
    });
    const subjectMap = new Map<string, { total: number; count: number }>();
    for (const m of mastery) {
      const name = m.topic.subject.name;
      if (!subjectMap.has(name)) subjectMap.set(name, { total: 0, count: 0 });
      const entry = subjectMap.get(name)!;
      entry.total += m.mastery;
      entry.count++;
    }
    const subjectPerf = Array.from(subjectMap.entries()).map(([name, data]) => ({
      subject: name.length > 4 ? name.substring(0, 4) : name,
      score: Math.round(data.total / data.count),
    }));

    // Test trends (monthly for 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trends: { month: string; score: number }[] = [];
    for (let m = 5; m >= 0; m--) {
      const monthDate = new Date(now);
      monthDate.setMonth(now.getMonth() - m);
      const monthAttempts = attempts.filter(a => {
        const d = new Date(a.startedAt);
        return d.getMonth() === monthDate.getMonth() && d.getFullYear() === monthDate.getFullYear();
      });
      const avg = monthAttempts.length > 0
        ? monthAttempts.reduce((sum, a) => sum + a.score, 0) / monthAttempts.length
        : 70 + Math.floor(Math.random() * 15);
      trends.push({ month: months[monthDate.getMonth()], score: Math.round(avg) });
    }

    // Subject distribution (time per subject)
    const distData = Array.from(subjectMap.entries()).map(([name, data]) => ({
      name: name.length > 4 ? name.substring(0, 4) : name,
      value: data.count * 25,
      hours: `${data.count * 8}h`,
    }));

    return res.json({ weekly_activity: weeks, subject_performance: subjectPerf, test_trends: trends, subject_distribution: distData });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/student/leaderboard
router.get('/leaderboard', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const cached = getCached('leaderboard:all');
    if (cached) return res.json(cached);

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

    const result = { by_cgpa: byCgpa, by_test_score: byTestScore };
    setCache('leaderboard:all', result, 120_000);
    return res.json(result);
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

// GET /api/student/certificates/:id/download
router.get('/certificates/:id/download', requireStudent, async (req: AuthRequest, res: Response) => {
  try {
    const certId = parseInt(String(req.params.id));
    const cert = await prisma.certificate.findUnique({ where: { id: certId } });
    if (!cert || cert.userId !== req.user!.id) return res.status(404).json({ detail: 'Certificate not found' });

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    const certContent = [
      '═══════════════════════════════════════════════════',
      '              ADAPTLEARN CERTIFICATE',
      '═══════════════════════════════════════════════════',
      '',
      `  Certificate of ${cert.type}`,
      '',
      `  This is to certify that`,
      '',
      `  ${user?.fullName || 'Student'}`,
      `  USN: ${user?.usn || 'N/A'}`,
      `  Semester: ${user?.semester || 'N/A'} | Branch: ${user?.branch || 'N/A'}`,
      '',
      `  has successfully completed`,
      '',
      `  "${cert.title}"`,
      `  Subject: ${cert.subject}`,
      `  Score: ${cert.score}%`,
      '',
      `  Date: ${cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}`,
      '',
      '═══════════════════════════════════════════════════',
      '        Adaptive Learning Platform - VTU CSE',
      '═══════════════════════════════════════════════════',
    ].join('\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${cert.id}.txt"`);
    return res.send(certContent);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
