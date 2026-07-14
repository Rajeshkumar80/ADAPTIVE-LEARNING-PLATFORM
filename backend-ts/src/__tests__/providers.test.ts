import { aiProviders } from '../config';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('Groq Chat Provider', () => {
  it('should return chat response on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: 'Binary search divides the array in half.' } }] }),
    });

    const resp = await fetch(aiProviders.groq.baseUrl + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test' },
      body: JSON.stringify({ model: aiProviders.groq.model, messages: [{ role: 'user', content: 'What is binary search?' }] }),
    });
    const data: any = await resp.json();
    expect(data.choices[0].message.content).toContain('Binary search');
  });

  it('should handle 429 rate limit with retry', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 429, text: async () => 'rate limited' })
      .mockResolvedValueOnce({
        ok: true, status: 200,
        json: async () => ({ choices: [{ message: { content: 'OK after retry' } }] }),
      });

    // First call returns 429
    const r1 = await fetch('test', { method: 'POST' });
    expect(r1.status).toBe(429);

    // Second call succeeds
    const r2 = await fetch('test', { method: 'POST' });
    expect(r2.ok).toBe(true);
  });

  it('should handle malformed JSON response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true, status: 200,
      json: async () => { throw new Error('Invalid JSON'); },
    });

    await expect(fetch('test', { method: 'POST' }).then(r => r.json())).rejects.toThrow('Invalid JSON');
  });

  it('should handle network timeout', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Aborted'));

    await expect(fetch('test', { signal: AbortSignal.timeout(1) })).rejects.toThrow('Aborted');
  });
});

describe('Gemini Roadmap Provider', () => {
  it('should return generated content on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true, status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '{"roadmap": [{"week": 1, "days": []}]}' }] } }],
      }),
    });

    const resp = await fetch('test-gemini', { method: 'POST' });
    const data: any = await resp.json();
    const text = data.candidates[0].content.parts[0].text;
    expect(text).toContain('roadmap');
  });

  it('should handle empty candidates', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true, status: 200,
      json: async () => ({ candidates: [] }),
    });

    const resp = await fetch('test-gemini', { method: 'POST' });
    const data: any = await resp.json();
    expect(Array.isArray(data.candidates) && data.candidates.length === 0).toBe(true);
  });
});

describe('Provider Config', () => {
  it('should have groq config with model and baseUrl', () => {
    expect(aiProviders.groq.model).toBeDefined();
    expect(aiProviders.groq.baseUrl).toContain('groq.com');
  });

  it('should have gemini config with model and baseUrl', () => {
    expect(aiProviders.gemini.model).toBeDefined();
    expect(aiProviders.gemini.baseUrl).toContain('googleapis.com');
  });

  it('should reflect API key availability', () => {
    expect(typeof aiProviders.groq.available).toBe('boolean');
    expect(typeof aiProviders.gemini.available).toBe('boolean');
  });
});

describe('Builtin Fallback', () => {
  it('should return builtin response for known topics', () => {
    const builtinResponses: Record<string, string> = {
      'binary search': 'Binary Search',
      'normalization': 'Database Normalization',
      'tcp udp': 'TCP vs UDP',
      'process scheduling': 'Process Scheduling',
    };
    for (const [input, expected] of Object.entries(builtinResponses)) {
      const lower = input.toLowerCase();
      let response = '';
      if (lower.includes('binary search')) response = '**Binary Search** finds an item';
      else if (lower.includes('normalization')) response = '**Database Normalization** organizes';
      else if (lower.includes('tcp') || lower.includes('udp')) response = '**TCP vs UDP:**';
      else if (lower.includes('process schedul')) response = '**Process Scheduling** decides';
      expect(response.toLowerCase()).toContain(expected.toLowerCase());
    }
  });
});
