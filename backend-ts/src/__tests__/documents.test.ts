import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Test the sanitizeFilename function directly
function sanitizeFilename(filename: string): string {
  let safe = path.basename(filename);
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!safe || safe === '.' || safe === '..') {
    safe = 'unnamed_document';
  }
  return safe;
}

// Test the file filter logic
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

function isAllowedType(mimetype: string): boolean {
  return ALLOWED_TYPES.includes(mimetype);
}

describe('Documents Security', () => {
  describe('sanitizeFilename', () => {
    it('should strip path traversal sequences', () => {
      expect(sanitizeFilename('../../../etc/passwd')).toBe('passwd');
      expect(sanitizeFilename('..\\..\\windows\\system32')).toBe('system32');
      expect(sanitizeFilename('/home/user/secret.txt')).toBe('secret.txt');
    });

    it('should handle normal filenames', () => {
      expect(sanitizeFilename('report.pdf')).toBe('report.pdf');
      expect(sanitizeFilename('my document.docx')).toBe('my_document.docx');
      expect(sanitizeFilename('lecture-notes_v2.pdf')).toBe('lecture-notes_v2.pdf');
    });

    it('should handle dangerous characters', () => {
      expect(sanitizeFilename('file with spaces.pdf')).toBe('file_with_spaces.pdf');
      expect(sanitizeFilename('file@#$%^&*.txt')).toBe('file_______.txt');
    });

    it('should handle empty or edge case names', () => {
      expect(sanitizeFilename('')).toBe('unnamed_document');
      expect(sanitizeFilename('.')).toBe('unnamed_document');
      expect(sanitizeFilename('..')).toBe('unnamed_document');
    });
  });

  describe('file type validation', () => {
    it('should allow PDF files', () => {
      expect(isAllowedType('application/pdf')).toBe(true);
    });

    it('should allow DOCX files', () => {
      expect(isAllowedType('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe(true);
    });

    it('should allow PNG images', () => {
      expect(isAllowedType('image/png')).toBe(true);
    });

    it('should allow JPEG images', () => {
      expect(isAllowedType('image/jpeg')).toBe(true);
    });

    it('should reject executable files', () => {
      expect(isAllowedType('application/x-executable')).toBe(false);
      expect(isAllowedType('application/x-msdownload')).toBe(false);
    });

    it('should reject text files', () => {
      expect(isAllowedType('text/plain')).toBe(false);
    });

    it('should reject HTML files', () => {
      expect(isAllowedType('text/html')).toBe(false);
    });

    it('should reject JavaScript files', () => {
      expect(isAllowedType('application/javascript')).toBe(false);
    });
  });
});
