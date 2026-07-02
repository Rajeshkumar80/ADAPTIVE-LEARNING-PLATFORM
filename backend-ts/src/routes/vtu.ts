import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// VTU subjects data (embedded from Python vtu_modules.py)
const VTU_DATA: Record<number, any> = {
  6: {
    scheme: '2022', branch: 'CSE', university: 'VTU',
    subjects: [
      { code: 'BCS601', name: 'Cloud Computing', credits: 4, type: 'theory' },
      { code: 'BCS602', name: 'Machine Learning', credits: 4, type: 'theory' },
      { code: 'BCS603', name: 'Software Testing', credits: 3, type: 'theory' },
      { code: 'BCS604', name: 'Cryptography and Network Security', credits: 3, type: 'theory' },
      { code: 'BCSL605', name: 'Machine Learning Lab', credits: 1, type: 'lab' },
      { code: 'BCSL606', name: 'Cloud Computing Lab', credits: 1, type: 'lab' },
    ],
    total_subjects: 6,
  },
  5: {
    scheme: '2022', branch: 'CSE', university: 'VTU',
    subjects: [
      { code: 'BCS501', name: 'Data Mining and Data Warehousing', credits: 4, type: 'theory' },
      { code: 'BCS502', name: 'Formal Languages and Automata Theory', credits: 4, type: 'theory' },
      { code: 'BCS503', name: 'Management and Entrepreneurship', credits: 3, type: 'theory' },
      { code: 'BCSL504', name: 'Data Mining Lab', credits: 1, type: 'lab' },
    ],
    total_subjects: 4,
  },
};

// GET /api/vtu/subjects
router.get('/subjects', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const semester = parseInt(req.query.semester as string) || 6;
    const data = VTU_DATA[semester] || { subjects: [], total_subjects: 0 };
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/vtu/subjects/:code
router.get('/subjects/:code', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const code = String(req.params.code).toUpperCase();
    for (const sem of Object.values(VTU_DATA)) {
      const subject = (sem as any).subjects.find((s: any) => s.code === code);
      if (subject) {
        return res.json({
          ...subject,
          semester: Object.keys(VTU_DATA).find(k => VTU_DATA[parseInt(k)] === sem),
          modules: {},
          course_outcomes: [],
          program_outcomes: [],
        });
      }
    }
    return res.status(404).json({ detail: 'Subject not found' });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

// GET /api/vtu/program-outcomes
router.get('/program-outcomes', authenticate, async (_req: AuthRequest, res: Response) => {
  return res.json({
    outcomes: [
      'Engineering Knowledge', 'Problem Analysis', 'Design/Development',
      'Conduct Investigations', 'Modern Tool Usage', 'Engineer and Society',
      'Environment and Sustainability', 'Ethics', 'Individual and Team Work',
      'Communication', 'Project Management', 'Lifelong Learning',
    ],
  });
});

export default router;
