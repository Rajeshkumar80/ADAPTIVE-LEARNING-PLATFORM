/**
 * Bayesian Knowledge Tracing (BKT) — TypeScript implementation.
 *
 * Standard BKT model parameters:
 * - p(L_0): initial probability of knowing the skill
 * - p(T): probability of learning (transition from unlearned to learned)
 * - p(G): probability of guessing correctly when unlearned
 * - p(S): probability of slipping (knowing but answering wrong)
 *
 * Update rules use Bayes' theorem:
 * - P(L|correct) = P(correct|L)*P(L) / P(correct)
 * - P(L|incorrect) = P(incorrect|L)*P(L) / P(incorrect)
 * - After each observation, apply transition: P(L_new) = P(L_post) + (1 - P(L_post)) * P(T)
 */

export interface BKTParams {
  pInit: number;    // P(L_0) - initial mastery
  pTransit: number; // P(T) - learning rate
  pGuess: number;   // P(G) - guess probability
  pSlip: number;    // P(S) - slip probability
}

export const DEFAULT_BKT: BKTParams = {
  pInit: 0.1,
  pTransit: 0.1,
  pGuess: 0.25,
  pSlip: 0.1,
};

/**
 * Update mastery probability for a single observation.
 */
export function bktUpdate(pMastery: number, isCorrect: boolean, params: BKTParams = DEFAULT_BKT): number {
  let pLearnedGivenObs: number;

  if (isCorrect) {
    const pCorrectGivenLearned = 1 - params.pSlip;
    const pCorrectGivenUnlearned = params.pGuess;
    const pCorrect = pCorrectGivenLearned * pMastery + pCorrectGivenUnlearned * (1 - pMastery);
    pLearnedGivenObs = (pCorrectGivenLearned * pMastery) / pCorrect;
  } else {
    const pIncorrectGivenLearned = params.pSlip;
    const pIncorrectGivenUnlearned = 1 - params.pGuess;
    const pIncorrect = pIncorrectGivenLearned * pMastery + pIncorrectGivenUnlearned * (1 - pMastery);
    pLearnedGivenObs = (pIncorrectGivenLearned * pMastery) / pIncorrect;
  }

  // Apply transition
  const pNew = pLearnedGivenObs + (1 - pLearnedGivenObs) * params.pTransit;

  // Clamp to [0.01, 0.99]
  return Math.min(0.99, Math.max(0.01, pNew));
}

/**
 * Update mastery from a quiz result (multiple questions).
 */
export function bktUpdateFromQuiz(pMastery: number, correct: number, total: number, params: BKTParams = DEFAULT_BKT): number {
  let p = pMastery;
  for (let i = 0; i < total; i++) {
    p = bktUpdate(p, i < correct, params);
  }
  return p;
}

/**
 * Convert mastery probability to human-readable level.
 */
export function masteryLevel(pMastery: number): string {
  if (pMastery >= 0.9) return 'mastered';
  if (pMastery >= 0.7) return 'proficient';
  if (pMastery >= 0.4) return 'learning';
  return 'weak';
}

/**
 * Calculate confidence based on number of observations.
 */
export function confidence(numObservations: number): number {
  return Math.min(0.95, 1 - 1 / (1 + numObservations * 0.3));
}

/**
 * Check if a topic is unlocked based on prerequisite mastery.
 */
export function isTopicUnlocked(
  prerequisiteMastery: number,
  threshold: number
): boolean {
  return prerequisiteMastery >= threshold;
}
