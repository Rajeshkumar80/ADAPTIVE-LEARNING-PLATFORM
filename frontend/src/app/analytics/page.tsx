'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityChart, PerformanceChart, TestTrendsChart, SubjectDistribution } from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ChevronRight, BookOpen } from 'lucide-react';

interface ModuleData {
  title: string;
  topics: string[];
}

interface SubjectWithModules {
  code: string;
  name: string;
  credits: number;
  modules: Record<string, ModuleData>;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<SubjectWithModules[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, Record<string, boolean[]>>>({});
  const [stats, setStats] = useState({ hours: 0, bestScore: 0, goalsCompleted: 0, totalGoals: 0, streak: 0, focus: 0 });
  const [insights, setInsights] = useState<{ label: string; text: string; variant: string }[]>([]);
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [semester, dashData, progressData, masteryData, activityData] = await Promise.allSettled([
        Promise.resolve(user?.semester || 6),
        api.getStudentDashboard(),
        api.getStudentProgress(),
        api.getMastery(),
        api.getActivityHistory(),
      ]);

      const d = dashData.status === 'fulfilled' ? dashData.value : null;
      const p = progressData.status === 'fulfilled' ? progressData.value : [];
      const m = masteryData.status === 'fulfilled' ? masteryData.value : [];
      const a = activityData.status === 'fulfilled' ? activityData.value : null;

      setStats({
        hours: d?.hours_this_week ? Math.round(d.hours_this_week) : 0,
        bestScore: d?.avg_score || 0,
        goalsCompleted: d?.topics_mastered || 0,
        totalGoals: d?.total_topics || 0,
        streak: d?.streak || 0,
        focus: d?.avg_score ? Math.min(98, Math.round(d.avg_score * 1.1)) : 0,
      });

      if (Array.isArray(m) && m.length > 0) {
        const mastered = m.filter((t: any) => (t.mastery || 0) >= 80).length;
        const struggling = m.filter((t: any) => (t.mastery || 0) < 40).length;
        const newInsights = [];
        if (mastered > 0) newInsights.push({ label: 'Strength', text: `You've mastered ${mastered} topic${mastered > 1 ? 's' : ''}. Keep building on your strengths!`, variant: 'success' });
        if (struggling > 0) newInsights.push({ label: 'Focus area', text: `${struggling} topic${struggling > 1 ? 's need' : ' needs'} attention. Try 30 min daily review.`, variant: 'warning' });
        newInsights.push({ label: 'Tip', text: `You have a ${d?.streak || 0}-day streak. Consistent practice improves retention!`, variant: 'info' });
        setInsights(newInsights);
      } else {
        setInsights([
          { label: 'Start', text: 'Begin studying to see personalized AI insights here.', variant: 'info' },
        ]);
      }

      const semesterVal = dashData.status === 'fulfilled' ? (user?.semester || 6) : 6;
      const data = await api.getVTUSubjects(semesterVal);
      const subjectList = data.subjects || [];

      const withModules: SubjectWithModules[] = [];
      for (const s of subjectList) {
        if (s.type === 'theory') {
          try {
            const detail = await api.getVTUSubjectDetails(s.code);
            withModules.push({ code: s.code, name: s.name, credits: s.credits, modules: detail.modules || {} });
          } catch {
            withModules.push({ code: s.code, name: s.name, credits: s.credits, modules: {} });
          }
        }
      }
      setSubjects(withModules);

      const progressMap: Record<string, Record<string, boolean[]>> = {};
      withModules.forEach(s => {
        progressMap[s.code] = {};
        Object.entries(s.modules).forEach(([modNum, mod]) => {
          progressMap[s.code][modNum] = mod.topics.map((_, i) => i < 1);
        });
      });
      setProgress(progressMap);

      // Set chart data from activity history
      if (a) {
        setChartData({
          weekly_activity: a.weekly_activity || [],
          subject_performance: a.subject_performance || [],
          test_trends: a.test_trends || [],
          subject_distribution: a.subject_distribution || [],
        });
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (subjectCode: string, moduleNum: string, topicIdx: number) => {
    setProgress(prev => {
      const newProgress = JSON.parse(JSON.stringify(prev));
      if (!newProgress[subjectCode]) newProgress[subjectCode] = {};
      if (!newProgress[subjectCode][moduleNum]) newProgress[subjectCode][moduleNum] = [];
      newProgress[subjectCode][moduleNum][topicIdx] = !newProgress[subjectCode][moduleNum][topicIdx];
      return newProgress;
    });
  };

  const getSubjectProgress = (code: string): number => {
    const sp = progress[code];
    if (!sp) return 0;
    let done = 0, total = 0;
    Object.values(sp).forEach(topics => { topics.forEach(t => { total++; if (t) done++; }); });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const getModuleProgress = (code: string, modNum: string): number => {
    const topics = progress[code]?.[modNum];
    if (!topics || topics.length === 0) return 0;
    return Math.round((topics.filter(Boolean).length / topics.length) * 100);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Detailed insights into your learning journey</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Hours', value: `${stats.hours}` },
              { label: 'Avg Score', value: `${stats.bestScore}%` },
              { label: 'Mastery', value: `${stats.goalsCompleted}/${stats.totalGoals}` },
              { label: 'Streak', value: `${stats.streak}d` },
              { label: 'Focus', value: `${stats.focus}%` },
              { label: 'Topics', value: `${stats.totalGoals}` },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <p className="text-[11px] text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-xl font-semibold tracking-tight">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Study Activity</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Daily engagement over time</p>
              </CardHeader>
              <CardContent><ActivityChart data={chartData.weekly_activity} /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Subject Performance</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Average scores by subject</p>
              </CardHeader>
              <CardContent><PerformanceChart data={chartData.subject_performance} /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Test Trends</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">6-month progression</p>
              </CardHeader>
              <CardContent><TestTrendsChart data={chartData.test_trends} /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Time Distribution</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Hours per subject</p>
              </CardHeader>
              <CardContent><SubjectDistribution data={chartData.subject_distribution} /></CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-1">Subject Progress Tracker</h2>
            <p className="text-sm text-muted-foreground mb-4">Click a subject to see module flowchart, click a module to see topics</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-foreground border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Subjects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {subjects.map(subject => {
                    const pct = getSubjectProgress(subject.code);
                    const isSelected = expandedSubject === subject.code;
                    return (
                      <button
                        key={subject.code}
                        onClick={() => { setExpandedSubject(subject.code); setExpandedModule(null); }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${isSelected ? 'bg-muted' : 'hover:bg-muted/50'}`}
                      >
                        <div>
                          <p className={`text-sm font-medium ${isSelected ? '' : 'text-muted-foreground'}`}>{subject.name}</p>
                          <p className="text-[11px] text-muted-foreground">{subject.code}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{pct}%</span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    {expandedSubject ? subjects.find(s => s.code === expandedSubject)?.name || 'Modules' : 'Select a subject'}
                  </CardTitle>
                  {expandedSubject && <p className="text-xs text-muted-foreground">Module progress flowchart</p>}
                </CardHeader>
                <CardContent>
                  {!expandedSubject ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Click a subject to see modules</p>
                  ) : (
                    <div className="space-y-0">
                      {Object.entries(subjects.find(s => s.code === expandedSubject)?.modules || {}).map(([modNum, mod]) => {
                        const modPct = getModuleProgress(expandedSubject, modNum);
                        const modKey = `${expandedSubject}-${modNum}`;
                        const isSelected = expandedModule === modKey;
                        return (
                          <div key={modNum} className="timeline-item">
                            <div className="flex flex-col items-center">
                              <div className={`timeline-dot ${modPct === 100 ? 'completed' : modPct > 0 ? 'active' : 'pending'}`} />
                            </div>
                            <button
                              onClick={() => setExpandedModule(modKey)}
                              className={`flex-1 min-w-0 text-left p-2.5 rounded-lg transition-colors ${isSelected ? 'bg-muted' : 'hover:bg-muted/50'}`}
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Module {modNum}</p>
                                <span className="text-xs text-muted-foreground">{modPct}%</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{mod.title}</p>
                              <div className="w-full h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${modPct}%` }} />
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    {expandedModule
                      ? `Module ${expandedModule.split('-')[1]}: ${subjects.find(s => s.code === expandedSubject)?.modules[expandedModule.split('-')[1]]?.title || ''}`
                      : 'Topics'
                    }
                  </CardTitle>
                  {expandedModule && <p className="text-xs text-muted-foreground">Mark topics as done one by one</p>}
                </CardHeader>
                <CardContent>
                  {!expandedModule ? (
                    <p className="text-sm text-muted-foreground text-center py-8">Click a module to see topics</p>
                  ) : (() => {
                    const modNum = expandedModule.split('-')[1];
                    const subjectCode = expandedModule.split('-')[0];
                    const mod = subjects.find(s => s.code === subjectCode)?.modules[modNum];
                    const topics = progress[subjectCode]?.[modNum] || [];
                    if (!mod) return null;
                    const firstIncompleteIdx = topics.findIndex(t => !t);
                    return (
                      <div className="space-y-0">
                        {mod.topics.map((topic, idx) => {
                          const isDone = topics[idx] || false;
                          const canMarkDone = idx === firstIncompleteIdx;
                          return (
                            <div key={idx} className="timeline-item">
                              <div className="flex flex-col items-center">
                                <div className={`timeline-dot ${isDone ? 'completed' : canMarkDone ? 'active' : 'pending'}`} />
                              </div>
                              <button
                                onClick={() => canMarkDone && toggleTopic(subjectCode, modNum, idx)}
                                className={`flex-1 min-w-0 text-left p-2 rounded-md transition-colors ${canMarkDone ? 'hover:bg-muted/50 cursor-pointer' : 'cursor-default'}`}
                              >
                                <p className={`text-sm ${isDone ? 'line-through text-muted-foreground' : 'font-medium'}`}>{topic}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {isDone ? 'Completed' : canMarkDone ? 'Click to mark done' : ''}
                                </p>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI Insights</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Personalized recommendations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {insights.map((insight, i) => (
                  <div key={i} className="p-4 border border-border rounded-md">
                    <Badge variant="outline" className="mb-2 text-[10px]">{insight.label}</Badge>
                    <p className="text-sm">{insight.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
