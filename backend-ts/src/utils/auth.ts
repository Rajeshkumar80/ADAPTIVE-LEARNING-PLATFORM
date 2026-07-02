import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production-please';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed);
}

export function createToken(payload: { id: number; username: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES as any });
}

export function verifyToken(token: string): { id: number; username: string; role: string } {
  return jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string };
}
