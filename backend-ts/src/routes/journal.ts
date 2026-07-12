import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const createEntrySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(5000).optional(),
  mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

const updateEntrySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().max(5000).optional(),
  mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  starred: z.boolean().optional(),
});

// GET /api/journal/
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { q, starred } = req.query;
    const where: any = { userId: req.user!.id };
    if (starred !== undefined) where.starred = starred === 'true';
    if (q) where.OR = [{ title: { contains: q as string } }, { content: { contains: q as string } }];

    const entries = await prisma.journalEntry.findMany({ where, orderBy: { createdAt: 'desc' } });
    return res.json(entries.map(e => ({
      id: e.id, title: e.title, content: e.content, mood: e.mood,
      tags: JSON.parse(e.tags || '[]'), starred: e.starred,
      created_at: e.createdAt, updated_at: e.updatedAt,
    })));
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/journal/
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createEntrySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ detail: parsed.error.issues[0].message });
    const { title, content, mood, tags } = parsed.data;

    const entry = await prisma.journalEntry.create({
      data: { userId: req.user!.id, title, content: content || '', mood: mood || 'neutral', tags: JSON.stringify(tags || []) },
    });
    return res.json({ id: entry.id, title: entry.title, message: 'Created' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// PUT /api/journal/:id
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const parsed = updateEntrySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ detail: parsed.error.issues[0].message });
    const { title, content, mood, tags, starred } = parsed.data;
    const entry = await prisma.journalEntry.findUnique({ where: { id } });
    if (!entry || entry.userId !== req.user!.id) return res.status(404).json({ detail: 'Not found' });

    const updated = await prisma.journalEntry.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(mood !== undefined && { mood }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(starred !== undefined && { starred }),
      },
    });
    return res.json({ id: updated.id, title: updated.title });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// DELETE /api/journal/:id
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const entry = await prisma.journalEntry.findUnique({ where: { id } });
    if (!entry || entry.userId !== req.user!.id) return res.status(404).json({ detail: 'Not found' });
    await prisma.journalEntry.delete({ where: { id } });
    return res.json({ message: 'Deleted' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/journal/stats/summary
router.get('/stats/summary', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const total = await prisma.journalEntry.count({ where: { userId: req.user!.id } });
    const starred = await prisma.journalEntry.count({ where: { userId: req.user!.id, starred: true } });
    return res.json({ total_entries: total, starred_entries: starred });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/journal/:id
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const entry = await prisma.journalEntry.findUnique({ where: { id } });
    if (!entry || entry.userId !== req.user!.id) return res.status(404).json({ detail: 'Not found' });
    return res.json({
      id: entry.id, title: entry.title, content: entry.content, mood: entry.mood,
      tags: JSON.parse(entry.tags || '[]'), starred: entry.starred,
      created_at: entry.createdAt, updated_at: entry.updatedAt,
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
