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

const VTU_MODULES: Record<string, Record<string, any>> = {
  BCS601: {
    '1': { title: 'Introduction to Cloud Computing', topics: ['Cloud definition and characteristics', 'Service models: IaaS, PaaS, SaaS', 'Deployment models: Public, Private, Hybrid'] },
    '2': { title: 'Virtualization', topics: ['Virtualization concepts and types', 'Hypervisors: Type 1 and Type 2', 'VMware and KVM overview'] },
    '3': { title: 'Cloud Architecture', topics: ['Reference architecture', 'Cloud storage and databases', 'Load balancing and auto-scaling'] },
    '4': { title: 'Cloud Security and AWS', topics: ['Cloud security challenges', 'IAM and access control', 'AWS core services overview'] },
    '5': { title: 'Advanced Cloud Topics', topics: ['Containers and Docker', 'Kubernetes fundamentals', 'Serverless computing'] },
  },
  BCS602: {
    '1': { title: 'Introduction to ML', topics: ['ML overview and types', 'Linear regression', 'Model evaluation metrics'] },
    '2': { title: 'Classification Algorithms', topics: ['Decision trees and random forests', 'Naive Bayes classifier', 'K-Nearest Neighbors'] },
    '3': { title: 'Advanced ML', topics: ['Support Vector Machines', 'Neural networks basics', 'Backpropagation'] },
    '4': { title: 'Unsupervised Learning', topics: ['K-Means clustering', 'Hierarchical clustering', 'Dimensionality reduction (PCA)'] },
    '5': { title: 'ML Practice', topics: ['Feature engineering', 'Cross-validation', 'Hyperparameter tuning'] },
  },
  BCS603: {
    '1': { title: 'Testing Fundamentals', topics: ['Software testing principles', 'Testing lifecycle', 'Test case design'] },
    '2': { title: 'Functional Testing', topics: ['Unit testing', 'Integration testing', 'System testing'] },
    '3': { title: 'Advanced Testing', topics: ['Performance testing', 'Security testing', 'User acceptance testing'] },
    '4': { title: 'Test Automation', topics: ['Selenium basics', 'Test frameworks', 'CI/CD integration'] },
    '5': { title: 'Quality Assurance', topics: ['Test management', 'Defect lifecycle', 'Quality metrics'] },
  },
  BCS604: {
    '1': { title: 'Symmetric Cryptography', topics: ['Classical ciphers', 'DES and AES', 'Block and stream ciphers'] },
    '2': { title: 'Asymmetric Cryptography', topics: ['RSA algorithm', 'Key exchange protocols', 'Elliptic curve cryptography'] },
    '3': { title: 'Hash Functions and Signatures', topics: ['SHA family', 'Digital signatures', 'Message authentication codes'] },
    '4': { title: 'Network Security', topics: ['TLS/SSL protocol', 'IPSec and VPNs', 'Firewall fundamentals'] },
    '5': { title: 'Applied Cryptography', topics: ['PKI and certificates', 'Blockchain basics', 'Post-quantum cryptography'] },
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
    for (const [semKey, sem] of Object.entries(VTU_DATA)) {
      const subject = (sem as any).subjects.find((s: any) => s.code === code);
      if (subject) {
        const modules = VTU_MODULES[code] || {};
        return res.json({
          ...subject,
          semester: parseInt(semKey),
          modules,
          course_outcomes: [
            'Understand core concepts of the subject',
            'Apply techniques to solve real-world problems',
            'Analyze and evaluate different approaches',
          ],
          program_outcomes: [
            'Engineering Knowledge', 'Problem Analysis', 'Design/Development',
          ],
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
