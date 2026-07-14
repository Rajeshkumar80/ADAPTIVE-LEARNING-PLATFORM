import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getCached, setCache } from '../cache';
import { callGeminiRoadmap } from './ai';

const router = Router();

const roadmapSchema = z.object({
  hours_per_day: z.number().min(0.5).max(12),
  start_date: z.string().optional(),
  weeks: z.number().int().min(1).max(12).optional().default(4),
});

// Simple in-memory rate limit: 1 roadmap per user per day
const roadmapRateLimit = new Map<string, number>();

router.post('/generate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = roadmapSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ detail: parsed.error.issues[0].message });

    const userId = req.user!.id;
    const rateKey = `roadmap:${userId}`;
    const lastGenerated = roadmapRateLimit.get(rateKey);
    const oneDayMs = 24 * 60 * 60 * 1000;
    if (lastGenerated && Date.now() - lastGenerated < oneDayMs) {
      const waitHours = Math.ceil((oneDayMs - (Date.now() - lastGenerated)) / 3600000);
      return res.status(429).json({ detail: `Roadmap already generated today. Try again in ${waitHours}h.` });
    }

    const { hours_per_day, weeks } = parsed.data;
    const startDate = parsed.data.start_date || new Date().toISOString().split('T')[0];

    // Gather student data
    const [masteryRecords, subjects, tests] = await Promise.all([
      prisma.topicMastery.findMany({
        where: { userId },
        include: { topic: { include: { subject: true } } },
      }),
      prisma.subject.findMany({
        include: { topics: true },
      }),
      prisma.test.findMany({
        where: { startsAt: { gte: new Date() } },
        include: { subject: true },
        orderBy: { startsAt: 'asc' },
        take: 5,
      }),
    ]);

    // Build mastery map
    const masteryMap = new Map<number, number>();
    for (const m of masteryRecords) {
      masteryMap.set(m.topicId, m.mastery);
    }

    // Build syllabus with mastery
    const syllabus = subjects.map(s => ({
      subject: s.name,
      code: s.code,
      topics: s.topics.map(t => ({
        name: t.name,
        id: t.id,
        mastery: masteryMap.get(t.id) || 0,
      })),
    }));

    const upcomingTests = tests.map(t => ({
      title: t.title,
      subject: t.subject?.name || 'Unknown',
      date: t.startsAt?.toISOString().split('T')[0] || 'TBD',
    }));

    const prompt = `You are an adaptive study planner for a VTU CSE student. Generate a structured ${weeks}-week study roadmap.

STUDENT CONTEXT:
- Available study time: ${hours_per_day} hours/day
- Start date: ${startDate}
- ${upcomingTests.length > 0 ? 'Upcoming tests: ' + JSON.stringify(upcomingTests) : 'No upcoming tests'}

SYLLABUS WITH CURRENT MASTERY (0-100):
${JSON.stringify(syllabus, null, 2)}

RULES:
1. Prioritize topics with LOW mastery (below 40) first
2. Schedule spaced repetition reviews for topics with mastery 40-70
3. Only introduce new topics (mastery=0) after prerequisites are covered
4. Respect the ${hours_per_day}h/day budget — don't overload any day
5. Include buffer days for review and catch-up
6. If a test is upcoming, schedule test prep in the final week before it

OUTPUT FORMAT (strict JSON, no markdown):
{
  "roadmap": [
    {
      "week": 1,
      "days": [
        {
          "day": "Monday",
          "date": "${startDate}",
          "topics": [
            { "name": "Topic Name", "subject": "Subject", "duration_minutes": 45, "activity": "learn|review|practice|test_prep", "mastery_before": 20 }
          ],
          "total_minutes": 120,
          "notes": "Focus on weak areas"
        }
      ]
    }
  ],
  "summary": "Brief overview of the plan"
}`;

    const result = await callGeminiRoadmap(prompt);

    // Parse the JSON response
    let roadmap;
    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      roadmap = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      roadmap = null;
    }

    if (!roadmap || !roadmap.roadmap) {
      return res.status(500).json({ detail: 'Failed to generate structured roadmap. Please try again.' });
    }

    roadmapRateLimit.set(rateKey, Date.now());

    const response = {
      roadmap: roadmap.roadmap,
      summary: roadmap.summary || `${weeks}-week plan for ${hours_per_day}h/day`,
      generated_at: new Date().toISOString(),
      hours_per_day,
      weeks,
      source: result.source,
    };

    // Cache for 1 hour
    await setCache(`roadmap:${userId}`, response, 3600_000);
    return res.json(response);
  } catch (err: any) {
    console.error('[Roadmap] Generation failed:', err.message);
    return res.status(500).json({ detail: 'Could not generate roadmap right now. Please try again later.' });
  }
});

// GET /api/planner/roadmap — retrieve cached roadmap
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cached = await getCached(`roadmap:${req.user!.id}`);
    if (cached) return res.json(cached);
    return res.json({ roadmap: null, message: 'No roadmap generated yet. POST /generate to create one.' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
