'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import {
  CheckCircle2, Circle, Play, Clock, Target,
  Calendar, Sparkles, BookOpen, Brain,
} from 'lucide-react';

interface ScheduleItem {
  id: number;
  time: string;
  subject: string;
  topic: string;
  duration: number;
  activity: string;
  status: 'completed' | 'active' | 'pending';
}

interface Goal {
  id: number;
  title: string;
  progress: number;
  deadline: string;
}

export default function PlannerPage() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [upcomingTests, setUpcomingTests] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadPlan = async () => {
      try {
        const [planData, goalsData, testsData] = await Promise.all([
          api.getTodayPlan().catch(() => ({ items: [] })),
          api.getGoals().catch(() => []),
          api.getUpcomingTests().catch(() => []),
        ]);
        const items = (planData.items || planData.today_plan || []).map((item: any, i: number) => ({
          id: i + 1,
          time: item.time || `${9 + i}:00`,
          subject: item.subject || '',
          topic: item.topic_name || item.topic || '',
          duration: item.duration || 45,
          activity: item.activity || 'study',
          status: (item.status || 'pending') as 'completed' | 'active' | 'pending',
        }));
        setSchedule(items.length > 0 ? items : [
          { id: 1, time: '09:00', subject: 'Cloud Computing', topic: 'Review due topics', duration: 60, activity: 'study', status: 'active' },
        ]);
        setGoals((goalsData || []).map((g: any, i: number) => ({
          id: g.id || i + 1, title: g.title, progress: g.progress || 0, deadline: g.deadline || '',
        })));
        setUpcomingTests(testsData || []);
      } catch { /* use defaults */ }
      setLoadingData(false);
    };
    loadPlan();
  }, [user]);

  const [activeTab, setActiveTab] = useState<'day'>('day');

  const completedCount = schedule.filter(s => s.status === 'completed').length;
  const totalMinutes = schedule.reduce((sum, s) => sum + s.duration, 0);
  const completedMinutes = schedule.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.duration, 0);
  const progressPct = Math.round((completedCount / schedule.length) * 100);

  const handleStart = (id: number) => {
    setSchedule(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'active' as const } : s
    ));
  };

  const handleComplete = (id: number) => {
    setSchedule(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'completed' as const } : s
    ));
  };

  // Get current week dates (properly calculated)
  const today = new Date();
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const todayDayOfWeek = today.getDay(); // 0=Sun, 1=Mon...
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - todayDayOfWeek); // Start from Sunday

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return { date: d.getDate(), isToday: d.toDateString() === today.toDateString(), dayIndex: i };
  });

  const [selectedDay, setSelectedDay] = useState(todayDayOfWeek);

  // Events per day of week
  const eventsByDay: Record<number, { icon: any; title: string; time: string; bg: string; iconBg: string; iconColor: string }[]> = {
    [todayDayOfWeek]: [
      { icon: Brain, title: 'ML Lab Submission', time: '10:00 AM', bg: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
      { icon: BookOpen, title: 'Cloud Computing Test', time: '02:00 PM', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      { icon: Target, title: 'CNS Assignment Due', time: '05:00 PM', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
      { icon: Sparkles, title: 'AI Tutor Session', time: '06:30 PM', bg: 'bg-violet-50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
    ],
    [(todayDayOfWeek + 1) % 7]: [
      { icon: BookOpen, title: 'Software Testing Lab', time: '09:00 AM', bg: 'bg-teal-50', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
      { icon: Target, title: 'ML Assignment Due', time: '11:59 PM', bg: 'bg-red-50', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    ],
    [(todayDayOfWeek + 2) % 7]: [
      { icon: Brain, title: 'Cloud Computing Quiz', time: '10:00 AM', bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      { icon: Sparkles, title: 'AI Study Session', time: '04:00 PM', bg: 'bg-violet-50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
      { icon: BookOpen, title: 'CNS Revision', time: '07:00 PM', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    ],
    [(todayDayOfWeek + 3) % 7]: [
      { icon: Target, title: 'Project Presentation', time: '11:00 AM', bg: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
    ],
  };

  const selectedEvents = eventsByDay[selectedDay] || [];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Study Planner" subtitle="AI-powered daily schedule" />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Stat cards row */}
          <div className="flex items-center justify-between">
            <div />
            <Button onClick={async () => { setLoadingData(true); try { const plan = await api.getTodayPlan(); const items = (plan.items || []).map((item: any, i: number) => ({ id: i + 1, time: item.time || `${9 + i}:00`, subject: item.subject || '', topic: item.topic || '', duration: item.duration || 45, activity: item.activity || 'study', status: 'pending' as 'completed' | 'active' | 'pending' })); setSchedule(items); } catch { /* keep current */ } setLoadingData(false); }} size="sm">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Generate AI Plan
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="stat-card" style={{ borderLeft: '3px solid #5c7f63' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Sessions Done</p>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold">{completedCount}/{schedule.length}</p>
              <p className="text-[11px] text-emerald-600 font-medium">+{completedCount} today</p>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid #b8956b' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Study Time</p>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold">{Math.round(completedMinutes / 60)}h</p>
              <p className="text-[11px] text-muted-foreground">of {Math.round(totalMinutes / 60)}h planned</p>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid #6b8f71' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Progress</p>
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Target className="w-4 h-4 text-teal-600" />
                </div>
              </div>
              <p className="text-2xl font-bold">{progressPct}%</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="stat-card" style={{ borderLeft: '3px solid #7c6b9a' }}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">AI Generated</p>
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                </div>
              </div>
              <p className="text-2xl font-bold">Yes</p>
              <p className="text-[11px] text-violet-600 font-medium">Optimized for you</p>
            </div>
          </div>

          {/* Main 3-column grid — OptiFlow style */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Column 1: Schedule Timeline (Process Tracking style) */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Today&apos;s Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {schedule.map((item) => (
                    <div key={item.id} className="timeline-item">
                      <div className="flex flex-col items-center">
                        <div className={`timeline-dot ${item.status}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${item.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {item.subject}
                          </p>
                          <span className="text-[11px] text-muted-foreground font-mono">{item.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.topic}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground">{item.duration} min · {item.activity}</span>
                          {item.status === 'pending' && (
                            <button
                              onClick={() => handleStart(item.id)}
                              className="text-[10px] font-medium text-foreground hover:underline"
                            >
                              Start →
                            </button>
                          )}
                          {item.status === 'active' && (
                            <button
                              onClick={() => handleComplete(item.id)}
                              className="text-[10px] font-medium text-green-600 hover:underline"
                            >
                              Complete ✓
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Column 2: Goals Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal, i) => {
                  const colors = ['bg-emerald-500', 'bg-amber-500', 'bg-teal-500', 'bg-violet-500'];
                  const textColors = ['text-emerald-600', 'text-amber-600', 'text-teal-600', 'text-violet-600'];
                  return (
                    <div key={goal.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{goal.title}</p>
                        <span className="text-xs text-muted-foreground">{goal.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors[i % colors.length]} rounded-full transition-all`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${textColors[i % textColors.length]}`}>{goal.progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Column 3: Upcoming — Calendar + Events */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Upcoming</CardTitle>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {/* Mini calendar row */}
                <div className="flex justify-between mb-4 px-1">
                  {dayNames.map((day, i) => (
                    <button key={i} className="text-center" onClick={() => setSelectedDay(i)}>
                      <p className="text-[10px] text-muted-foreground mb-1.5">{day}</p>
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        i === selectedDay
                          ? 'bg-foreground text-background'
                          : weekDates[i].isToday
                            ? 'ring-1 ring-foreground text-foreground'
                            : eventsByDay[i]
                              ? 'text-foreground hover:bg-muted'
                              : 'text-muted-foreground hover:bg-muted'
                      }`}>
                        {weekDates[i].date}
                      </div>
                      {eventsByDay[i] && i !== selectedDay && (
                        <div className="w-1 h-1 rounded-full bg-emerald-500 mx-auto mt-1" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Event cards for selected day — show upcoming tests or placeholder */}
                <div className="space-y-2 mt-4">
                  {upcomingTests.length > 0 ? (
                    upcomingTests.slice(0, 4).map((test: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 transition-all hover:scale-[1.01]">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{test.title}</p>
                          <p className="text-xs text-muted-foreground">{test.subject || ''} · {test.duration_minutes || 60} min</p>
                        </div>
                      </div>
                    ))
                  ) : selectedEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No events for this day</p>
                  ) : (
                    selectedEvents.map((event, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${event.bg} transition-all hover:scale-[1.01]`}>
                        <div className={`w-9 h-9 rounded-lg ${event.iconBg} flex items-center justify-center`}>
                          <event.icon className={`w-4 h-4 ${event.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
