import { hashPassword, verifyPassword, createToken, verifyToken } from '../utils/auth';

describe('Auth Utilities', () => {
  describe('hashPassword', () => {
    it('returns a hash different from plaintext', async () => {
      const hash = await hashPassword('testpass');
      expect(hash).not.toBe('testpass');
      expect(hash.length).toBeGreaterThan(10);
    });
  });

  describe('verifyPassword', () => {
    it('returns true for correct password', async () => {
      const hash = await hashPassword('mypassword');
      const result = await verifyPassword('mypassword', hash);
      expect(result).toBe(true);
    });

    it('returns false for wrong password', async () => {
      const hash = await hashPassword('mypassword');
      const result = await verifyPassword('wrongpass', hash);
      expect(result).toBe(false);
    });
  });

  describe('createToken / verifyToken', () => {
    it('creates and verifies a valid token', () => {
      const payload = { id: 1, username: 'testuser', role: 'student' };
      const token = createToken(payload);
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded!.id).toBe(1);
      expect(decoded!.username).toBe('testuser');
      expect(decoded!.role).toBe('student');
    });

    it('throws for invalid token', () => {
      expect(() => verifyToken('invalid.token.here')).toThrow();
    });
  });
});
