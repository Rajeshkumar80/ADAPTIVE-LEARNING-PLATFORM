import { sm2Update, qualityFromScore, generateStudyPlan } from './services/sm2';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) { try { fn(); console.log(`  PASS  ${name}`); passed++; } catch (e: any) { console.log(`  FAIL  ${name}: ${e.message}`); failed++; } }
function assert(c: boolean, m: string) { if (!c) throw new Error(m); }

console.log('=== SM-2 UNIT TESTS ===\n');

// SM-2 core algorithm
test('First correct (q>=3): interval=1, reps=1', () => {
  const r = sm2Update(0, 2.5, 0, 4);
  assert(r.repetitions === 1, `reps=${r.repetitions}`);
  assert(r.interval === 1, `interval=${r.interval}`);
});

test('Second correct: interval=6, reps=2', () => {
  const r = sm2Update(1, 2.5, 1, 4);
  assert(r.repetitions === 2, `reps=${r.repetitions}`);
  assert(r.interval === 6, `interval=${r.interval}`);
});

test('Third correct: interval = prev * EF', () => {
  const r = sm2Update(2, 2.5, 6, 4);
  assert(r.repetitions === 3, `reps=${r.repetitions}`);
  assert(r.interval === 15, `interval=${r.interval}`); // 6*2.5=15
});

test('Incorrect (q<3): resets reps and interval', () => {
  const r = sm2Update(3, 2.5, 15, 1);
  assert(r.repetitions === 0, `reps=${r.repetitions}`);
  assert(r.interval === 1, `interval=${r.interval}`);
});

test('Perfect score increases EF', () => {
  const r = sm2Update(0, 2.5, 0, 5);
  assert(r.easeFactor > 2.5, `EF=${r.easeFactor}`);
});

test('Hard response decreases EF', () => {
  const r = sm2Update(0, 2.5, 0, 3);
  assert(r.easeFactor < 2.5, `EF=${r.easeFactor}`);
});

test('EF never below 1.3', () => {
  let ef = 2.5;
  for (let i = 0; i < 20; i++) {
    const r = sm2Update(0, ef, 0, 0);
    ef = r.easeFactor;
  }
  assert(ef >= 1.3, `EF=${ef}`);
});

// qualityFromScore
test('qualityFromScore correct thresholds', () => {
  assert(qualityFromScore(100) === 5, '100 -> 5');
  assert(qualityFromScore(95) === 5, '95 -> 5');
  assert(qualityFromScore(85) === 4, '85 -> 4');
  assert(qualityFromScore(65) === 3, '65 -> 3');
  assert(qualityFromScore(45) === 2, '45 -> 2');
  assert(qualityFromScore(25) === 1, '25 -> 1');
  assert(qualityFromScore(10) === 0, '10 -> 0');
});

// generateStudyPlan
test('Study plan prioritizes weak areas over new topics', () => {
  const plan = generateStudyPlan([
    { id: 1, name: 'New Topic', subject: 'DB', mastery: 0, is_unlocked: true, has_card: false, observations: 0 },
    { id: 2, name: 'Weak Topic', subject: 'DB', mastery: 20, is_unlocked: true, has_card: true, observations: 3 },
  ]);
  assert(plan.length === 2, `plan length=${plan.length}`);
  assert(plan[0].type === 'weak_area', `first should be weak_area, got ${plan[0].type}`);
});

test('Study plan skips locked topics', () => {
  const plan = generateStudyPlan([
    { id: 1, name: 'Locked', subject: 'DB', mastery: 0, is_unlocked: false, has_card: false, observations: 0 },
    { id: 2, name: 'Unlocked', subject: 'DB', mastery: 50, is_unlocked: true, has_card: true, observations: 3 },
  ]);
  assert(plan.length === 1, `plan length=${plan.length}`);
  assert(plan[0].topic_id === 2, 'only unlocked topic');
});

console.log(`\n=== RESULTS: ${passed}/${passed + failed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
