import http from 'http';
let passed = 0, failed = 0;

function req(method: string, path: string, headers: Record<string, string> = {}, body?: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, 'http://localhost:8001');
    const opts: any = { method, hostname: 'localhost', port: 8001, path: url.pathname, headers: { ...headers } };
    if (body && typeof body === 'object') { opts.headers['Content-Type'] = 'application/json'; body = JSON.stringify(body); }
    else if (body && typeof body === 'string') { opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'; }
    const r = http.request(opts, (res) => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve({ status: res.statusCode!, data: JSON.parse(d) }); } catch { resolve({ status: res.statusCode!, data: d }); } }); });
    r.on('error', reject); if (body) r.write(body); r.end();
  });
}

function test(name: string, fn: () => any) {
  try { const r = fn(); if (r !== false && r !== undefined) { console.log(`  PASS  ${name}`); passed++; } else { console.log(`  FAIL  ${name}`); failed++; } } catch (e: any) { console.log(`  FAIL  ${name}: ${e.message}`); failed++; }
}

async function run() {
  console.log('=== PHASE 3 BKT + LEARNING STATE TESTS ===\n');
  const lr = await req('POST', '/api/auth/login', {}, 'username=1gd23cs001@gcem.edu&password=student123');
  test('Student login', () => lr.status === 200);
  const sH = { Authorization: `Bearer ${lr.data.access_token}` };

  const ar = await req('POST', '/api/auth/login', {}, 'username=admin@gcem.edu&password=admin123');
  const aH = { Authorization: `Bearer ${ar.data.access_token}` };

  // GET /learning-state/:userId
  let r = await req('GET', '/api/learning-state/2', sH);
  test('GET learning state', () => r.status === 200 && r.data.total_topics > 0);
  console.log(`    -> ${r.data.total_topics} topics, summary: ${JSON.stringify(r.data.summary)}`);

  // Weak areas
  test('Weak areas present', () => Array.isArray(r.data.weak_areas));

  // Topic prerequisites
  const firstTopic = r.data.topics[0];
  test('Topic has prerequisites field', () => Array.isArray(firstTopic.prerequisites));
  test('Topic has is_unlocked field', () => typeof firstTopic.is_unlocked === 'boolean');

  // POST /learning-state/bkt-update
  r = await req('POST', '/api/learning-state/bkt-update', sH, { topic_id: 1, correct: 4, total: 5 });
  test('POST BKT update', () => r.status === 200 && r.data.p_know_after > r.data.p_know_before);
  console.log(`    -> pKnow: ${r.data.p_know_before} -> ${r.data.p_know_after} (${r.data.mastery_level})`);

  // Validation
  r = await req('POST', '/api/learning-state/bkt-update', sH, {});
  test('BKT update validation fails', () => r.status === 400);

  // GET dependency graph
  r = await req('GET', '/api/learning-state/dependency-graph/1', sH);
  test('GET dependency graph', () => r.status === 200 && r.data.graph.length > 0);
  console.log(`    -> ${r.data.graph.length} nodes in graph`);

  // Permissions
  r = await req('GET', '/api/learning-state/3', sH);
  test('Student blocked from other user state', () => r.status === 403);

  r = await req('GET', '/api/learning-state/2', aH);
  test('Admin can access student state', () => r.status === 200);

  console.log(`\n=== RESULTS: ${passed}/${passed + failed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}
run();
