import { getCached, setCache, invalidateCache, getCacheStats } from '../cache';

describe('Cache', () => {
  describe('setCache / getCached', () => {
    it('stores and retrieves a value', async () => {
      await setCache('test-key', { data: 'hello' }, 60000);
      const result = await getCached('test-key');
      expect(result).toEqual({ data: 'hello' });
    });

    it('returns null for expired entries', async () => {
      await setCache('expired-key', { data: 'old' }, -1);
      const result = await getCached('expired-key');
      expect(result).toBeNull();
    });

    it('returns null for non-existent keys', async () => {
      const result = await getCached('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('invalidateCache', () => {
    it('removes entries with matching prefix', async () => {
      await setCache('user:1', { a: 1 }, 60000);
      await setCache('user:2', { b: 2 }, 60000);
      await setCache('other:1', { c: 3 }, 60000);
      await invalidateCache('user:');
      expect(await getCached('user:1')).toBeNull();
      expect(await getCached('user:2')).toBeNull();
      expect(await getCached('other:1')).not.toBeNull();
    });
  });

  describe('getCacheStats', () => {
    it('returns correct stats', async () => {
      await setCache('stat-a', 1, 60000);
      await setCache('stat-b', 2, 60000);
      const stats = getCacheStats();
      if (stats.type === 'in-memory') {
        expect(stats.total).toBeGreaterThanOrEqual(2);
        expect(stats.valid).toBeGreaterThanOrEqual(2);
      } else {
        expect(stats.type).toBe('redis');
        expect(stats.connected).toBe(true);
      }
    });
  });
});
