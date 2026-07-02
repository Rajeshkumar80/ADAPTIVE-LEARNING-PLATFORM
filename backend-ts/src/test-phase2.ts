import http from 'http';

const BASE = 'http://localhost:8001';
let passed = 0;
let failed = 0;

function req(method: string, path: string, headers: Record<string, string> = {}, body?: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const opts: any = { method, hostname: 'localhost', port: 8001, path: url.pathname, headers: { ...headers } };
    if (body && typeof body === 'object') {
      opts.headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    } else if (body && typeof body === 'string') {
      opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    const r = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode!, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode!, data }); }
      });
    });
    r.on('error', reject);
    if (body) r.write(body);
    r.end();
  });
}

function test(name: string, fn: () => any) {
  try {
    const result = fn();
    if (result !== false && result !== undefined) {
      console.log(`  PASS  ${name}`);
      passed++;
    } else {
      console.log(`  FAIL  ${name}`);
      failed++;
    }
  } catch (e: any) {
    console.log(`  FAIL  ${name}: ${e.message}`);
    failed++;
  }
}

async function run() {
  console.log('=== PHASE 2 DATA INGESTION TESTS ===\n');

  // Login
  let sRes = await req('POST', '/api/auth/login', {}, 'username=1gd23cs001@gcem.edu&password=student123');
  test('Student login', () => sRes.status === 200);
  const sH = { Authorization: `Bearer ${sRes.data.access_token}` };

  let aRes = await req('POST', '/api/auth/login', {}, 'username=admin@gcem.edu&password=admin123');
  test('Admin login', () => aRes.status === 200);
  const aH = { Authorization: `Bearer ${aRes.data.access_token}` };

  // Ingestion: POST quiz attempt
  console.log('\n--- Data Ingestion ---');
  let r = await req('POST', '/api/ingestion/quiz-attempt', sH, {
    topic_id: 1, subject_id: 1, score: 85, correct: 4, total: 5, duration_seconds: 120,
  });
  test('POST quiz attempt', () => r.status === 200 && r.data.event_id);

  // Validation: missing fields
  r = await req('POST', '/api/ingestion/quiz-attempt', sH, { topic_id: 1 });
  test('POST quiz attempt validation fails', () => r.status === 400);

  // POST time-spent
  r = await req('POST', '/api/ingestion/time-spent', sH, {
    topic_id: 1, subject_id: 1, duration_minutes: 30, activity: 'reading', focus_score: 75,
  });
  test('POST time-spent', () => r.status === 200 && r.data.event_id);

  // Validation: bad activity
  r = await req('POST', '/api/ingestion/time-spent', sH, {
    topic_id: 1, duration_minutes: 30, activity: 'invalid',
  });
  test('POST time-spent validation fails on bad activity', () => r.status === 400);

  // GET performance
  r = await req('GET', '/api/ingestion/performance/2', sH);
  test('GET performance history', () => r.status === 200 && r.data.quiz_attempts > 0);

  // GET events
  r = await req('GET', '/api/ingestion/events', sH);
  test('GET learning events', () => r.status === 200 && r.data.length > 0);

  // GET events filtered by type
  r = await req('GET', '/api/ingestion/events?type=quiz_attempt', sH);
  test('GET events filtered by type', () => r.status === 200 && r.data.every((e: any) => e.type === 'quiz_attempt'));

  // Student cannot access another student's performance
  let s2Res = await req('POST', '/api/auth/login', {}, 'username=1gd23cs002@gcem.edu&password=student123');
  const s2H = { Authorization: `Bearer ${s2Res.data.access_token}` };
  r = await req('GET', '/api/ingestion/performance/2', s2H);
  test('Student blocked from other performance', () => r.status === 403);

  // Admin can access student performance
  r = await req('GET', '/api/ingestion/performance/2', aH);
  test('Admin can access student performance', () => r.status === 200);

  console.log(`\n=== RESULTS: ${passed}/${passed + failed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
