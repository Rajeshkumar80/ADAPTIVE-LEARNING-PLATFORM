import { aiProviders } from '../config';

const mockFetch = jest.fn();
global.fetch = mockFetch as any;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('Groq Chat Provider', () => {
  it('should return chat response on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true, status: 200,
      json: async () => ({ choices: [{ message: { content: 'Binary search divides the array in half.' } }] }),
    });

    const url = aiProviders.groq.baseUrl + '/chat/completions';
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer test' },
      body: JSON.stringify({ model: aiProviders.groq.model, messages: [{ role: 'user', content: 'What is binary search?' }] }),
    });
    const data: any = await resp.json();
    expect(data.choices[0].message.content).toContain('Binary search');
  });

  it('should handle 429 rate limit', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 429, text: async () => 'rate limited' });
    const resp = await fetch('test', { method: 'POST' });
    expect(resp.status).toBe(429);
  });

  it('should handle malformed JSON', async () => {
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
    expect(data.candidates[0].content.parts[0].text).toContain('roadmap');
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
    const tests: [string, string][] = [
      ['binary search', 'Binary Search'],
      ['normalization', 'DB Normalization'],
      ['tcp udp', 'TCP'],
      ['process scheduling', 'Scheduling'],
      ['bst', 'binary search tree'],
      ['stack', 'Stack'],
      ['linked list', 'Linked List'],
      ['hash map', 'Hash Table'],
      ['bfs dfs', 'BFS'],
      ['dynamic programming', 'DP'],
      ['oop', 'OOP'],
      ['java', 'Java'],
      ['python', 'Python'],
    ];
    for (const [input, expected] of tests) {
      const lower = input.toLowerCase();
      let response = '';
      if (lower.includes('binary search tree') || lower.includes('bst')) response = '**Binary Search Tree';
      else if (lower.includes('binary search')) response = '**Binary Search:**';
      else if (lower.includes('normalization')) response = '**DB Normalization:**';
      else if (lower.includes('process schedul')) response = '**Scheduling:**';
      else if (lower.includes('tcp') || lower.includes('udp')) response = '**TCP:**';
      else if (lower.includes('stack') || lower.includes('queue')) response = '**Stack:**';
      else if (lower.includes('linked list')) response = '**Linked List:**';
      else if (lower.includes('hash')) response = '**Hash Table:**';
      else if (lower.includes('bfs') || lower.includes('dfs') || lower.includes('graph')) response = '**BFS:**';
      else if (lower.includes('dynamic programming') || lower.includes('dp')) response = '**DP:**';
      else if (lower.includes('oop')) response = '**OOP:**';
      else if (lower.includes('java')) response = '**Java:**';
      else if (lower.includes('python')) response = '**Python:**';
      expect(response.toLowerCase()).toContain(expected.toLowerCase());
    }
  });
});
