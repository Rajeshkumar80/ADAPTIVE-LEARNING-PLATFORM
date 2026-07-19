// Set required env vars for tests
process.env.JWT_SECRET = 'test-secret-for-jest-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.GEMINI_API_KEY = 'test-gemini-key';
// ponytail: no real DB needed for unit tests — but prisma client still imports,
// so set a dummy URL to prevent connection errors at import time
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://unused:unused@localhost:5432/unused';
}
