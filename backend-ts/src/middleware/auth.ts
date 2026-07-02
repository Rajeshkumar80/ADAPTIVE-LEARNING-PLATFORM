import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { prisma } from '../prisma';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Not authenticated' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ detail: 'Admin access required' });
    }
    next();
  });
}

export function requireStudent(req: AuthRequest, res: Response, next: NextFunction) {
  authenticate(req, res, () => {
    if (req.user?.role !== 'student') {
      return res.status(403).json({ detail: 'Student access required' });
    }
    next();
  });
}
