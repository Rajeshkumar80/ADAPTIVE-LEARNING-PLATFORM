'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart, SubjectMasteryRadar } from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import { mockDB } from '@/lib/mockdb';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Award,
  Trophy,
  ChevronRight,
  Brain,
  Target,
  Sparkles,
  Flame,
  BookOpen,
  GraduationCap,
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
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

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
    { name: 'Data Structures', code: 'CS501', progress: 75, mastery: 'Strong' },
    { name: 'DBMS', code: 'CS502', progress: 85, mastery: 'Strong' },
    { name: 'Operating Systems', code: 'CS503', progress: 45, mastery: 'Needs work' },
    { name: 'Computer Networks', code: 'CS504', progress: 60, mastery: 'Average' },
    { name: 'Software Engineering', code: 'CS505', progress: 70, mastery: 'Average' },
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
              <h1 className="text-2xl font-semibold tracking-tight">Hi, {user.full_name?.split(' ')[0]}</h1>
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
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask AI Tutor
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero stats — education focused */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <p className="text-xs text-muted-foreground">Study Streak</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-0.5">7 <span className="text-sm text-muted-foreground">days</span></p>
                <p className="text-[11px] text-green-600">+2 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" />
                  <p className="text-xs text-muted-foreground">Topic Mastery</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-0.5">23<span className="text-sm text-muted-foreground">/45</span></p>
                <p className="text-[11px] text-green-600">+3 mastered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4" />
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-0.5">85.5<span className="text-sm text-muted-foreground">%</span></p>
                <p className="text-[11px] text-green-600">↑ 5.2% this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4" />
                  <p className="text-xs text-muted-foreground">AI Queries</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-0.5">42</p>
                <p className="text-[11px] text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendation */}
          <Card className="bg-muted/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-background" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">Today's recommendation</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    You're behind on <strong>Operating Systems</strong> (45% mastery). Your retention is 23% higher in morning sessions — try a 30 min focused session at 9 AM tomorrow.
                  </p>
                  <div className="flex gap-2">
                    <Link href="/ai-tutor">
                      <Button size="sm">Start now</Button>
                    </Link>
                    <Link href="/learn-more">
                      <Button size="sm" variant="outline">Why?</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement chart + Mastery radar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Learning Activity</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Study hours and AI queries over time</p>
                  </div>
                  <select className="h-7 text-xs border border-border rounded-md px-2 bg-background">
                    <option>Last 12 weeks</option>
                    <option>Last 6 weeks</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <ActivityChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Mastery vs Class</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Your strengths by subject</p>
              </CardHeader>
              <CardContent>
                <SubjectMasteryRadar />
              </CardContent>
            </Card>
          </div>

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
                    <div key={idx} className="flex items-center px-6 py-3 hover:bg-muted/50 transition-colors">
                      <div className="w-14 text-xs text-muted-foreground font-mono">{s.time}</div>
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
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              subject.mastery === 'Strong' ? 'border-green-200 bg-green-50 text-green-700' :
                              subject.mastery === 'Average' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                              'border-red-200 bg-red-50 text-red-700'
                            }`}
                          >
                            {subject.mastery}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-xs h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground transition-all" style={{ width: `${subject.progress}%` }} />
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

          {/* Quick links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/journal" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <BookOpen className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Code Journal</p>
              <p className="text-xs text-muted-foreground">Save your code</p>
            </Link>
            <Link href="/mastery" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <Target className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Topic Mastery</p>
              <p className="text-xs text-muted-foreground">Track knowledge</p>
            </Link>
            <Link href="/achievements" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <Trophy className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">{counts.achievements} Achievements</p>
              <p className="text-xs text-muted-foreground">Earned badges</p>
            </Link>
            <Link href="/certificates" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <Award className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">{counts.certificates} Certificates</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
