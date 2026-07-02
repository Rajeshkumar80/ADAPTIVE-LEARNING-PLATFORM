import express from 'express';
import cors from 'cors';
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

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/vtu', vtuRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/ingestion', ingestionRoutes);
app.use('/api/learning-state', learningStateRoutes);
app.use('/api/study-plan', studyPlanRoutes);

// Health
app.get('/', (_req, res) => res.json({ name: 'AdaptLearn API', version: '2.0.0', stack: 'Node.js/TypeScript' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// 404
app.use((_req, res) => res.status(404).json({ detail: 'Not found' }));

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ detail: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`AdaptLearn TS backend running on http://localhost:${PORT}`);
  console.log(`API docs at http://localhost:${PORT}/docs`);
});

export default app;
