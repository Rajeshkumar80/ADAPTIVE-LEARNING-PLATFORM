import { getCached, setCache, invalidateCache, getCacheStats } from '../cache';

describe('Cache', () => {
  describe('setCache / getCached', () => {
    it('stores and retrieves a value', () => {
      setCache('test-key', { data: 'hello' }, 60000);
      const result = getCached('test-key');
      expect(result).toEqual({ data: 'hello' });
    });

    it('returns null for expired entries', () => {
      setCache('expired-key', { data: 'old' }, -1);
      const result = getCached('expired-key');
      expect(result).toBeNull();
    });

    it('returns null for non-existent keys', () => {
      const result = getCached('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('invalidateCache', () => {
    it('removes entries with matching prefix', () => {
      setCache('user:1', { a: 1 }, 60000);
      setCache('user:2', { b: 2 }, 60000);
      setCache('other:1', { c: 3 }, 60000);
      invalidateCache('user:');
      expect(getCached('user:1')).toBeNull();
      expect(getCached('user:2')).toBeNull();
      expect(getCached('other:1')).not.toBeNull();
    });
  });

  describe('getCacheStats', () => {
    it('returns correct stats', () => {
      setCache('stat-a', 1, 60000);
      setCache('stat-b', 2, 60000);
      const stats = getCacheStats();
      expect(stats.total).toBeGreaterThanOrEqual(2);
      expect(stats.valid).toBeGreaterThanOrEqual(2);
    });
  });
});
