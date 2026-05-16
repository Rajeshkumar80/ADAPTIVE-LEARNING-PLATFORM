'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart, MiniSparkline } from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import { mockDB } from '@/lib/mockdb';
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Play,
  Award,
  Trophy,
  ChevronRight,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [counts, setCounts] = useState({ achievements: 0, certificates: 0 });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'student') {
      router.push('/admin');
      return;
    }
    if (user) {
      setCounts({
        achievements: mockDB.getAchievements(user.id).length,
        certificates: mockDB.getCertificates(user.id).length,
      });
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Study Streak', value: '7', unit: 'days', change: '+2', trend: 'up', sparkline: [3, 4, 5, 4, 6, 7, 7] },
    { label: 'Average Score', value: '85.5', unit: '%', change: '+5.2%', trend: 'up', sparkline: [70, 75, 78, 82, 84, 85, 85] },
    { label: 'Hours This Week', value: '38', unit: 'hrs', change: '+12%', trend: 'up', sparkline: [28, 30, 32, 35, 36, 37, 38] },
    { label: 'Topics Mastered', value: '23', unit: '/45', change: '+3', trend: 'up', sparkline: [18, 19, 20, 21, 22, 23, 23] },
  ];

  const upcomingTests = [
    { id: 1, title: 'OS Mid-Term', subject: 'Operating Systems', date: 'May 18', time: '10:00 AM', difficulty: 'Hard' },
    { id: 2, title: 'CN Quiz 4', subject: 'Computer Networks', date: 'May 20', time: '2:00 PM', difficulty: 'Medium' },
    { id: 3, title: 'SE Test', subject: 'Software Engineering', date: 'May 22', time: '11:00 AM', difficulty: 'Easy' },
  ];

  const todaySchedule = [
    { time: '09:00', subject: 'Data Structures', topic: 'Trees & Graphs', status: 'completed' },
    { time: '11:00', subject: 'DBMS', topic: 'Normalization', status: 'in-progress' },
    { time: '14:00', subject: 'OS', topic: 'Quick Quiz', status: 'pending' },
    { time: '15:30', subject: 'CN', topic: 'TCP/IP Lab', status: 'pending' },
  ];

  const subjects = [
    { name: 'Data Structures', code: 'CS501', progress: 75 },
    { name: 'DBMS', code: 'CS502', progress: 85 },
    { name: 'Operating Systems', code: 'CS503', progress: 45 },
    { name: 'Computer Networks', code: 'CS504', progress: 60 },
    { name: 'Software Engineering', code: 'CS505', progress: 70 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          {/* Greeting */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Hi, {user.full_name?.split(' ')[0]}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user.usn} · {user.branch} · Semester {user.semester}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/planner">
                <Button variant="outline" size="sm">
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule
                </Button>
              </Link>
              <Link href="/ai-tutor">
                <Button size="sm">
                  Ask AI Tutor
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl font-semibold tracking-tight">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-0.5 text-[11px] font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </div>
                    <div className="w-20 h-8">
                      <MiniSparkline data={stat.sparkline} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievements + Certificates + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Link href="/achievements" className="group">
              <Card className="hover:border-foreground transition-colors h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <p className="text-2xl font-semibold tracking-tight mb-1">{counts.achievements}</p>
                  <p className="text-xs text-muted-foreground">Achievements earned</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/certificates" className="group">
              <Card className="hover:border-foreground transition-colors h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <p className="text-2xl font-semibold tracking-tight mb-1">{counts.certificates}</p>
                  <p className="text-xs text-muted-foreground">Certificates earned</p>
                </CardContent>
              </Card>
            </Link>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-1">5.5h</p>
                <p className="text-xs text-muted-foreground">Today's plan · 1.5h done</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Study Activity</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Last 3 months</p>
                </div>
                <select className="h-7 text-xs border border-border rounded-md px-2 bg-background">
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>1 year</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>

          {/* Schedule + Tests */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Schedule</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Friday, May 15</p>
                  </div>
                  <Link href="/planner">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View all
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {todaySchedule.map((s, idx) => (
                    <div key={idx} className="flex items-center px-6 py-3 hover:bg-muted/50 transition-colors group">
                      <div className="w-14 text-xs text-muted-foreground font-mono">
                        {s.time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.topic}</p>
                        <p className="text-xs text-muted-foreground">{s.subject}</p>
                      </div>
                      {s.status === 'completed' ? (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          Done
                        </div>
                      ) : s.status === 'in-progress' ? (
                        <Link href="/planner">
                          <Button size="sm" variant="default" className="h-7">
                            <Play className="w-3 h-3" />
                            Continue
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/planner">
                          <Button size="sm" variant="outline" className="h-7 text-xs">Start</Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Tests</CardTitle>
                  <Link href="/tests">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      All
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {upcomingTests.map((test) => (
                    <div key={test.id} className="px-6 py-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm font-medium">{test.title}</p>
                        <Badge variant="outline" className="text-[10px] shrink-0 ml-2">
                          {test.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{test.subject}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{test.date} · {test.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subjects */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Subjects</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">6th semester progress</p>
                </div>
                <Link href="/courses">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    View all
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {subjects.map((subject) => (
                  <Link key={subject.code} href="/courses">
                    <div className="flex items-center px-6 py-3 hover:bg-muted/50 transition-colors group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">{subject.code}</span>
                          <span className="text-sm font-medium">{subject.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-xs h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-foreground transition-all"
                              style={{ width: `${subject.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{subject.progress}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors ml-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
