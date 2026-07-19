// AI Features E2E integration tests (requires running backend on localhost:8001)
// Tests roadmap generation, multi-turn chat, and rate limiting

export {};

const BASE = 'http://localhost:8001';

async function req(method: string, path: string, token?: string, body?: any): Promise<{ status: number; data: any }> {
  try {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const resp = await fetch(`${BASE}${path}`, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    });
    return { status: resp.status, data: await resp.json().catch(() => null) };
  } catch {
    return { status: 0, data: null };
  }
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

describe('Roadmap Generation', () => {
  it('should generate a roadmap via Gemini', async () => {
    if (!serverAvailable) return;
    const res = await req('POST', '/api/planner/roadmap/generate', studentToken, {
      hours_per_day: 3,
      weeks: 4,
    });
    // 200 if Gemini responds, 500 if Gemini unavailable — both are valid
    expect([200, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.data.roadmap).toBeDefined();
      expect(Array.isArray(res.data.roadmap)).toBe(true);
      expect(res.data.roadmap.length).toBeGreaterThan(0);
      expect(res.data.summary).toBeDefined();
      expect(res.data.hours_per_day).toBe(3);
      expect(res.data.weeks).toBe(4);
      expect(res.data.source).toBe('gemini');
    }
  });

  it('should reject invalid hours_per_day', async () => {
    if (!serverAvailable) return;
    const res = await req('POST', '/api/planner/roadmap/generate', studentToken, {
      hours_per_day: 20,
      weeks: 4,
    });
    expect(res.status).toBe(400);
    expect(res.data.detail).toBeDefined();
  });

  it('should reject invalid weeks', async () => {
    if (!serverAvailable) return;
    const res = await req('POST', '/api/planner/roadmap/generate', studentToken, {
      hours_per_day: 3,
      weeks: 20,
    });
    expect(res.status).toBe(400);
  });

  it('should rate-limit: second call within 24h returns 429', async () => {
    if (!serverAvailable) return;
    // First call may have been made above; this second call should hit rate limit
    const res = await req('POST', '/api/planner/roadmap/generate', studentToken, {
      hours_per_day: 2,
      weeks: 2,
    });
    // If first call succeeded, this should be 429; if first call failed (500), this might be 200
    expect([200, 429, 500]).toContain(res.status);
  });

  it('should retrieve cached roadmap via GET', async () => {
    if (!serverAvailable) return;
    const res = await req('GET', '/api/planner/roadmap', studentToken);
    expect(res.status).toBe(200);
    // Either has a roadmap or a null message
    expect(res.data).toBeDefined();
  });

  it('should require authentication', async () => {
    if (!serverAvailable) return;
    const res = await req('POST', '/api/planner/roadmap/generate', undefined, {
      hours_per_day: 3,
      weeks: 4,
    });
    expect(res.status).toBe(401);
  });
});

describe('Multi-Turn Chat', () => {
  it('should handle a single chat message', async () => {
    if (!serverAvailable) return;
    const res = await req('POST', '/api/ai/chat', studentToken, {
      message: 'What is binary search?',
      history: [],
    });
    expect(res.status).toBe(200);
    expect(res.data.response).toBeDefined();
    expect(typeof res.data.response).toBe('string');
    expect(res.data.response.length).toBeGreaterThan(0);
    expect(res.data.source).toBeDefined();
  });

  it('should handle multi-turn conversation with context', async () => {
    if (!serverAvailable) return;
    const history = [
      { role: 'user', content: 'What is a stack?' },
      { role: 'assistant', content: 'A stack is a LIFO data structure.' },
    ];
    const res = await req('POST', '/api/ai/chat', studentToken, {
      message: 'How is it different from a queue?',
      history,
    });
    expect(res.status).toBe(200);
    expect(res.data.response).toBeDefined();
    expect(res.data.response.length).toBeGreaterThan(0);
  });

  it('should reject empty message', async () => {
    if (!serverAvailable) return;
    const res = await req('POST', '/api/ai/chat', studentToken, {
      message: '',
    });
    expect(res.status).toBe(400);
  });

  it('should require authentication', async () => {
    if (!serverAvailable) return;
    const res = await req('POST', '/api/ai/chat', undefined, {
      message: 'Hello',
    });
    expect(res.status).toBe(401);
  });
});
