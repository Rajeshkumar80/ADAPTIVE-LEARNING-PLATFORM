import { Request, Response, NextFunction } from 'express';

type Validator = (data: any) => { valid: boolean; errors: string[] };

export function validate(validator: Validator) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { valid, errors } = validator(req.body);
    if (!valid) {
      return res.status(400).json({ detail: 'Validation failed', errors });
    }
    next();
  };
}

export const testCreationSchema: Validator = (data) => {
  const errors: string[] = [];
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 2) {
    errors.push('Title is required (min 2 characters)');
  }
  if (data.duration_minutes && (typeof data.duration_minutes !== 'number' || data.duration_minutes < 1)) {
    errors.push('Duration must be a positive number');
  }
  if (data.total_marks && (typeof data.total_marks !== 'number' || data.total_marks < 1)) {
    errors.push('Total marks must be a positive number');
  }
  return { valid: errors.length === 0, errors };
};

export const journalEntrySchema: Validator = (data) => {
  const errors: string[] = [];
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 1) {
    errors.push('Title is required');
  }
  if (data.mood && !['happy', 'productive', 'neutral', 'frustrated', 'tired', 'excited'].includes(data.mood)) {
    errors.push('Invalid mood value');
  }
  return { valid: errors.length === 0, errors };
};

export const notificationSchema: Validator = (data) => {
  const errors: string[] = [];
  if (!data.title || typeof data.title !== 'string') errors.push('Title is required');
  if (!data.message || typeof data.message !== 'string') errors.push('Message is required');
  if (data.type && !['info', 'success', 'warning', 'error'].includes(data.type)) {
    errors.push('Invalid notification type');
  }
  return { valid: errors.length === 0, errors };
};

export const bktUpdateSchema: Validator = (data) => {
  const errors: string[] = [];
  if (!data.topic_id || typeof data.topic_id !== 'number') errors.push('topic_id is required');
  if (typeof data.correct !== 'number' || data.correct < 0) errors.push('correct must be a non-negative number');
  if (typeof data.total !== 'number' || data.total < 1) errors.push('total must be >= 1');
  return { valid: errors.length === 0, errors };
};
