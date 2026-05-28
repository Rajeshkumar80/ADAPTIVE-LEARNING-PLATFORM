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
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { id: 1, time: '09:00', subject: 'Cloud Computing', topic: 'Virtualization Concepts', duration: 60, activity: 'study', status: 'completed' },
    { id: 2, time: '10:00', subject: 'Machine Learning', topic: 'Linear Regression', duration: 45, activity: 'practice', status: 'completed' },
    { id: 3, time: '11:00', subject: 'Software Testing', topic: 'White-Box Testing', duration: 60, activity: 'study', status: 'active' },
    { id: 4, time: '14:00', subject: 'Cryptography', topic: 'RSA Algorithm', duration: 45, activity: 'study', status: 'pending' },
    { id: 5, time: '15:00', subject: 'Cloud Computing', topic: 'Cloud Security Quiz', duration: 30, activity: 'quiz', status: 'pending' },
    { id: 6, time: '16:00', subject: 'Machine Learning', topic: 'Decision Trees Practice', duration: 60, activity: 'practice', status: 'pending' },
  ]);

  const [goals] = useState<Goal[]>([
    { id: 1, title: 'Complete Cloud Computing Module 3', progress: 75, deadline: 'Jun 02' },
    { id: 2, title: 'ML Assignment Submission', progress: 40, deadline: 'Jun 05' },
    { id: 3, title: 'CNS Module 2 Revision', progress: 60, deadline: 'Jun 03' },
    { id: 4, title: 'Software Testing Lab', progress: 90, deadline: 'Jun 01' },
  ]);

  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');

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

  // Get current day info
  const today = new Date();
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const currentDay = today.getDay();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - currentDay + i);
    return d.getDate();
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Study Planner" subtitle="AI-powered daily schedule" />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Stat cards row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Sessions Done</p>
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{completedCount}/{schedule.length}</p>
              <p className="text-[11px] text-green-600">+{completedCount} today</p>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Study Time</p>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{Math.round(completedMinutes / 60)}h</p>
              <p className="text-[11px] text-muted-foreground">of {Math.round(totalMinutes / 60)}h planned</p>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Progress</p>
                <Target className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{progressPct}%</p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="stat-card">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">AI Generated</p>
                <Sparkles className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">Yes</p>
              <p className="text-[11px] text-muted-foreground">Optimized for you</p>
            </div>
          </div>

          {/* Main 3-column grid — OptiFlow style */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Column 1: Schedule Timeline (Process Tracking style) */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Today's Schedule</CardTitle>
                  <div className="tab-switcher">
                    {(['day', 'week', 'month'] as const).map(tab => (
                      <button
                        key={tab}
                        className={activeTab === tab ? 'active' : ''}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
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
              <CardContent className="space-y-3">
                {goals.map(goal => (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{goal.title}</p>
                      <span className="text-xs text-muted-foreground">{goal.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-foreground rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Column 3: Upcoming — Calendar + Events (OptiFlow style) */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Upcoming</CardTitle>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {/* Mini calendar row */}
                <div className="flex justify-between mb-4">
                  {dayNames.map((day, i) => (
                    <div key={i} className="text-center">
                      <p className="text-[10px] text-muted-foreground mb-1">{day}</p>
                      <div className={`calendar-day ${i === currentDay ? 'today' : ''}`}>
                        {weekDates[i]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Event cards */}
                <div className="space-y-2">
                  {[
                    { icon: Brain, title: 'ML Lab Submission', time: '10:00 AM', color: 'bg-orange-50' },
                    { icon: BookOpen, title: 'Cloud Computing Test', time: '02:00 PM', color: 'bg-blue-50' },
                    { icon: Target, title: 'CNS Assignment Due', time: '05:00 PM', color: 'bg-green-50' },
                    { icon: Sparkles, title: 'AI Tutor Session', time: '06:30 PM', color: 'bg-purple-50' },
                  ].map((event, i) => (
                    <div key={i} className="event-card">
                      <div className={`event-icon ${event.color}`}>
                        <event.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
