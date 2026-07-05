'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, Users, GraduationCap, Activity, TrendingUp, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminReportsPage() {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [performance, setPerformance] = useState<any>(null);
  const [testReport, setTestReport] = useState<any>(null);
  const [engagement, setEngagement] = useState<any>(null);

  const loadReport = async (type: string) => {
    setActiveReport(type);
    setLoading(true);
    try {
      if (type === 'performance') {
        const data = await api.getReportPerformance();
        setPerformance(data);
      } else if (type === 'tests') {
        const data = await api.getReportTests();
        setTestReport(data);
      } else if (type === 'engagement') {
        const data = await api.getReportEngagement();
        setEngagement(data);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const reports = [
    { id: 'performance', title: 'Student Performance Report', description: 'Overall class performance metrics', icon: BarChart3 },
    { id: 'tests', title: 'Test Analytics', description: 'Test scores and pass rates', icon: GraduationCap },
    { id: 'engagement', title: 'Student Engagement', description: 'Activity and study hours', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Generate and download class reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reports.map((r) => {
              const Icon = r.icon;
              return (
                <Card key={r.id} className={`hover:border-foreground transition-colors cursor-pointer ${activeReport === r.id ? 'border-foreground' : ''}`} onClick={() => loadReport(r.id)}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold mb-0.5">{r.title}</h3>
                      <p className="text-xs text-muted-foreground">{r.description}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <FileText className="w-3.5 h-3.5" />
                      View
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Loading report...</span>
            </div>
          )}

          {!loading && performance && activeReport === 'performance' && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Student Performance Report</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{performance.total_students}</p>
                    <p className="text-xs text-muted-foreground">Total Students</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{performance.overall_avg_score}%</p>
                    <p className="text-xs text-muted-foreground">Avg Score</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{performance.pass_rate}%</p>
                    <p className="text-xs text-muted-foreground">Pass Rate</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{performance.total_attempts}</p>
                    <p className="text-xs text-muted-foreground">Total Attempts</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b"><th className="text-left p-2">USN</th><th className="text-left p-2">Name</th><th className="text-right p-2">CGPA</th><th className="text-right p-2">Tests</th><th className="text-right p-2">Avg Score</th><th className="text-right p-2">Mastery</th></tr></thead>
                    <tbody>
                      {performance.students.map((s: any) => (
                        <tr key={s.usn} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-mono text-xs">{s.usn}</td>
                          <td className="p-2">{s.name}</td>
                          <td className="p-2 text-right">{s.cgpa}</td>
                          <td className="p-2 text-right">{s.tests_taken}</td>
                          <td className="p-2 text-right">{s.avg_score}%</td>
                          <td className="p-2 text-right">{s.avg_mastery}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && testReport && activeReport === 'tests' && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Test Analytics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{testReport.total_tests}</p>
                    <p className="text-xs text-muted-foreground">Total Tests</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b"><th className="text-left p-2">Test</th><th className="text-left p-2">Subject</th><th className="text-right p-2">Marks</th><th className="text-right p-2">Attempts</th><th className="text-right p-2">Avg Score</th><th className="text-right p-2">Pass Rate</th></tr></thead>
                    <tbody>
                      {testReport.tests.map((t: any) => (
                        <tr key={t.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">{t.title}</td>
                          <td className="p-2 text-muted-foreground">{t.subject || 'N/A'}</td>
                          <td className="p-2 text-right">{t.total_marks}</td>
                          <td className="p-2 text-right">{t.attempts}</td>
                          <td className="p-2 text-right">{t.avg_score}%</td>
                          <td className="p-2 text-right">{t.pass_rate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && engagement && activeReport === 'engagement' && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Student Engagement</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{engagement.active_students}</p>
                    <p className="text-xs text-muted-foreground">Active Students</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{engagement.avg_hours_per_student}h</p>
                    <p className="text-xs text-muted-foreground">Avg Hours/Student</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{engagement.total_sessions}</p>
                    <p className="text-xs text-muted-foreground">Total Sessions</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-md">
                    <p className="text-2xl font-bold">{engagement.total_events}</p>
                    <p className="text-xs text-muted-foreground">Total Events</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b"><th className="text-left p-2">USN</th><th className="text-left p-2">Name</th><th className="text-right p-2">Hours</th><th className="text-right p-2">Sessions</th><th className="text-right p-2">Events</th><th className="text-right p-2">Achievements</th></tr></thead>
                    <tbody>
                      {engagement.students.filter((s: any) => s.total_hours > 0).map((s: any) => (
                        <tr key={s.usn} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-mono text-xs">{s.usn}</td>
                          <td className="p-2">{s.name}</td>
                          <td className="p-2 text-right">{s.total_hours}h</td>
                          <td className="p-2 text-right">{s.sessions}</td>
                          <td className="p-2 text-right">{s.events}</td>
                          <td className="p-2 text-right">{s.achievements}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
