'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityChart } from '@/components/charts';
import { Plus, Sparkles, CheckCircle2, Play, X } from 'lucide-react';

interface ScheduleItem {
  id: number;
  time: string;
  subject: string;
  topic: string;
  duration: number;
  status: 'completed' | 'in-progress' | 'pending';
}

interface Goal {
  id: number;
  title: string;
  progress: number;
  deadline: string;
}

export default function PlannerPage() {
  const [aiVisible, setAiVisible] = useState(true);
  const [aiApplied, setAiApplied] = useState(false);

  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { id: 1, time: '09:00', subject: 'Data Structures', topic: 'Trees & Graphs', duration: 90, status: 'completed' },
    { id: 2, time: '11:00', subject: 'DBMS', topic: 'Normalization', duration: 60, status: 'in-progress' },
    { id: 3, time: '14:00', subject: 'Operating Systems', topic: 'Quick Quiz', duration: 30, status: 'pending' },
    { id: 4, time: '15:30', subject: 'Computer Networks', topic: 'TCP/IP Lab', duration: 90, status: 'pending' },
    { id: 5, time: '18:00', subject: 'Software Engineering', topic: 'Review', duration: 45, status: 'pending' },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, title: 'Complete DSA Module 5', progress: 75, deadline: 'May 18' },
    { id: 2, title: 'Practice 50 Coding Problems', progress: 60, deadline: 'May 20' },
    { id: 3, title: 'Read OS Chapters 6-8', progress: 40, deadline: 'May 19' },
    { id: 4, title: 'Submit SE Project', progress: 90, deadline: 'May 22' },
  ]);

  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const handleStartSession = (id: number) => {
    setSchedule(prev =>
      prev.map(s => s.id === id ? { ...s, status: 'in-progress' as const } : s)
    );
  };

  const handleCompleteSession = (id: number) => {
    setSchedule(prev =>
      prev.map(s => s.id === id ? { ...s, status: 'completed' as const } : s)
    );
  };

  const handleApplyAI = () => {
    // Reorder schedule to put OS earlier
    setAiApplied(true);
    setTimeout(() => setAiVisible(false), 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Study Planner</h1>
            <p className="text-sm text-muted-foreground mt-0.5">AI-powered scheduling that adapts to your patterns</p>
          </div>

          {/* AI Recommendation */}
          {aiVisible && (
            <Card className="bg-muted/30 relative">
              <button
                onClick={() => setAiVisible(false)}
                className="absolute top-3 right-3 p-1 hover:bg-muted rounded text-muted-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-background" />
                  </div>
                  <div className="flex-1 pr-6">
                    <p className="text-sm font-semibold mb-1">AI Recommendation</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      Focus on Operating Systems tomorrow morning. Your retention is 23% higher in morning sessions.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleApplyAI} disabled={aiApplied}>
                        {aiApplied ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Applied
                          </>
                        ) : (
                          'Apply'
                        )}
                      </Button>
                      <Link href="/learn-more">
                        <Button size="sm" variant="outline">Learn more</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Today</p><p className="text-2xl font-semibold tracking-tight">5.5h</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">This week</p><p className="text-2xl font-semibold tracking-tight">38h</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Goal completion</p><p className="text-2xl font-semibold tracking-tight">{Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)}%</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Focus score</p><p className="text-2xl font-semibold tracking-tight">92%</p></CardContent></Card>
          </div>

          {/* Schedule + Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Schedule</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Friday, May 15</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setShowAddSession(true)}>
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {schedule.map((s) => (
                    <div key={s.id} className="flex items-center px-6 py-3 hover:bg-muted/40 transition-colors">
                      <div className="w-14 text-xs text-muted-foreground font-mono">{s.time}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{s.topic}</p>
                        <p className="text-xs text-muted-foreground">{s.subject} · {s.duration}m</p>
                      </div>
                      {s.status === 'completed' ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          Done
                        </div>
                      ) : s.status === 'in-progress' ? (
                        <Button size="sm" className="h-7" onClick={() => handleCompleteSession(s.id)}>
                          <CheckCircle2 className="w-3 h-3" />
                          Mark done
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleStartSession(s.id)}>
                          <Play className="w-3 h-3" />
                          Start
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Weekly Goals</CardTitle>
                  <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setShowAddGoal(true)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{g.title}</p>
                      <span className="text-xs text-muted-foreground font-mono">{g.progress}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-foreground transition-all" style={{ width: `${g.progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">Due {g.deadline}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Weekly Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Your study time distribution</p>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>
        </main>
      </div>

      {showAddSession && (
        <SimpleFormModal
          title="Add session"
          fields={[
            { name: 'time', label: 'Time', placeholder: '20:00' },
            { name: 'subject', label: 'Subject', placeholder: 'Mathematics' },
            { name: 'topic', label: 'Topic', placeholder: 'Calculus' },
            { name: 'duration', label: 'Duration (min)', placeholder: '60', type: 'number' },
          ]}
          onSubmit={(data) => {
            setSchedule(prev => [...prev, {
              id: Date.now(),
              time: data.time || '20:00',
              subject: data.subject || 'New',
              topic: data.topic || 'Topic',
              duration: parseInt(data.duration || '60'),
              status: 'pending',
            }]);
            setShowAddSession(false);
          }}
          onCancel={() => setShowAddSession(false)}
        />
      )}

      {showAddGoal && (
        <SimpleFormModal
          title="Add goal"
          fields={[
            { name: 'title', label: 'Goal', placeholder: 'Read OS Chapter 9' },
            { name: 'deadline', label: 'Deadline', placeholder: 'May 25' },
          ]}
          onSubmit={(data) => {
            setGoals(prev => [...prev, {
              id: Date.now(),
              title: data.title || 'New goal',
              progress: 0,
              deadline: data.deadline || 'TBD',
            }]);
            setShowAddGoal(false);
          }}
          onCancel={() => setShowAddGoal(false)}
        />
      )}
    </div>
  );
}

interface FormField {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

function SimpleFormModal({
  title,
  fields,
  onSubmit,
  onCancel,
}: {
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<Record<string, string>>({});

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onCancel}>
      <div
        className="bg-background rounded-lg max-w-md w-full overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <button onClick={onCancel} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {fields.map(f => (
            <div key={f.name}>
              <label className="text-xs font-medium block mb-1.5">{f.label}</label>
              <input
                type={f.type || 'text'}
                placeholder={f.placeholder}
                value={data[f.name] || ''}
                onChange={(e) => setData({ ...data, [f.name]: e.target.value })}
                className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
              />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSubmit(data)}>Add</Button>
        </div>
      </div>
    </div>
  );
}
