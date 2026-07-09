import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message?: string;
  skip?: (req: Request) => boolean;
}

export function createRateLimiter(options: RateLimiterOptions) {
  const { windowMs, max, message = 'Too many requests', skip } = options;
  const clients = new Map<string, RateLimitEntry>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of clients) {
      if (now > entry.resetTime) clients.delete(key);
    }
  }, 60000);

  return (req: Request, res: Response, next: NextFunction) => {
    if (skip && skip(req)) return next();

    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = clients.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      clients.set(key, entry);
    }

    entry.count++;

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

    if (entry.count > max) {
      return res.status(429).json({ detail: message });
    }

    next();
  };
}

export const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, please try again later',
});

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts, please try again later',
});

export const aiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 15,
  message: 'AI rate limit exceeded, please wait before sending more messages',
});

export const uploadLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Upload rate limit exceeded',
});
