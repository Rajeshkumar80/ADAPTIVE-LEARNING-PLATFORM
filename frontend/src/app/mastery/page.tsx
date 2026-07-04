'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface TopicItem {
  topic_id: number;
  topic_name: string;
  subject: string;
  subject_code: string;
  mastery_percent: number;
  mastery_level: string;
  is_unlocked: boolean;
}

export default function MasteryPage() {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [summary, setSummary] = useState({ mastered: 0, proficient: 0, learning: 0, weak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stateData = await api.getLearningState();
        if (stateData && stateData.topics) {
          setTopics(stateData.topics.map((t: any) => ({
            topic_id: t.topic_id,
            topic_name: t.topic_name,
            subject: t.subject,
            subject_code: t.subject_code,
            mastery_percent: t.mastery_percent || 0,
            mastery_level: t.mastery_level || 'weak',
            is_unlocked: t.is_unlocked ?? true,
          })));
          setSummary(stateData.summary || { mastered: 0, proficient: 0, learning: 0, weak: 0 });
        }
      } catch {
        // empty
      }
      setLoading(false);
    };
    load();
  }, []);

  const getStatus = (mastery: number) => {
    if (mastery >= 80) return { label: 'Mastered', class: 'bg-green-50 text-green-700 border-green-200' };
    if (mastery >= 50) return { label: 'Proficient', class: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (mastery > 0) return { label: 'Learning', class: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Not Started', class: 'bg-red-50 text-red-700 border-red-200' };
  };

  // Group topics by subject
  const subjectGroups: Record<string, { code: string; topics: TopicItem[]; avgMastery: number }> = {};
  topics.forEach(t => {
    if (!subjectGroups[t.subject]) subjectGroups[t.subject] = { code: t.subject_code, topics: [], avgMastery: 0 };
    subjectGroups[t.subject].topics.push(t);
  });
  Object.values(subjectGroups).forEach(g => {
    g.avgMastery = Math.round(g.topics.reduce((sum, t) => sum + t.mastery_percent, 0) / (g.topics.length || 1));
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
            <h1 className="text-2xl font-semibold tracking-tight">Topic Mastery</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track your knowledge across all topics</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Mastered</p><p className="text-2xl font-semibold tracking-tight">{summary.mastered}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Proficient</p><p className="text-2xl font-semibold tracking-tight">{summary.proficient}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Learning</p><p className="text-2xl font-semibold tracking-tight">{summary.learning}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Weak</p><p className="text-2xl font-semibold tracking-tight">{summary.weak}</p></CardContent></Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topics.length === 0 && (
                  <p className="px-6 py-8 text-sm text-muted-foreground text-center">No topics tracked yet. Start studying to see your mastery progress.</p>
                )}
                {Object.entries(subjectGroups).map(([subjectName, group]) => {
                  const status = getStatus(group.avgMastery);
                  return (
                    <div key={subjectName} className="px-6 py-4 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">{group.code}</span>
                          <span className="text-sm font-medium">{subjectName}</span>
                        </div>
                        <Badge variant="outline" className={`text-[10px] ${status.class}`}>{status.label} ({group.avgMastery}%)</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 max-w-xs h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-foreground" style={{ width: `${group.avgMastery}%` }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {group.topics.map(t => {
                          const ts = getStatus(t.mastery_percent);
                          return (
                            <div key={t.topic_id} className="flex items-center gap-2 text-xs p-2 rounded bg-muted/30">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${t.mastery_percent >= 80 ? 'bg-green-500' : t.mastery_percent >= 50 ? 'bg-blue-500' : t.mastery_percent > 0 ? 'bg-amber-500' : 'bg-red-400'}`} />
                              <span className="truncate flex-1">{t.topic_name}</span>
                              <span className="text-muted-foreground font-mono">{Math.round(t.mastery_percent)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
