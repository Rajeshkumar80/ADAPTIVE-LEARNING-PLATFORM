// Set required env vars for tests
process.env.JWT_SECRET = 'test-secret-for-jest-only';
process.env.JWT_EXPIRES_IN = '1h';
