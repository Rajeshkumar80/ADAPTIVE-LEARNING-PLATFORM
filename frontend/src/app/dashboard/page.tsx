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
import { ScrollReveal } from '@/components/scroll-reveal';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
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
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [upcomingTests, setUpcomingTests] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'student') {
      router.push('/admin');
      return;
    }
    
    const fetchData = async () => {
      if (!user) return;
      try {
        const [dash, subs, plan, tests] = await Promise.all([
          api.getStudentDashboard(),
          api.getStudentProgress(),
          api.getTodayPlan(),
          api.listTests(),
        ]);
        setDashboardData(dash);
        setSubjects(subs);
        setTodaySchedule(plan.items || plan.sessions || []);
        setUpcomingTests(tests.slice(0, 3)); // show first 3
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-page-enter">

          {/* Show skeleton while loading, real content when ready */}
          {!dashboardData ? (
            <DashboardSkeleton userName={user.full_name?.split(' ')[0] || 'Student'} />
          ) : (
          <>
          {/* Greeting */}
          <ScrollReveal>
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
          </ScrollReveal>

          {/* Hero stats — education focused */}
          <ScrollReveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <p className="text-xs text-muted-foreground">Study Streak</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-0.5">{dashboardData?.streak || 0} <span className="text-sm text-muted-foreground">days</span></p>
                <p className="text-[11px] text-green-600">Active streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" />
                  <p className="text-xs text-muted-foreground">Topic Mastery</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-0.5">{dashboardData?.topics_mastered || 0}<span className="text-sm text-muted-foreground">/{dashboardData?.total_topics || 0}</span></p>
                <p className="text-[11px] text-green-600">Topics covered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4" />
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-0.5">{dashboardData?.avg_score || 0}<span className="text-sm text-muted-foreground">%</span></p>
                <p className="text-[11px] text-green-600">Overall average</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4" />
                  <p className="text-xs text-muted-foreground">Study Hours</p>
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-0.5">{dashboardData?.hours_this_week || 0}</p>
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
                    {dashboardData?.streak > 0
                      ? `Great work maintaining a ${dashboardData.streak}-day streak! Keep it up with a focused study session today.`
                      : dashboardData?.avg_score > 80
                      ? `Your average score is ${dashboardData.avg_score}%. Challenge yourself with harder topics!`
                      : `Start building your study streak today. Consistent practice leads to better retention.`}
                  </p>
                  <div className="flex gap-2">
                    <Link href="/planner">
                      <Button size="sm">Start now</Button>
                    </Link>
                    <Link href="/ai-tutor">
                      <Button size="sm" variant="outline">Ask AI</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </ScrollReveal>

          {/* Engagement chart + Mastery radar */}
          <ScrollReveal delay={200}>
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
          </ScrollReveal>

          {/* Schedule + Tests */}
          <ScrollReveal delay={300}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Schedule</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
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
                          {test.difficulty || "medium"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">Subject ID: {test.subject_id}</p>
                      <p className="text-[11px] text-muted-foreground font-mono">{test.duration_minutes} min</p>
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
                              subject.mastery === 'high' ? 'border-green-200 bg-green-50 text-green-700' :
                              subject.mastery === 'medium' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                              'border-red-200 bg-red-50 text-red-700'
                            }`}
                          >
                            {subject.mastery.charAt(0).toUpperCase() + subject.mastery.slice(1)}
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
          </ScrollReveal>

          {/* Quick links */}
          <ScrollReveal delay={400}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/vtu-subjects" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <BookOpen className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">VTU Subjects</p>
              <p className="text-xs text-muted-foreground">Browse syllabus</p>
            </Link>
            <Link href="/mastery" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <Target className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Topic Mastery</p>
              <p className="text-xs text-muted-foreground">Track knowledge</p>
            </Link>
            <Link href="/achievements" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <Trophy className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">{dashboardData?.achievements_count || 0} Achievements</p>
              <p className="text-xs text-muted-foreground">Earned badges</p>
            </Link>
            <Link href="/certificates" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <Award className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">{dashboardData?.certificates_count || 0} Certificates</p>
              <p className="text-xs text-muted-foreground">Verified</p>
            </Link>
          </div>
          </ScrollReveal>
          </>
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardSkeleton({ userName }: { userName: string }) {
  return (
    <div className="space-y-6 animate-page-enter">
      {/* Greeting */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hi, {userName}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Loading your dashboard...</p>
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="border border-border rounded-lg p-5 space-y-3">
            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
            <div className="h-7 w-16 bg-muted rounded animate-pulse" />
            <div className="h-2 w-24 bg-muted/60 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border border-border rounded-lg p-6">
          <div className="h-4 w-32 bg-muted rounded animate-pulse mb-4" />
          <div className="h-48 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="border border-border rounded-lg p-6">
          <div className="h-4 w-28 bg-muted rounded animate-pulse mb-4" />
          <div className="h-48 bg-muted/30 rounded animate-pulse" />
        </div>
      </div>

      {/* Schedule skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border border-border rounded-lg p-6 space-y-3">
          <div className="h-4 w-36 bg-muted rounded animate-pulse" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="h-8 w-14 bg-muted rounded animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-40 bg-muted rounded animate-pulse" />
                <div className="h-2 w-24 bg-muted/60 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="border border-border rounded-lg p-6 space-y-3">
          <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          {[1, 2].map(i => (
            <div key={i} className="py-2 space-y-1.5">
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              <div className="h-2 w-20 bg-muted/60 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
