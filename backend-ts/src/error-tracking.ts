const SENTRY_DSN = process.env.SENTRY_DSN;

export function captureError(error: Error, context?: Record<string, any>) {
  console.error('[Error]', error.message, context);

  // Sentry would be initialized here in production
  // For now, structured error logging is sufficient
  if (SENTRY_DSN) {
    // In production: Sentry.captureException(error, { extra: context });
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](`[${level.toUpperCase()}]`, message);
}
