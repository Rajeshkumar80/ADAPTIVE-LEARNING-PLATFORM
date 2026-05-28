'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityChart, PerformanceChart, TestTrendsChart, SubjectDistribution } from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ChevronRight, ChevronDown, BookOpen, CheckCircle2, Circle } from 'lucide-react';

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
              PROGRESS TRACKER — Subject → Module → Topic (expandable)
              ═══════════════════════════════════════════════════════════════ */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-1">Subject Progress Tracker</h2>
            <p className="text-sm text-muted-foreground mb-4">Click a subject to expand modules, click a module to see topics</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-foreground border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-3">
              {subjects.map(subject => {
                const isExpanded = expandedSubject === subject.code;
                const pct = getSubjectProgress(subject.code);
                const moduleCount = Object.keys(subject.modules).length;

                return (
                  <Card key={subject.code} className="overflow-hidden">
                    {/* Subject header */}
                    <button
                      onClick={() => setExpandedSubject(isExpanded ? null : subject.code)}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{subject.name}</p>
                          <p className="text-xs text-muted-foreground">{subject.code} · {moduleCount} Modules · {subject.credits} Credits</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold">{pct}%</p>
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>

                    {/* Expanded modules */}
                    {isExpanded && (
                      <div className="border-t border-border">
                        {Object.entries(subject.modules).map(([modNum, mod]) => {
                          const modKey = `${subject.code}-${modNum}`;
                          const isModExpanded = expandedModule === modKey;
                          const modPct = getModuleProgress(subject.code, modNum);
                          const topics = progress[subject.code]?.[modNum] || [];

                          return (
                            <div key={modNum} className="border-b border-border last:border-b-0">
                              {/* Module header */}
                              <button
                                onClick={() => setExpandedModule(isModExpanded ? null : modKey)}
                                className="w-full flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`timeline-dot ${modPct === 100 ? 'completed' : modPct > 0 ? 'active' : 'pending'}`} />
                                  <div className="text-left">
                                    <p className="text-sm font-medium">Module {modNum}: {mod.title}</p>
                                    <p className="text-xs text-muted-foreground">{mod.topics.length} topics · {modPct}% done</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${modPct}%` }} />
                                  </div>
                                  {isModExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                                </div>
                              </button>

                              {/* Expanded topics */}
                              {isModExpanded && (
                                <div className="px-6 pb-3 pl-14 space-y-1">
                                  {mod.topics.map((topic, idx) => {
                                    const isDone = topics[idx] || false;
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => toggleTopic(subject.code, modNum, idx)}
                                        className="w-full flex items-center gap-2.5 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors text-left"
                                      >
                                        {isDone ? (
                                          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                        ) : (
                                          <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                                        )}
                                        <span className={`text-xs ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                                          {topic}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                );
              })}
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
