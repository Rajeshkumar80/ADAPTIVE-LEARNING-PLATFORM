/**
 * BKT Algorithm Unit Tests
 */
import { bktUpdate, bktUpdateFromQuiz, masteryLevel, confidence, isTopicUnlocked, DEFAULT_BKT } from './services/bkt';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (e: any) {
    console.log(`  FAIL  ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition: boolean, msg: string) {
  if (!condition) throw new Error(msg);
}

function approx(a: number, b: number, epsilon = 0.001) {
  assert(Math.abs(a - b) < epsilon, `Expected ~${b}, got ${a}`);
}

console.log('=== BKT UNIT TESTS ===\n');

// Test 1: First correct response
test('First correct response increases mastery', () => {
  const result = bktUpdate(0.1, true);
  assert(result > 0.1, `Expected > 0.1, got ${result}`);
  assert(result < 0.5, `Expected < 0.5, got ${result}`);
});

// Test 2: First incorrect response
test('First incorrect response does not spike mastery', () => {
  const result = bktUpdate(0.1, false);
  // With standard BKT params (p_slip=0.1, p_guess=0.25, p_transit=0.1),
  // incorrect response can slightly increase mastery due to transition term
  assert(result < 0.2, `Expected < 0.2, got ${result}`);
  assert(result >= 0.01, `Expected >= 0.01, got ${result}`);
});

// Test 3: Multiple correct responses converge toward mastery
test('Multiple correct responses converge toward 0.99', () => {
  let p = 0.1;
  for (let i = 0; i < 20; i++) {
    p = bktUpdate(p, true);
  }
  assert(p > 0.9, `Expected > 0.9 after 20 correct, got ${p}`);
});

// Test 4: Correct after incorrect
test('Correct after incorrect still increases mastery', () => {
  const p1 = bktUpdate(0.1, false);
  const p2 = bktUpdate(p1, true);
  assert(p2 > p1, `Expected ${p2} > ${p1}`);
});

// Test 5: Mastery never goes below 0.01
test('Mastery floor is 0.01', () => {
  let p = 0.05;
  for (let i = 0; i < 10; i++) {
    p = bktUpdate(p, false);
  }
  assert(p >= 0.01, `Expected >= 0.01, got ${p}`);
});

// Test 6: Mastery never exceeds 0.99
test('Mastery ceiling is 0.99', () => {
  let p = 0.95;
  for (let i = 0; i < 10; i++) {
    p = bktUpdate(p, true);
  }
  assert(p <= 0.99, `Expected <= 0.99, got ${p}`);
});

// Test 7: Quiz update with all correct
test('Quiz all correct pushes mastery up', () => {
  const result = bktUpdateFromQuiz(0.1, 5, 5);
  assert(result > 0.5, `Expected > 0.5, got ${result}`);
});

// Test 8: Quiz update with all wrong
test('Quiz all wrong keeps mastery low', () => {
  const result = bktUpdateFromQuiz(0.1, 0, 5);
  assert(result < 0.15, `Expected < 0.15, got ${result}`);
});

// Test 9: masteryLevel
test('masteryLevel correct thresholds', () => {
  assert(masteryLevel(0.95) === 'mastered', '0.95 should be mastered');
  assert(masteryLevel(0.75) === 'proficient', '0.75 should be proficient');
  assert(masteryLevel(0.45) === 'learning', '0.45 should be learning');
  assert(masteryLevel(0.2) === 'weak', '0.2 should be weak');
});

// Test 10: confidence increases with observations
test('Confidence increases with observations', () => {
  const c1 = confidence(1);
  const c5 = confidence(5);
  const c20 = confidence(20);
  assert(c1 < c5, `Expected c1 < c5: ${c1} < ${c5}`);
  assert(c5 < c20, `Expected c5 < c20: ${c5} < ${c20}`);
  assert(c20 <= 0.95, `Expected <= 0.95, got ${c20}`);
});

// Test 11: isTopicUnlocked
test('isTopicUnlocked works correctly', () => {
  assert(isTopicUnlocked(0.8, 0.7) === true, '0.8 >= 0.7 should unlock');
  assert(isTopicUnlocked(0.5, 0.7) === false, '0.5 < 0.7 should not unlock');
  assert(isTopicUnlocked(0.7, 0.7) === true, '0.7 >= 0.7 should unlock (equal)');
});

// Test 12: Default BKT params
test('Default BKT params are standard', () => {
  assert(DEFAULT_BKT.pInit === 0.1, 'pInit should be 0.1');
  assert(DEFAULT_BKT.pTransit === 0.1, 'pTransit should be 0.1');
  assert(DEFAULT_BKT.pGuess === 0.25, 'pGuess should be 0.25');
  assert(DEFAULT_BKT.pSlip === 0.1, 'pSlip should be 0.1');
});

console.log(`\n=== RESULTS: ${passed}/${passed + failed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
