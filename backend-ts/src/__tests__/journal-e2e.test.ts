// Journal E2E integration test (requires running backend on localhost:8001)
// Skipped automatically if server is not running

export {};

const BASE = 'http://localhost:8001';

async function req(method: string, path: string, token?: string, body?: any): Promise<{ status: number; data: any }> {
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const resp = await fetch(`${BASE}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  return { status: resp.status, data: await resp.json().catch(() => null) };
}

let studentToken = '';
let serverAvailable = false;

beforeAll(async () => {
  try {
    const login = await req('POST', '/api/auth/login', undefined, { username: '1GD23CS001', password: 'student123' });
    studentToken = login.data?.access_token || '';
    serverAvailable = !!studentToken;
  } catch {
    serverAvailable = false;
  }
});

describe('Journal E2E', () => {
  let entryId = 0;

  beforeAll(() => {
    if (!serverAvailable) return;
  });

  it('should create a journal entry', async () => {
    if (!serverAvailable) return;
    const res = await req('POST', '/api/journal', studentToken, {
      title: 'Test Entry', content: 'This is a test about databases and SQL', mood: 'productive', tags: ['study', 'databases'],
    });
    expect(res.status).toBe(200);
    expect(res.data.id).toBeTruthy();
    entryId = res.data.id;
  });

  it('should star the entry', async () => {
    if (!serverAvailable || !entryId) return;
    const res = await req('PUT', `/api/journal/${entryId}`, studentToken, { starred: true });
    expect(res.status).toBe(200);
  });

  it('should find entry by search keyword', async () => {
    if (!serverAvailable || !entryId) return;
    const res = await req('GET', '/api/journal?q=databases', studentToken);
    expect(res.status).toBe(200);
    const found = res.data.some((e: any) => e.id === entryId);
    expect(found).toBe(true);
  });

  it('should return starred entries when filtering', async () => {
    if (!serverAvailable || !entryId) return;
    const res = await req('GET', '/api/journal?starred=true', studentToken);
    expect(res.status).toBe(200);
    const found = res.data.some((e: any) => e.id === entryId);
    expect(found).toBe(true);
  });

  it('should unstar the entry', async () => {
    if (!serverAvailable || !entryId) return;
    const res = await req('PUT', `/api/journal/${entryId}`, studentToken, { starred: false });
    expect(res.status).toBe(200);
  });

  it('should NOT return entry in starred-only list after unstar', async () => {
    if (!serverAvailable || !entryId) return;
    const res = await req('GET', '/api/journal?starred=true', studentToken);
    expect(res.status).toBe(200);
    const found = res.data.some((e: any) => e.id === entryId);
    expect(found).toBe(false);
  });

  it('should delete the entry', async () => {
    if (!serverAvailable || !entryId) return;
    const res = await req('DELETE', `/api/journal/${entryId}`, studentToken);
    expect(res.status).toBe(200);
  });

  it('should return stats after operations', async () => {
    if (!serverAvailable) return;
    const res = await req('GET', '/api/journal/stats/summary', studentToken);
    expect(res.status).toBe(200);
    expect(typeof res.data.total_entries).toBe('number');
    expect(typeof res.data.starred_entries).toBe('number');
  });
});
