'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ActivityChart,
  SubjectMasteryRadar,
  GradeDistribution,
  EngagementHeatmap,
} from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  GraduationCap,
  Brain,
  ChevronRight,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  BookOpen,
  Trophy,
  Target,
  Clock,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') router.push('/dashboard');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" />
      </div>
    );
  }

  // AI Education-focused stats
  const stats = [
    { label: 'Total Students', value: '1,247', sub: 'Across 7 branches', icon: Users },
    { label: 'AI Tutor Queries', value: '8,432', sub: 'This week', icon: Brain },
    { label: 'Mastery Avg', value: '76%', sub: '↑ 4% vs last month', icon: Target },
    { label: 'Tests Completed', value: '4,891', sub: 'This semester', icon: GraduationCap },
  ];

  // AI Insights
  const aiInsights = [
    {
      type: 'opportunity',
      title: 'Top topic students struggle with',
      description: 'Dynamic Programming (DSA) - 62% class avg. Consider supplementary content.',
      action: 'View topic',
    },
    {
      type: 'success',
      title: 'CSE Section A leading in mastery',
      description: '92% avg topic mastery, 18% above platform average.',
      action: 'View section',
    },
    {
      type: 'warning',
      title: '23 students at risk',
      description: 'Low attendance + declining test scores. Early intervention recommended.',
      action: 'View list',
    },
  ];

  const topPerformers = [
    { name: 'Aishwarya Iyer', usn: '1MS21CS024', branch: 'CSE', section: 'A', mastery: 96 },
    { name: 'Rohan Kumar', usn: '1MS21CS032', branch: 'CSE', section: 'B', mastery: 94 },
    { name: 'Priya Reddy', usn: '1MS21IS014', branch: 'ISE', section: 'A', mastery: 93 },
    { name: 'Karthik Pai', usn: '1MS21EC008', branch: 'ECE', section: 'A', mastery: 92 },
    { name: 'Sneha Nair', usn: '1MS21DS003', branch: 'DS', section: 'A', mastery: 91 },
  ];

  const liveTests = [
    { id: 'T001', title: 'DSA Mid-Term', branch: 'CSE', completed: 89, total: 156, flags: 3 },
    { id: 'T003', title: 'OS Assignment', branch: 'CSE', completed: 98, total: 134, flags: 0 },
    { id: 'T004', title: 'CN Lab Test', branch: 'ECE', completed: 45, total: 128, flags: 2 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          {/* Greeting */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Hi, {user.full_name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user.department} · {user.employee_id}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/admin/students">
                <Button variant="outline" size="sm">
                  <Users className="w-3.5 h-3.5" />
                  View Students
                </Button>
              </Link>
              <Link href="/admin/tests/create">
                <Button size="sm">
                  <Plus className="w-3.5 h-3.5" />
                  Create Test
                </Button>
              </Link>
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-semibold tracking-tight mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* AI Insights — the unique AI-education feature */}
          <Card className="bg-muted/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-background" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Insights</p>
                  <p className="text-xs text-muted-foreground">Generated from class-wide learning patterns</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                {aiInsights.map((insight, i) => (
                  <div key={i} className="bg-background border border-border rounded-md p-4">
                    <Badge
                      variant="outline"
                      className={`mb-2 text-[10px] ${
                        insight.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' :
                        insight.type === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                        'border-blue-200 bg-blue-50 text-blue-700'
                      }`}
                    >
                      {insight.type}
                    </Badge>
                    <p className="text-sm font-semibold mb-1">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                    <Link href="/admin/students" className="text-xs font-medium hover:underline inline-flex items-center gap-0.5">
                      {insight.action}
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity + Mastery Radar — AI education focused */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Learning Engagement</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Study hours and AI tutor usage</p>
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
                <CardTitle>Subject Mastery</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Top performer vs class avg</p>
              </CardHeader>
              <CardContent>
                <SubjectMasteryRadar />
              </CardContent>
            </Card>
          </div>

          {/* Engagement Heatmap + Grade Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Activity Heatmap
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">When students are most active</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <EngagementHeatmap />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Grade Distribution</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Last semester</p>
              </CardHeader>
              <CardContent>
                <GradeDistribution />
              </CardContent>
            </Card>
          </div>

          {/* Top Performers + Live Tests */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Top Performers
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Highest topic mastery this month</p>
                  </div>
                  <Link href="/admin/students">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View all
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {topPerformers.map((s, i) => (
                    <div key={s.usn} className="flex items-center px-6 py-3 hover:bg-muted/40 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-mono mr-3 shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{s.usn}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] mr-3">
                        {s.branch}-{s.section}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums">{s.mastery}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Live Tests</CardTitle>
                  <Link href="/admin/tests">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      All
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {liveTests.map((t) => (
                    <div key={t.id} className="px-6 py-3 hover:bg-muted/40 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-sm font-medium">{t.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{t.branch}</p>
                        </div>
                        {t.flags > 0 ? (
                          <Badge variant="outline" className="text-[10px] border-red-200 bg-red-50 text-red-700">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {t.flags}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-green-200 bg-green-50 text-green-700">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-foreground" style={{ width: `${(t.completed / t.total) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">{t.completed}/{t.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/admin/students" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <Users className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Browse Students</p>
              <p className="text-xs text-muted-foreground">By branch & section</p>
            </Link>
            <Link href="/admin/subjects" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <BookOpen className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Manage Subjects</p>
              <p className="text-xs text-muted-foreground">Course catalog</p>
            </Link>
            <Link href="/admin/anti-cheat" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <AlertTriangle className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Anti-Cheat Logs</p>
              <p className="text-xs text-muted-foreground">Security flags</p>
            </Link>
            <Link href="/admin/reports" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors">
              <TrendingUp className="w-4 h-4 mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Reports</p>
              <p className="text-xs text-muted-foreground">Export class data</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
