'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function MasteryPage() {
  const [mastery, setMastery] = useState<any>({ subjects: [], streak_days: 0, total_study_hours: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMastery().then(setMastery).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const allTopics = mastery.subjects || [];
  const mastered = allTopics.filter((s: any) => (s.avg_mastery || 0) >= 80).length;
  const proficient = allTopics.filter((s: any) => (s.avg_mastery || 0) >= 50 && (s.avg_mastery || 0) < 80).length;
  const learning = allTopics.filter((s: any) => (s.avg_mastery || 0) > 0 && (s.avg_mastery || 0) < 50).length;
  const weak = allTopics.filter((s: any) => (s.avg_mastery || 0) === 0).length;

  const getStatus = (mastery: number) => {
    if (mastery >= 80) return { label: 'mastered', class: 'bg-green-50 text-green-700 border-green-200' };
    if (mastery >= 50) return { label: 'proficient', class: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (mastery > 0) return { label: 'learning', class: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'not started', class: 'bg-red-50 text-red-700 border-red-200' };
  };

  if (loading) {
    return <div className="flex min-h-screen bg-background"><Sidebar /><div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div></div>;
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
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Mastered</p><p className="text-2xl font-semibold tracking-tight">{mastered}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Proficient</p><p className="text-2xl font-semibold tracking-tight">{proficient}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Learning</p><p className="text-2xl font-semibold tracking-tight">{learning}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Not Started</p><p className="text-2xl font-semibold tracking-tight">{weak}</p></CardContent></Card>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {allTopics.length === 0 && <p className="px-6 py-8 text-sm text-muted-foreground text-center">No subjects tracked yet. Start studying to see your mastery progress.</p>}
                {allTopics.map((s: any) => {
                  const status = getStatus(s.avg_mastery || 0);
                  return (
                    <div key={s.subject_id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-muted-foreground font-mono">{s.subject_code}</span>
                          <span className="text-sm font-medium">{s.subject_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-xs h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground" style={{ width: `${s.avg_mastery || 0}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono w-9">{Math.round(s.avg_mastery || 0)}%</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ml-4 ${status.class}`}>{status.label}</Badge>
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
