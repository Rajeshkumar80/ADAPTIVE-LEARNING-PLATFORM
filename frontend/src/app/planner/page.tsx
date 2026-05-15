'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart } from '@/components/charts';
import { Plus, Sparkles, CheckCircle2, Play } from 'lucide-react';

export default function PlannerPage() {
  const schedule = [
    { id: 1, time: '09:00', subject: 'Data Structures', topic: 'Trees & Graphs', duration: 90, status: 'completed' },
    { id: 2, time: '11:00', subject: 'DBMS', topic: 'Normalization', duration: 60, status: 'in-progress' },
    { id: 3, time: '14:00', subject: 'Operating Systems', topic: 'Quick Quiz', duration: 30, status: 'pending' },
    { id: 4, time: '15:30', subject: 'Computer Networks', topic: 'TCP/IP Lab', duration: 90, status: 'pending' },
    { id: 5, time: '18:00', subject: 'Software Engineering', topic: 'Review', duration: 45, status: 'pending' },
  ];

  const goals = [
    { id: 1, title: 'Complete DSA Module 5', progress: 75, deadline: 'May 18' },
    { id: 2, title: 'Practice 50 Coding Problems', progress: 60, deadline: 'May 20' },
    { id: 3, title: 'Read OS Chapters 6-8', progress: 40, deadline: 'May 19' },
    { id: 4, title: 'Submit SE Project', progress: 90, deadline: 'May 22' },
  ];

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
          <Card className="bg-muted/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-background" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">AI Recommendation</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Focus on Operating Systems tomorrow morning. Your retention is 23% higher in morning sessions.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Apply</Button>
                    <Button size="sm" variant="outline">Learn more</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Today</p><p className="text-2xl font-semibold tracking-tight">5.5h</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">This week</p><p className="text-2xl font-semibold tracking-tight">38h</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Goal completion</p><p className="text-2xl font-semibold tracking-tight">85%</p></CardContent></Card>
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
                  <Button size="sm" variant="outline">
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
                        <Button size="sm" className="h-7">
                          <Play className="w-3 h-3" />
                          Continue
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7 text-xs">Start</Button>
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
                  <Button size="sm" variant="ghost" className="text-xs h-7">
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
                      <div className="h-full bg-foreground" style={{ width: `${g.progress}%` }} />
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
    </div>
  );
}
