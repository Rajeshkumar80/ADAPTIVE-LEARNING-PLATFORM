const cache = new Map<string, { data: any; expiry: number }>();

const DEFAULT_TTL = 30_000; // 30 seconds

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache(key: string, data: any, ttlMs: number = DEFAULT_TTL): void {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

export function invalidateCache(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

export function getCacheStats() {
  let valid = 0, expired = 0;
  const now = Date.now();
  for (const [, entry] of cache) {
    if (now > entry.expiry) expired++; else valid++;
  }
  return { total: cache.size, valid, expired };
}

// Auto-cleanup every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expiry) cache.delete(key);
  }
}, 60_000);
