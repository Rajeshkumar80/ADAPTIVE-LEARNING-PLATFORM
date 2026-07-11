import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { hashPassword, verifyPassword, createToken } from '../utils/auth';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().optional(),
  role: z.enum(['student', 'admin']).optional(),
  usn: z.string().optional(),
  employee_id: z.string().optional(),
});

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ detail: 'Validation failed', errors: parsed.error.issues.map(i => i.message) });
    }
    const { email, username, password, full_name, role, usn, employee_id } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (existing) {
      return res.status(400).json({ detail: 'Email or username already registered' });
    }

    const userRole = role === 'admin' ? 'admin' : 'student';
    const user = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword: hashPassword(password),
        fullName: full_name || '',
        role: userRole,
        ...(userRole === 'student'
          ? { semester: 6, branch: 'Computer Science', section: 'A', usn: usn || undefined }
          : { employeeId: employee_id || 'EMP-NEW', department: 'Computer Science' }),
      },
    });

    const token = createToken({ id: user.id, username: user.username, role: user.role });
    return res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.fullName,
        role: user.role,
        usn: user.usn,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/auth/login (OAuth2 form)
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ detail: 'Validation failed', errors: parsed.error.issues.map(i => i.message) });
    }
    const { username, password } = parsed.data;

    const input = username.toLowerCase().trim();
    const user = await prisma.user.findFirst({
      where: { OR: [{ username: input }, { email: input }] },
    });

    if (!user || !verifyPassword(password, user.hashedPassword)) {
      return res.status(401).json({ detail: 'Incorrect username or password' });
    }
    if (!user.isActive) {
      return res.status(400).json({ detail: 'Inactive user' });
    }

    const token = createToken({ id: user.id, username: user.username, role: user.role });
    return res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.fullName,
        role: user.role,
        usn: user.usn,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, (_req: AuthRequest, res: Response) => {
  return res.json({ message: 'Successfully logged out' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(404).json({ detail: 'User not found' });

    return res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.fullName,
      role: user.role,
      usn: user.usn,
      semester: user.semester,
      branch: user.branch,
      section: user.section,
      cgpa: user.cgpa,
      employee_id: user.employeeId,
      department: user.department,
      is_active: user.isActive,
      created_at: user.createdAt,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
