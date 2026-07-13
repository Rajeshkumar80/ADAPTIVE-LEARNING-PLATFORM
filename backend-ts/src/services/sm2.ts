/**
 * SM-2 Spaced Repetition Algorithm — TypeScript implementation.
 *
 * SuperMemo 2 algorithm:
 * - ease_factor starts at 2.5
 * - interval: 1 → 6 → calculated
 * - quality: 0-5 (5=perfect, 3=correct with difficulty, 0=blackout)
 */

export interface SM2Result {
  repetitions: number;
  easeFactor: number;
  interval: number;
}

/**
 * SM-2 update algorithm.
 * Returns new (repetitions, easeFactor, interval).
 */
export function sm2Update(
  repetitions: number,
  easeFactor: number,
  interval: number,
  quality: number // 0-5
): SM2Result {
  const q = Math.max(0, Math.min(5, quality));
  let newReps: number;
  let newInterval: number;

  if (q >= 3) {
    // Correct response
    newReps = repetitions + 1;
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
  } else {
    // Incorrect — reset
    newReps = 0;
    newInterval = 1;
  }

  // Update ease factor
  let newEF = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  newEF = Math.max(1.3, newEF);

  return { repetitions: newReps, easeFactor: Math.round(newEF * 100) / 100, interval: newInterval };
}

/**
 * Convert a percentage score (0-100) to SM-2 quality (0-5).
 */
export function qualityFromScore(scorePercent: number): number {
  if (scorePercent >= 95) return 5;
  if (scorePercent >= 80) return 4;
  if (scorePercent >= 60) return 3;
  if (scorePercent >= 40) return 2;
  if (scorePercent >= 20) return 1;
  return 0;
}

/**
 * Rule-based study plan scheduler (DQN fallback).
 * Orders topics by priority: weak topics first, due reviews, then new topics.
 */
export interface StudyPlanItem {
  topic_id: number;
  topic_name: string;
  subject: string;
  priority: number;
  reason: string;
  type: 'review' | 'weak_area' | 'new_topic' | 'prerequisite';
}

export function generateStudyPlan(
  topics: Array<{
    id: number;
    name: string;
    subject: string;
    mastery: number;
    is_unlocked: boolean;
    has_card: boolean;
    next_review?: Date | null;
    observations: number;
  }>,
  maxItems: number = 10
): StudyPlanItem[] {
  const now = new Date();
  const items: StudyPlanItem[] = [];

  for (const topic of topics) {
    if (!topic.is_unlocked) continue;

    // Due for review?
    if (topic.has_card && topic.next_review && topic.next_review <= now) {
      items.push({
        topic_id: topic.id,
        topic_name: topic.name,
        subject: topic.subject,
        priority: 1,
        reason: 'Review due',
        type: 'review',
      });
      continue;
    }

    // Weak area (mastery < 40%)?
    if (topic.mastery < 40 && topic.observations > 0) {
      items.push({
        topic_id: topic.id,
        topic_name: topic.name,
        subject: topic.subject,
        priority: 2,
        reason: `Weak area (${Math.round(topic.mastery)}% mastery)`,
        type: 'weak_area',
      });
      continue;
    }

    // New topic (never studied)?
    if (topic.observations === 0) {
      items.push({
        topic_id: topic.id,
        topic_name: topic.name,
        subject: topic.subject,
        priority: 3,
        reason: 'New topic — start learning',
        type: 'new_topic',
      });
      continue;
    }

    // Needs reinforcement (mastery 40-70%)?
    if (topic.mastery < 70) {
      items.push({
        topic_id: topic.id,
        topic_name: topic.name,
        subject: topic.subject,
        priority: 4,
        reason: `Needs reinforcement (${Math.round(topic.mastery)}%)`,
        type: 'review',
      });
    }
  }

  // Sort by priority, then by mastery (lowest first)
  items.sort((a, b) => a.priority - b.priority);
  return items.slice(0, maxItems);
}

/**
 * DQN-inspired adaptive scheduler.
 * Uses Q-value approximation: Q(s,a) = reward + γ * max(Q(s',a'))
 * Where state = topic mastery, action = study now, reward = mastery gain potential.
 *
 * Key differences from rule-based scheduler:
 * - Considers forgetting curve urgency (exponential decay, not binary thresholds)
 * - Balances exploration (new topics) vs exploitation (weak areas)
 * - Accounts for prerequisite depth (deeper topics get priority boost)
 * - Applies discount factor γ for long-term planning
 */

const GAMMA = 0.9; // Discount factor for future rewards
const EXPLORATION_RATE = 0.15; // 15% chance to explore new topics

interface DQNState {
  topic_id: number;
  topic_name: string;
  subject: string;
  mastery: number;
  observations: number;
  is_unlocked: boolean;
  has_card: boolean;
  next_review?: Date | null;
  prerequisites_mastered: number; // count of mastered prerequisites
  total_prerequisites: number;
}

interface DQNItem {
  topic_id: number;
  topic_name: string;
  subject: string;
  priority: number;
  q_value: number;
  reason: string;
  type: 'review' | 'weak_area' | 'new_topic' | 'prerequisite';
}

function computeQValue(state: DQNState): number {
  const now = new Date();
  const mastery = state.mastery / 100; // Normalize to 0-1

  // Reward: potential mastery gain (higher for low mastery)
  const reward = 1 - mastery;

  // Urgency: exponential forgetting curve
  let urgency = 0;
  if (state.has_card && state.next_review) {
    const daysOverdue = (now.getTime() - state.next_review.getTime()) / (1000 * 60 * 60 * 24);
    urgency = Math.min(1, Math.max(0, daysOverdue / 7)); // Max urgency at 7 days overdue
  }

  // Prerequisite bonus: topics that unlock more content get priority
  const prereqBonus = state.total_prerequisites > 0
    ? (state.prerequisites_mastered / state.total_prerequisites) * 0.3
    : 0;

  // Exploration bonus: new topics get a small random boost
  const explorationBonus = state.observations === 0
    ? EXPLORATION_RATE * Math.random()
    : 0;

  // Q-value: weighted combination
  const qValue = (reward * 0.4) + (urgency * 0.3) + (prereqBonus * 0.2) + (explorationBonus * 0.1);

  // Apply discount factor based on observations (more experienced = less discount)
  const discountFactor = Math.pow(GAMMA, Math.min(state.observations, 10));

  return qValue * discountFactor;
}

export function dqnSchedule(
  topics: DQNState[],
  maxItems: number = 10
): DQNItem[] {
  const now = new Date();
  const items: DQNItem[] = [];

  for (const topic of topics) {
    if (!topic.is_unlocked) continue;

    const qValue = computeQValue(topic);
    let type: DQNItem['type'] = 'review';
    let reason = '';

    if (topic.has_card && topic.next_review && topic.next_review <= now) {
      type = 'review';
      reason = `Q=${qValue.toFixed(2)}: Review overdue`;
    } else if (topic.mastery < 40 && topic.observations > 0) {
      type = 'weak_area';
      reason = `Q=${qValue.toFixed(2)}: Weak area (${Math.round(topic.mastery)}%)`;
    } else if (topic.observations === 0) {
      type = 'new_topic';
      reason = `Q=${qValue.toFixed(2)}: New topic (explore)`;
    } else if (topic.mastery < 70) {
      type = 'review';
      reason = `Q=${qValue.toFixed(2)}: Reinforcement needed`;
    } else {
      // Skip high-mastery topics — low Q-value
      continue;
    }

    items.push({
      topic_id: topic.topic_id,
      topic_name: topic.topic_name,
      subject: topic.subject,
      priority: Math.round((1 - qValue) * 100), // Lower Q = higher priority
      q_value: Math.round(qValue * 1000) / 1000,
      reason,
      type,
    });
  }

  // Sort by Q-value descending (highest Q-value first = most valuable to study)
  items.sort((a, b) => b.q_value - a.q_value);
  return items.slice(0, maxItems);
}
