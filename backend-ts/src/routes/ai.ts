import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/ai/status
router.get('/status', authenticate, async (_req: AuthRequest, res: Response) => {
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const openrouterKey = process.env.OPENROUTER_API_KEY || '';
  return res.json({
    available: !!(geminiKey || openrouterKey),
    gemini: !!geminiKey,
    openrouter: !!openrouterKey,
  });
});

// POST /api/ai/ask
router.post('/ask', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { query, context } = req.body;
    if (!query) return res.status(400).json({ detail: 'Query required' });

    // Placeholder - wire to Gemini/OpenRouter when API key provided
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.json({
        answer: `AI is not configured yet. Your question was: "${query}". Set GEMINI_API_KEY in .env to enable AI features.`,
        source: 'placeholder',
      });
    }

    // TODO: Implement actual Gemini/OpenRouter call
    return res.json({ answer: 'AI integration coming soon', source: 'placeholder' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/chat
router.post('/chat', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { messages } = req.body;
    return res.json({ response: 'Chat not yet implemented in TS backend', messages });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/explain
router.post('/explain', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic } = req.body;
    return res.json({ explanation: `Explanation for "${topic}" not yet available` });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// POST /api/ai/generate-quiz
router.post('/generate-quiz', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, count } = req.body;
    return res.json({ questions: [], message: 'Quiz generation not yet implemented' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
