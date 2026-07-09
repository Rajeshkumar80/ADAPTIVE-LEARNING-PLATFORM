import { Request, Response, NextFunction } from 'express';

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
}

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const start = Date.now();
  _res.on('finish', () => {
    const ms = Date.now() - start;
    if (ms > 200 || _res.statusCode >= 400) {
      console.log(`${req.method} ${req.originalUrl} ${_res.statusCode} ${ms}ms`);
    }
  });
  next();
}

export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    }
  }
  next();
}
