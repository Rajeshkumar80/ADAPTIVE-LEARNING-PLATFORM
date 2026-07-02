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

export default router;
