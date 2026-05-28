'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ChevronRight, ChevronDown, BookOpen, CheckCircle2, Circle, Clock } from 'lucide-react';

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

export default function ProgressPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<SubjectWithModules[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated progress (in production, fetch from /api/student/progress)
  const [progress, setProgress] = useState<Record<string, Record<string, boolean[]>>>({});

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const semester = user?.semester || 6;
      const data = await api.getVTUSubjects(semester);
      const subjectList = data.subjects || [];

      // Load module details for subjects that have them
      const withModules: SubjectWithModules[] = [];
      for (const s of subjectList) {
        if (s.type === 'theory') {
          try {
            const detail = await api.getVTUSubjectDetails(s.code);
            withModules.push({
              code: s.code,
              name: s.name,
              credits: s.credits,
              modules: detail.modules || {},
            });
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
          mockProgress[s.code][modNum] = mod.topics.map((_, i) => i < 2); // First 2 topics done
        });
      });
      setProgress(mockProgress);
    } catch (err) {
      console.error('Failed to load subjects:', err);
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
    const subjectProgress = progress[code];
    if (!subjectProgress) return 0;
    let done = 0, total = 0;
    Object.values(subjectProgress).forEach(topics => {
      topics.forEach(t => { total++; if (t) done++; });
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const getModuleProgress = (code: string, modNum: string): number => {
    const topics = progress[code]?.[modNum];
    if (!topics || topics.length === 0) return 0;
    const done = topics.filter(Boolean).length;
    return Math.round((done / topics.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Progress Tracker" subtitle="Track your learning module by module" />
        <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-4">
          {/* Overall stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            {subjects.slice(0, 4).map(s => (
              <div key={s.code} className="stat-card">
                <p className="text-xs text-muted-foreground truncate">{s.name}</p>
                <p className="text-2xl font-bold">{getSubjectProgress(s.code)}%</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${getSubjectProgress(s.code)}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Subject list with expandable modules */}
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
                                  <p className="text-xs text-muted-foreground">{mod.topics.length} topics</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{modPct}%</span>
                                {isModExpanded ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                              </div>
                            </button>

                            {/* Expanded topics */}
                            {isModExpanded && (
                              <div className="px-6 pb-3 pl-12 space-y-1">
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
        </main>
      </div>
    </div>
  );
}
