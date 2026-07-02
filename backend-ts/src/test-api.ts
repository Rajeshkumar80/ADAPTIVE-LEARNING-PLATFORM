import http from 'http';

const BASE = 'http://localhost:8001';
let passed = 0;
let failed = 0;

function test(name: string, fn: () => any) {
  try {
    const result = fn();
    if (result !== false) {
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

async function run() {
  console.log('=== TS BACKEND API TESTS ===\n');

  // Auth
  let sRes = await req('POST', '/api/auth/login', {}, 'username=1gd23cs001@gcem.edu&password=student123');
  test('Student login', () => { if (sRes.status !== 200) throw new Error(`Status ${sRes.status}: ${JSON.stringify(sRes.data)}`); return true; });
  const sToken = sRes.data.access_token;
  const sH = { Authorization: `Bearer ${sToken}` };

  let aRes = await req('POST', '/api/auth/login', {}, 'username=admin@gcem.edu&password=admin123');
  test('Admin login', () => { if (aRes.status !== 200) throw new Error(`Status ${aRes.status}`); return true; });
  const aToken = aRes.data.access_token;
  const aH = { Authorization: `Bearer ${aToken}` };

  let meRes = await req('GET', '/api/auth/me', sH);
  test('Student /me', () => { if (meRes.status !== 200) throw new Error(`Status ${meRes.status}`); return true; });

  meRes = await req('GET', '/api/auth/me', aH);
  test('Admin /me', () => { if (meRes.status !== 200) throw new Error(`Status ${meRes.status}`); return true; });

  meRes = await req('GET', '/api/auth/me');
  test('Unauth /me returns 401', () => meRes.status === 401);

  // Student endpoints
  console.log('\n--- Student Endpoints ---');
  let r = await req('GET', '/api/student/dashboard', sH);
  test('Student dashboard', () => r.status === 200);
  r = await req('GET', '/api/student/leaderboard', sH);
  test('Student leaderboard', () => r.status === 200);
  r = await req('GET', '/api/student/profile', sH);
  test('Student profile', () => r.status === 200);
  r = await req('GET', '/api/student/subjects', sH);
  test('Student subjects', () => r.status === 200);
  r = await req('GET', '/api/student/achievements', sH);
  test('Student achievements', () => r.status === 200);
  r = await req('GET', '/api/student/certificates', sH);
  test('Student certificates', () => r.status === 200);

  // VTU
  r = await req('GET', '/api/vtu/subjects', sH);
  test('VTU subjects', () => r.status === 200);

  // Tests
  r = await req('GET', '/api/tests/', sH);
  test('Tests list', () => r.status === 200);

  // Learning
  r = await req('GET', '/api/learning/due-today', sH);
  test('Learning due-today', () => r.status === 200);
  r = await req('GET', '/api/learning/dashboard', sH);
  test('Learning dashboard', () => r.status === 200);

  // Notifications
  r = await req('GET', '/api/notifications/', sH);
  test('Notifications', () => r.status === 200);

  // Planner
  r = await req('GET', '/api/planner/today', sH);
  test('Planner today', () => r.status === 200);
  r = await req('GET', '/api/planner/goals', sH);
  test('Planner goals', () => r.status === 200);

  // AI
  r = await req('GET', '/api/ai/status', sH);
  test('AI status', () => r.status === 200);

  // Admin endpoints
  console.log('\n--- Admin Endpoints ---');
  r = await req('GET', '/api/admin/dashboard', aH);
  test('Admin dashboard', () => r.status === 200);
  r = await req('GET', '/api/admin/students', aH);
  test('Admin students', () => r.status === 200);
  r = await req('GET', '/api/admin/analytics', aH);
  test('Admin analytics', () => r.status === 200);
  r = await req('GET', '/api/admin/subjects', aH);
  test('Admin subjects', () => r.status === 200);
  r = await req('GET', '/api/admin/anti-cheat-flags', aH);
  test('Admin anti-cheat', () => r.status === 200);

  // Permissions
  console.log('\n--- Permission Checks ---');
  r = await req('GET', '/api/admin/dashboard', sH);
  test('Student blocked from admin', () => r.status === 403);
  r = await req('GET', '/api/student/dashboard', aH);
  test('Admin blocked from student', () => r.status === 403);

  // Health
  r = await req('GET', '/');
  test('Root endpoint', () => r.status === 200 && r.data.stack === 'Node.js/TypeScript');
  r = await req('GET', '/api/health');
  test('Health check', () => r.status === 200);

  console.log(`\n=== RESULTS: ${passed}/${passed + failed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
