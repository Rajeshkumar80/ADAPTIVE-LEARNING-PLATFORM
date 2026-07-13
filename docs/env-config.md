# Environment Configuration

## Required (dev + prod)

| Variable | Dev Default | Prod Value | Notes |
|----------|------------|------------|-------|
| `DATABASE_URL` | Set in jest.setup.js | Railway/Render URL | Prisma connection string |
| `JWT_SECRET` | Fail-fast (must set) | Random 32+ char string | Fail-fast if missing |
| `GEMINI_API_KEY` | User's key | Same key | Gemini 2.5 Flash |

## Optional (feature toggles)

| Variable | Dev Default | Prod Value | Notes |
|----------|------------|------------|-------|
| `REDIS_URL` | Unset (in-memory) | Redis URL | Enables Redis cache |
| `SENTRY_DSN` | Unset (console.log) | Sentry DSN | Enables Sentry error reporting |
| `CORS_ORIGINS` | `http://localhost:3000` | `https://your-domain.com` | Comma-separated origins |
| `PORT` | `8001` | Platform-provided | Railway/Render set this |
| `JWT_EXPIRES_IN` | `24h` | `24h` | Token expiry |
| `NODE_ENV` | `development` | `production` | Controls Prisma logging |

## Dev vs Prod Behavior

- **Prisma logging**: `['error', 'warn']` in dev, `['error']` in prod
- **CORS**: Configurable via `CORS_ORIGINS` comma-separated list
- **Cache**: In-memory when `REDIS_URL` unset, Redis when set
- **Error tracking**: Console logs when `SENTRY_DSN` unset, Sentry when set
- **JWT**: Fail-fast validation in all environments

## No Changes Needed

All env vars have sensible dev defaults. Production just needs real values for `DATABASE_URL`, `JWT_SECRET`, and `CORS_ORIGINS`.
