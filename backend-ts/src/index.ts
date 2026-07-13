import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../.env') });
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import authRoutes from './routes/auth';
import studentRoutes from './routes/student';
import adminRoutes from './routes/admin';
import testRoutes from './routes/tests';
import learningRoutes from './routes/learning';
import vtuRoutes from './routes/vtu';
import notificationRoutes from './routes/notifications';
import plannerRoutes from './routes/planner';
import journalRoutes from './routes/journal';
import aiRoutes from './routes/ai';
import ingestionRoutes from './routes/ingestion';
import learningStateRoutes from './routes/learning-state';
import studyPlanRoutes from './routes/study-plan';
import documentRoutes from './routes/documents';
import { prisma } from './prisma';
import { getCacheStats } from './cache';
import { globalLimiter, authLimiter, aiLimiter } from './middleware/rate-limit';
import { securityHeaders, sanitizeInput } from './middleware/security';
import { initWebSocket } from './websocket';
import { captureError } from './error-tracking';

const app = express();
const PORT = process.env.PORT || 8001;

// Security
app.use(securityHeaders);
app.use(globalLimiter);
app.use(sanitizeInput);

// Response timing middleware
app.use((_req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    if (ms > 100) console.warn(`SLOW ${_req.method} ${_req.originalUrl} ${ms}ms`);
  });
  next();
});

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'] }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Cache-Control headers for static-ish data
app.use('/api/student/subjects', (_req, res, next) => { res.setHeader('Cache-Control', 'public, max-age=300'); next(); });
app.use('/api/vtu', (_req, res, next) => { res.setHeader('Cache-Control', 'public, max-age=600'); next(); });
app.use('/api/student/leaderboard', (_req, res, next) => { res.setHeader('Cache-Control', 'public, max-age=120'); next(); });

// Routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/vtu', vtuRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/learning-state', learningStateRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/documents', documentRoutes);

// Health
app.get('/', (_req, res) => res.json({ name: 'AdaptLearn API', version: '2.0.0', stack: 'Node.js/TypeScript' }));
app.get('/api/health', async (_req, res) => {
  try {
    const [users, tests, events, subjects] = await Promise.all([
      prisma.user.count(),
      prisma.test.count(),
      prisma.learningEvent.count(),
      prisma.subject.count(),
    ]);
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: { users, tests, learning_events: events, subjects },
      cache: getCacheStats(),
    });
  } catch {
    res.status(503).json({ status: 'error', timestamp: new Date().toISOString() });
  }
});

// 404
app.use((_req, res) => res.status(404).json({ detail: 'Not found' }));

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  captureError(err, { url: _req.originalUrl, method: _req.method });
  res.status(500).json({ detail: 'Internal server error' });
});

const server = createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`AdaptLearn TS backend running on http://localhost:${PORT}`);
  console.log(`API docs at http://localhost:${PORT}/docs`);
  console.log(`WebSocket ready on ws://localhost:${PORT}`);
});

export default app;
