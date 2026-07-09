import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

interface StoredDocument {
  id: string;
  filename: string;
  subject: string;
  description: string;
  uploadedBy: number;
  uploadedAt: string;
  size: number;
  mimeType: string;
}

const documents = new Map<string, StoredDocument>();
let docCounter = 0;

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ detail: 'Not authenticated' });
  const userDocs = Array.from(documents.values())
    .filter(d => d.uploadedBy === userId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  return res.json(userDocs);
});

router.post('/upload', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ detail: 'Not authenticated' });
    const { subject, description } = req.body || {};
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ detail: 'No file provided' });
    }
    const id = `doc_${++docCounter}`;
    const doc: StoredDocument = {
      id,
      filename: file.originalname || 'unnamed',
      subject: subject || 'General',
      description: description || '',
      uploadedBy: userId,
      uploadedAt: new Date().toISOString(),
      size: file.size || 0,
      mimeType: file.mimetype || 'application/octet-stream',
    };
    documents.set(id, doc);
    return res.json(doc);
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

router.delete('/:docId', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ detail: 'Not authenticated' });
  const { docId } = req.params;
  const doc = documents.get(docId);
  if (!doc || doc.uploadedBy !== userId) {
    return res.status(404).json({ detail: 'Document not found' });
  }
  documents.delete(docId);
  return res.json({ detail: 'Deleted' });
});

router.post('/ask', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { doc_id, question } = req.body;
    if (!doc_id || !question) {
      return res.status(400).json({ detail: 'doc_id and question required' });
    }
    const doc = documents.get(doc_id);
    if (!doc) return res.status(404).json({ detail: 'Document not found' });
    return res.json({
      answer: `Regarding "${doc.filename}": I understand you're asking "${question}". The document management system is in development. Full RAG capabilities coming soon.`,
      source: 'document',
    });
  } catch (err: any) {
    return res.status(500).json({ detail: err.message });
  }
});

export default router;
