import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, requireStudent, AuthRequest } from '../middleware/auth';

const router = Router();

interface StoredDocument {
  id: string;
  filename: string;
  originalName: string;
  subject: string;
  description: string;
  uploadedBy: number;
  uploadedAt: string;
  size: number;
  mimeType: string;
}

const documents = new Map<string, StoredDocument>();
let docCounter = 0;

// Allowed MIME types
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Configure multer with memory storage (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Allowed: PDF, DOCX, PNG, JPG`));
    }
  },
});

// Sanitize filename: strip path traversal and dangerous characters
function sanitizeFilename(filename: string): string {
  // Remove any directory components (path traversal)
  let safe = path.basename(filename);
  // Remove null bytes and other dangerous chars
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  // Ensure it's not empty
  if (!safe || safe === '.' || safe === '..') {
    safe = 'unnamed_document';
  }
  return safe;
}

// GET /api/documents/ - List user's documents
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ detail: 'Not authenticated' });
  const userDocs = Array.from(documents.values())
    .filter(d => d.uploadedBy === userId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  return res.json(userDocs);
});

// POST /api/documents/upload - Upload a document (students only)
router.post('/upload', authenticate, requireStudent, (req: AuthRequest, res: Response) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ detail: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ detail: `Upload error: ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ detail: err.message });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ detail: 'Not authenticated' });

    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ detail: 'No file provided' });
    }

    const { subject, description } = req.body || {};
    const id = `doc_${++docCounter}`;
    const safeFilename = sanitizeFilename(file.originalname || 'unnamed');

    const doc: StoredDocument = {
      id,
      filename: safeFilename,
      originalName: file.originalname || 'unnamed',
      subject: subject || 'General',
      description: description || '',
      uploadedBy: userId,
      uploadedAt: new Date().toISOString(),
      size: file.size || 0,
      mimeType: file.mimetype || 'application/octet-stream',
    };

    documents.set(id, doc);
    return res.json(doc);
  });
});

// DELETE /api/documents/:docId - Delete user's own document
router.delete('/:docId', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ detail: 'Not authenticated' });
  const docId = String(req.params.docId);
  const doc = documents.get(docId);
  if (!doc || doc.uploadedBy !== userId) {
    return res.status(404).json({ detail: 'Document not found' });
  }
  documents.delete(docId);
  return res.json({ detail: 'Deleted' });
});

// POST /api/documents/ask - Ask about a document
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
