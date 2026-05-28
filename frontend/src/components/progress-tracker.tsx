'use client';

/**
 * Progress Tracker — OptiFlow "Process Tracking" style vertical timeline.
 * Shows study progress steps with dates, status dots, and descriptions.
 */

interface TrackerStep {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

interface ProgressTrackerProps {
  title?: string;
  steps: TrackerStep[];
}

export function ProgressTracker({ title = 'Progress Tracking', steps }: ProgressTrackerProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="timeline-item">
            <div className="flex flex-col items-center">
              <div className={`timeline-dot ${step.status}`} />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground font-mono shrink-0">{step.date}</span>
                <p className="text-sm font-medium truncate">{step.title}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Study Progress Tracker — adapted for student planner use.
 */
interface StudyStep {
  time: string;
  subject: string;
  topic: string;
  status: 'completed' | 'active' | 'pending';
  duration?: number;
}

interface StudyProgressTrackerProps {
  title?: string;
  steps: StudyStep[];
}

export function StudyProgressTracker({ title = 'Today\'s Progress', steps }: StudyProgressTrackerProps) {
  const completed = steps.filter(s => s.status === 'completed').length;
  const total = steps.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">{completed}/{total} done</span>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="timeline-item">
            <div className="flex flex-col items-center">
              <div className={`timeline-dot ${step.status}`} />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${step.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                  {step.subject}
                </p>
                <span className="text-[11px] text-muted-foreground font-mono">{step.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{step.topic}</p>
              {step.duration && (
                <span className="text-[10px] text-muted-foreground">{step.duration} min</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
