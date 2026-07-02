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
