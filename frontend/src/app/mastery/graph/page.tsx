'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface GraphNode {
  id: number;
  name: string;
  module: number;
  prerequisites: { id: number; name: string; threshold: number }[];
  dependents: { id: number; name: string }[];
}

interface TopicMastery {
  topic_id: number;
  mastery_percent: number;
}

export default function DependencyGraphPage() {
  const [graph, setGraph] = useState<GraphNode[]>([]);
  const [mastery, setMastery] = useState<TopicMastery[]>([]);
  const [subjectId, setSubjectId] = useState<number>(1);
  const [subjects, setSubjects] = useState<{ id: number; name: string; code: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [stateData, subjectsData] = await Promise.all([
          api.getLearningState(),
          api.getStudentSubjects(),
        ]);
        if (subjectsData) setSubjects(subjectsData);
        if (stateData?.topics) {
          setMastery(stateData.topics.map((t: any) => ({
            topic_id: t.topic_id,
            mastery_percent: t.mastery_percent || 0,
          })));
        }
        if (subjectsData?.length > 0) {
          setSubjectId(subjectsData[0].id);
        }
      } catch { /* empty */ }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!subjectId) return;
    const loadGraph = async () => {
      try {
        const data = await api.getDependencyGraph(subjectId);
        if (data?.graph) setGraph(data.graph);
      } catch { setGraph([]); }
    };
    loadGraph();
  }, [subjectId]);

  const getMastery = (topicId: number) =>
    mastery.find(m => m.topic_id === topicId)?.mastery_percent || 0;

  const getStatus = (masteryPercent: number) => {
    if (masteryPercent >= 80) return { color: 'bg-green-500', border: 'border-green-400', text: 'text-green-700', label: 'Mastered' };
    if (masteryPercent >= 50) return { color: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-700', label: 'Proficient' };
    if (masteryPercent > 0) return { color: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-700', label: 'Learning' };
    return { color: 'bg-red-400', border: 'border-red-300', text: 'text-red-600', label: 'Locked' };
  };

  // Group by module for layout
  const modules = new Map<number, GraphNode[]>();
  graph.forEach(node => {
    if (!modules.has(node.module)) modules.set(node.module, []);
    modules.get(node.module)!.push(node);
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Topic Dependency Graph</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Visualize prerequisite relationships and mastery status</p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={subjectId}
              onChange={e => setSubjectId(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border rounded-md bg-background"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Mastered</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Proficient</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Learning</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Not Started</span>
            </div>
          </div>

          {graph.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">No dependency data for this subject.</CardContent></Card>
          ) : (
            <div className="space-y-8">
              {Array.from(modules.entries()).sort((a, b) => a[0] - b[0]).map(([mod, nodes]) => (
                <div key={mod}>
                  <h3 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Module {mod}</h3>
                  <div className="flex flex-wrap gap-4">
                    {nodes.map(node => {
                      const m = getMastery(node.id);
                      const status = getStatus(m);
                      const isLocked = m === 0 && node.prerequisites.length > 0;
                      return (
                        <div key={node.id} className="relative">
                          <Card className={`w-48 ${isLocked ? 'opacity-60' : ''} ${status.border} border-2`}>
                            <CardContent className="p-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                                <span className="text-sm font-medium truncate">{node.name}</span>
                              </div>
                              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${status.color}`} style={{ width: `${m}%` }} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] ${status.text}`}>{status.label}</span>
                                <span className="text-[10px] text-muted-foreground font-mono">{Math.round(m)}%</span>
                              </div>
                              {node.prerequisites.length > 0 && (
                                <div className="text-[10px] text-muted-foreground">
                                  Requires: {node.prerequisites.map(p => p.name).join(', ')}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          {node.dependents.length > 0 && (
                            <div className="absolute -right-6 top-1/2 text-muted-foreground text-lg">→</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {mod < Math.max(...modules.keys()) && (
                    <div className="flex justify-center my-2">
                      <div className="w-px h-4 bg-border" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
