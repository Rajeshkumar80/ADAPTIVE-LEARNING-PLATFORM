import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
let redis: Redis | null = null;

if (REDIS_URL) {
  redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
    enableReadyCheck: true,
  });

  redis.on('error', (err: Error) => {
    console.error('[Cache] Redis error, falling back to in-memory:', err.message);
    redis = null;
  });

  redis.connect().catch(() => {
    console.warn('[Cache] Redis unavailable, using in-memory cache');
    redis = null;
  });
}

// In-memory fallback
const memCache = new Map<string, { data: any; expiry: number }>();
const DEFAULT_TTL = 30_000;

export async function getCached<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      const raw = await redis.get(`adaptlearn:${key}`);
      if (raw) return JSON.parse(raw) as T;
      return null;
    } catch {
      return null;
    }
  }

  const entry = memCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    memCache.delete(key);
    return null;
  }
  return entry.data as T;
}

export async function setCache(key: string, data: any, ttlMs: number = DEFAULT_TTL): Promise<void> {
  if (redis) {
    try {
      await redis.setex(`adaptlearn:${key}`, Math.ceil(ttlMs / 1000), JSON.stringify(data));
      return;
    } catch {
      // fall through to in-memory
    }
  }
  memCache.set(key, { data, expiry: Date.now() + ttlMs });
}

export async function invalidateCache(prefix: string): Promise<void> {
  if (redis) {
    try {
      const keys = await redis.keys(`adaptlearn:${prefix}*`);
      if (keys.length > 0) await redis.del(...keys);
      return;
    } catch {
      // fall through to in-memory
    }
  }
  for (const key of memCache.keys()) {
    if (key.startsWith(prefix)) memCache.delete(key);
  }
}

export function getCacheStats() {
  if (redis) {
    return { type: 'redis', connected: redis.status === 'ready' };
  }
  let valid = 0, expired = 0;
  const now = Date.now();
  for (const [, entry] of memCache) {
    if (now > entry.expiry) expired++; else valid++;
  }
  return { type: 'in-memory', total: memCache.size, valid, expired };
}

// Cleanup for in-memory fallback
setInterval(() => {
  if (redis) return;
  const now = Date.now();
  for (const [key, entry] of memCache) {
    if (now > entry.expiry) memCache.delete(key);
  }
}, 60_000);
