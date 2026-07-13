# Production Deployment Plan

## Blocked: No deployment tools available

The following tools are required but not installed:
- **Vercel CLI** (`npm i -g vercel`) — for frontend deployment
- **Railway CLI** or **Render** — for backend + PostgreSQL
- **Docker** — optional for containerized deployment

## Deployment Steps (When Tools Available)

### Frontend (Vercel)
```bash
cd frontend
npm i -g vercel
vercel login
vercel --prod
```
Set env var: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

### Backend (Railway)
```bash
npm i -g @railway/cli
railway login
railway init
railway add postgresql
railway deploy
```
Set env vars: `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, `GEMINI_API_KEY`, `CORS_ORIGINS`

### Backend (Render alternative)
1. Connect GitHub repo to Render
2. Create a PostgreSQL database
3. Set build command: `cd backend-ts && npm install && npx prisma generate && npx prisma db push`
4. Set start command: `cd backend-ts && node dist/index.js`

## Current Status
- Backend: Ready to deploy (all code committed, tests pass)
- Frontend: Ready to deploy (TypeScript clean, no build errors)
- Database: PostgreSQL schema ready (prisma/schema.prisma)
- Blocker: No deployment CLI tools installed on this machine
