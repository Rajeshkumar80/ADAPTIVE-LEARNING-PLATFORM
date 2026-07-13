# Rate Limit Configuration

## Current Settings

| Endpoint | Window | Max | Req/min | Rationale |
|----------|--------|-----|---------|-----------|
| Global | 15 min | 500 | ~33 | Generous for demo; prevents abuse without blocking normal use |
| Auth | 15 min | 20 | ~1.3 | Tight — prevents brute force; 20 login attempts is generous |
| AI | 1 min | 15 | 15 | Matches Gemini API free tier (~15 RPM); prevents quota burn |
| Upload | 1 min | 10 | 10 | Prevents storage abuse; 10 file uploads/min is generous |

## Why These Values

- **No real load test conducted** — limits are set for a portfolio/demo app, not production traffic
- Auth limit (20/15min) prevents credential stuffing while allowing legitimate retries
- AI limit (15/min) aligns with Gemini 2.5 Flash free tier rate limits
- Global limit (500/15min) allows ~33 req/sec sustained — more than enough for a single-user demo
- Upload limit prevents storage exhaustion from repeated large file uploads

## Tuning for Production

If this app were deployed for real traffic:
1. Run a load test (k6/artillery) to measure actual RPS
2. Set global limit to 2-3x observed peak RPS
3. Set auth limit based on acceptable lockout duration
4. Set AI limit based on actual API quota
