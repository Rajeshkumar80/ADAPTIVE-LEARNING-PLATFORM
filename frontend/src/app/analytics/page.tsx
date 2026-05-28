'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityChart, PerformanceChart, TestTrendsChart, SubjectDistribution } from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ChevronRight, BookOpen, CheckCircle2, Circle } from 'lucide-react';

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

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const semester = user?.semester || 6;
      const data = await api.getVTUSubjects(semester);
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

      // Initialize mock progress
      const mockProgress: Record<string, Record<string, boolean[]>> = {};
      withModules.forEach(s => {
        mockProgress[s.code] = {};
        Object.entries(s.modules).forEach(([modNum, mod]) => {
          mockProgress[s.code][modNum] = mod.topics.map((_, i) => i < 2);
        });
      });
      setProgress(mockProgress);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (subjectCode: string, moduleNum: string, topicIdx: number) => {
    setProgress(prev => {
      const updated = { ...prev };
      if (!updated[subjectCode]) updated[subjectCode] = {};
      if (!updated[subjectCode][moduleNum]) updated[subjectCode][moduleNum] = [];
      updated[subjectCode][moduleNum][topicIdx] = !updated[subjectCode][moduleNum][topicIdx];
      return { ...updated };
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Hours', value: '245' },
              { label: 'Best Score', value: '98%' },
              { label: 'Goals', value: '23/30' },
              { label: 'Streak', value: '7d' },
              { label: 'Focus', value: '92%' },
              { label: 'Growth', value: '+12%' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <p className="text-[11px] text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-xl font-semibold tracking-tight">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Study Activity</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Daily engagement over time</p>
              </CardHeader>
              <CardContent><ActivityChart /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Subject Performance</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Average scores by subject</p>
              </CardHeader>
              <CardContent><PerformanceChart /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Test Trends</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">6-month progression</p>
              </CardHeader>
              <CardContent><TestTrendsChart /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Time Distribution</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Hours per subject</p>
              </CardHeader>
              <CardContent><SubjectDistribution /></CardContent>
            </Card>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              PROGRESS TRACKER — Subject → Module Timeline → Topic Timeline
              ═══════════════════════════════════════════════════════════════ */}
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
              {/* Column 1: Subject List */}
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

              {/* Column 2: Module Timeline (flowchart style) */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    {expandedSubject ? subjects.find(s => s.code === expandedSubject)?.name || 'Modules' : 'Select a subject'}
                  </CardTitle>
                  {expandedSubject && <p className="text-xs text-muted-foreground">Module progress flowchart</p>}
                </CardHeader>
                <CardContent>
                  {!expandedSubject ? (
                    <p className="text-sm text-muted-foreground text-center py-8">← Click a subject to see modules</p>
                  ) : (
                    <div className="space-y-0">
                      {Object.entries(subjects.find(s => s.code === expandedSubject)?.modules || {}).map(([modNum, mod], idx) => {
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

              {/* Column 3: Topic Timeline (flowchart style) */}
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
                    <p className="text-sm text-muted-foreground text-center py-8">← Click a module to see topics</p>
                  ) : (() => {
                    const modNum = expandedModule.split('-')[1];
                    const subjectCode = expandedModule.split('-')[0];
                    const mod = subjects.find(s => s.code === subjectCode)?.modules[modNum];
                    const topics = progress[subjectCode]?.[modNum] || [];
                    if (!mod) return null;

                    // Find the first incomplete topic — only that one can be marked done
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
                                <p className={`text-sm ${isDone ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                                  {topic}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {isDone ? '✓ Completed' : canMarkDone ? 'Click to mark done →' : ''}
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

          {/* AI Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI Insights</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Personalized recommendations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 border border-border rounded-md">
                  <Badge variant="outline" className="mb-2 text-[10px]">Strength</Badge>
                  <p className="text-sm">You excel at Data Structures with consistent 90%+ scores.</p>
                </div>
                <div className="p-4 border border-border rounded-md">
                  <Badge variant="outline" className="mb-2 text-[10px]">Focus area</Badge>
                  <p className="text-sm">Operating Systems needs attention. Try 30 min daily review.</p>
                </div>
                <div className="p-4 border border-border rounded-md">
                  <Badge variant="outline" className="mb-2 text-[10px]">Tip</Badge>
                  <p className="text-sm">Your focus is highest 9–11 AM. Schedule complex topics then.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
