import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { requireAdmin, AuthRequest } from '../middleware/auth';
import { hashPassword } from '../utils/auth';

const router = Router();

// GET /api/admin/dashboard
router.get('/dashboard', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'student' } });
    const activeTests = await prisma.test.count({ where: { isActive: true } });
    const flagsCount = await prisma.antiCheatFlag.count();

    const avgResult = await prisma.testAttempt.aggregate({
      where: { isCompleted: true },
      _avg: { score: true },
    });

    return res.json({
      total_students: totalStudents,
      active_tests: activeTests,
      flags_count: flagsCount,
      avg_performance: avgResult._avg.score ? Math.round(avgResult._avg.score * 10) / 10 : 0,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/students
router.get('/students', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { section, semester } = req.query as { section?: string; semester?: string };
    const where: any = { role: 'student' };
    if (section) where.section = section;
    if (semester) where.semester = parseInt(semester);

    const students = await prisma.user.findMany({ where, orderBy: { usn: 'asc' } });
    return res.json(students.map(s => ({
      id: s.id, email: s.email, username: s.username, full_name: s.fullName,
      role: s.role, usn: s.usn, semester: s.semester, branch: s.branch,
      section: s.section, cgpa: s.cgpa, is_active: s.isActive, created_at: s.createdAt,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/students/:usn
router.get('/students/:usn', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usn = String(req.params.usn);
    const student = await prisma.user.findFirst({ where: { usn, role: 'student' } });
    if (!student) return res.status(404).json({ detail: 'Student not found' });
    return res.json({
      id: student.id, email: student.email, username: student.username, full_name: student.fullName,
      role: student.role, usn: student.usn, semester: student.semester, branch: student.branch,
      section: student.section, cgpa: student.cgpa, is_active: student.isActive,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/admin/students
router.post('/students', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { email, username, password, full_name, usn, semester, branch, section, cgpa } = req.body;
    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }, ...(usn ? [{ usn }] : [])] } });
    if (existing) return res.status(400).json({ detail: 'Student already exists' });

    const user = await prisma.user.create({
      data: {
        email, username, hashedPassword: hashPassword(password || usn?.toLowerCase() || 'student123'),
        fullName: full_name || '', role: 'student', usn,
        semester: semester || 6, branch: branch || 'Computer Science',
        section: section || 'A', cgpa: cgpa || 0,
      },
    });
    return res.json({ id: user.id, email: user.email, usn: user.usn, full_name: user.fullName });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// PUT /api/admin/students/:usn
router.put('/students/:usn', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usn = String(req.params.usn);
    const student = await prisma.user.findFirst({ where: { usn, role: 'student' } });
    if (!student) return res.status(404).json({ detail: 'Student not found' });

    const { email, username, full_name, semester, branch, section, cgpa, is_active, password } = req.body;
    const updated = await prisma.user.update({
      where: { id: student.id },
      data: {
        ...(email && { email }),
        ...(username && { username }),
        ...(full_name && { fullName: full_name }),
        ...(semester && { semester }),
        ...(branch && { branch }),
        ...(section && { section }),
        ...(cgpa !== undefined && { cgpa }),
        ...(is_active !== undefined && { isActive: is_active }),
        ...(password && { hashedPassword: hashPassword(password) }),
      },
    });
    return res.json({ id: updated.id, email: updated.email, full_name: updated.fullName, usn: updated.usn });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// DELETE /api/admin/students/:usn
router.delete('/students/:usn', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usn = String(req.params.usn);
    const student = await prisma.user.findFirst({ where: { usn, role: 'student' } });
    if (!student) return res.status(404).json({ detail: 'Student not found' });
    await prisma.user.delete({ where: { id: student.id } });
    return res.json({ message: 'Student successfully deleted' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/admin/students/import (bulk JSON import)
router.post('/students/import', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const students = req.body;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ detail: 'Expected array of students' });
    }
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];
    for (const s of students) {
      try {
        const usn = s.usn || s.USN;
        const email = s.email || s.Email || `${usn}@gcem.edu`;
        const fullName = s.full_name || s.Full_Name || s.name || '';
        const semester = s.semester || 6;
        const branch = s.branch || s.Branch || 'Computer Science';
        const section = s.section || s.Section || 'A';
        const cgpa = s.cgpa || s.CGPA || 0;
        if (!usn) { skipped++; errors.push(`Missing USN`); continue; }
        const existing = await prisma.user.findFirst({ where: { OR: [{ usn }, { email }] } });
        if (existing) { skipped++; continue; }
        await prisma.user.create({
          data: {
            email, username: usn.toLowerCase(), hashedPassword: hashPassword('student123'),
            fullName, role: 'student', usn, semester: Number(semester), branch,
            section: String(section), cgpa: Number(cgpa),
          },
        });
        imported++;
      } catch (e: any) {
        skipped++;
        errors.push(e.message);
      }
    }
    return res.json({ imported, skipped, total: students.length, errors: errors.slice(0, 10) });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/analytics
router.get('/analytics', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'student' } });
    const totalTests = await prisma.test.count();
    const avgResult = await prisma.testAttempt.aggregate({ where: { isCompleted: true }, _avg: { score: true } });
    const topStudents = await prisma.user.findMany({ where: { role: 'student' }, orderBy: { cgpa: 'desc' }, take: 5 });

    return res.json({
      total_students: totalStudents,
      total_tests: totalTests,
      avg_score: avgResult._avg.score ? Math.round(avgResult._avg.score * 10) / 10 : 0,
      top_performers: topStudents.map(s => ({ usn: s.usn, name: s.fullName, cgpa: s.cgpa })),
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/subjects
router.get('/subjects', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany({ orderBy: { code: 'asc' } });
    return res.json(subjects.map(s => ({ id: s.id, code: s.code, name: s.name, credits: s.credits, semester: s.semester, type: s.type })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/anti-cheat-flags
router.get('/anti-cheat-flags', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const flags = await prisma.antiCheatFlag.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return res.json(flags.map(f => ({
      id: f.id, user_id: f.userId, severity: f.severity, violation: f.violation,
      count: f.count, created_at: f.createdAt,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/reports/performance
router.get('/reports/performance', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const students = await prisma.user.findMany({ where: { role: 'student' }, orderBy: { usn: 'asc' } });
    const attempts = await prisma.testAttempt.findMany({ where: { isCompleted: true } });
    const mastery = await prisma.topicMastery.findMany();

    const studentStats = students.map(s => {
      const studentAttempts = attempts.filter(a => a.userId === s.id);
      const studentMastery = mastery.filter(m => m.userId === s.id);
      const avgScore = studentAttempts.length > 0
        ? studentAttempts.reduce((sum, a) => sum + a.score, 0) / studentAttempts.length
        : 0;
      const avgMastery = studentMastery.length > 0
        ? studentMastery.reduce((sum, m) => sum + m.mastery, 0) / studentMastery.length
        : 0;
      return {
        usn: s.usn, name: s.fullName, cgpa: s.cgpa,
        tests_taken: studentAttempts.length,
        avg_score: Math.round(avgScore * 10) / 10,
        avg_mastery: Math.round(avgMastery * 10) / 10,
      };
    });

    const overallAvg = studentStats.length > 0
      ? studentStats.reduce((sum, s) => sum + s.avg_score, 0) / studentStats.length
      : 0;
    const passRate = attempts.length > 0
      ? (attempts.filter(a => a.score >= 50).length / attempts.length) * 100
      : 0;

    return res.json({
      total_students: students.length,
      overall_avg_score: Math.round(overallAvg * 10) / 10,
      pass_rate: Math.round(passRate * 10) / 10,
      total_attempts: attempts.length,
      students: studentStats,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/reports/tests
router.get('/reports/tests', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const tests = await prisma.test.findMany({ orderBy: { createdAt: 'desc' }, include: { subject: true } });
    const attempts = await prisma.testAttempt.findMany({ where: { isCompleted: true } });

    const testStats = tests.map(t => {
      const testAttempts = attempts.filter(a => a.testId === t.id);
      const avgScore = testAttempts.length > 0
        ? testAttempts.reduce((sum, a) => sum + a.score, 0) / testAttempts.length
        : 0;
      const passRate = testAttempts.length > 0
        ? (testAttempts.filter(a => a.score >= (t.passingMarks / t.totalMarks * 100)).length / testAttempts.length) * 100
        : 0;
      return {
        id: t.id, title: t.title, subject: t.subject?.name || 'N/A',
        total_marks: t.totalMarks, passing_marks: t.passingMarks,
        attempts: testAttempts.length,
        avg_score: Math.round(avgScore * 10) / 10,
        pass_rate: Math.round(passRate * 10) / 10,
      };
    });

    return res.json({ tests: testStats, total_tests: tests.length });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/reports/engagement
router.get('/reports/engagement', requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const students = await prisma.user.findMany({ where: { role: 'student' } });
    const sessions = await prisma.studySession.findMany();
    const events = await prisma.learningEvent.findMany();
    const achievements = await prisma.achievement.findMany();

    const engagementStats = students.map(s => {
      const studentSessions = sessions.filter(sess => sess.userId === s.id);
      const studentEvents = events.filter(e => e.userId === s.id);
      const studentAchievements = achievements.filter(a => a.userId === s.id);
      const totalMinutes = studentSessions.reduce((sum, sess) => sum + sess.durationMinutes, 0);
      return {
        usn: s.usn, name: s.fullName,
        total_hours: Math.round(totalMinutes / 60 * 10) / 10,
        sessions: studentSessions.length,
        events: studentEvents.length,
        achievements: studentAchievements.length,
      };
    });

    const activeStudents = engagementStats.filter(s => s.total_hours > 0).length;
    const avgHours = engagementStats.length > 0
      ? engagementStats.reduce((sum, s) => sum + s.total_hours, 0) / engagementStats.length
      : 0;

    return res.json({
      total_students: students.length,
      active_students: activeStudents,
      avg_hours_per_student: Math.round(avgHours * 10) / 10,
      total_sessions: sessions.length,
      total_events: events.length,
      students: engagementStats,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/admin/reports/export/:type (CSV export)
router.get('/reports/export/:type', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.params;
    let csv = '';
    if (type === 'performance') {
      const students = await prisma.user.findMany({ where: { role: 'student' }, orderBy: { usn: 'asc' } });
      const attempts = await prisma.testAttempt.findMany({ where: { isCompleted: true } });
      csv = 'USN,Name,Semester,Section,CGPA,Tests Taken,Avg Score\n';
      for (const s of students) {
        const sa = attempts.filter(a => a.userId === s.id);
        const avg = sa.length > 0 ? (sa.reduce((sum, a) => sum + a.score, 0) / sa.length).toFixed(1) : '0';
        csv += `${s.usn},"${s.fullName}",${s.semester},${s.section},${s.cgpa},${sa.length},${avg}\n`;
      }
    } else if (type === 'engagement') {
      const students = await prisma.user.findMany({ where: { role: 'student' } });
      const sessions = await prisma.studySession.findMany();
      csv = 'USN,Name,Total Hours,Sessions\n';
      for (const s of students) {
        const ss = sessions.filter(sess => sess.userId === s.id);
        const hours = (ss.reduce((sum, sess) => sum + sess.durationMinutes, 0) / 60).toFixed(1);
        csv += `${s.usn},"${s.fullName}",${hours},${ss.length}\n`;
      }
    } else if (type === 'tests') {
      const tests = await prisma.test.findMany();
      const attempts = await prisma.testAttempt.findMany({ where: { isCompleted: true } });
      csv = 'ID,Title,Total Marks,Passing Marks,Attempts,Avg Score,Pass Rate\n';
      for (const t of tests) {
        const ta = attempts.filter(a => a.testId === t.id);
        const avg = ta.length > 0 ? (ta.reduce((sum, a) => sum + a.score, 0) / ta.length).toFixed(1) : '0';
        const passRate = ta.length > 0 ? ((ta.filter(a => a.score >= (t.passingMarks / t.totalMarks * 100)).length / ta.length) * 100).toFixed(1) : '0';
        csv += `${t.id},"${t.title}",${t.totalMarks},${t.passingMarks},${ta.length},${avg},${passRate}\n`;
      }
    } else {
      return res.status(400).json({ detail: 'Invalid export type. Use: performance, engagement, tests' });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report.csv"`);
    return res.send(csv);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
