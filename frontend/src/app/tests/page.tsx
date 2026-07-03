'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronRight, X, Award, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface TestItem {
  id: number;
  title: string;
  description?: string;
  subject?: string | { code: string; name: string };
  type?: string;
  difficulty?: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
}

function getSubjectName(subject: string | { code: string; name: string } | undefined): string {
  if (!subject) return '';
  if (typeof subject === 'object') return subject.name;
  return subject;
}

interface AttemptItem {
  attempt_id: number;
  test_id: number;
  test_title: string;
  subject: string;
  score: number;
  total_marks: number;
  is_completed: boolean;
  started_at: string;
  submitted_at?: string;
  passed?: boolean | null;
}

export default function TestsPage() {
  const [upcoming, setUpcoming] = useState<TestItem[]>([]);
  const [attempts, setAttempts] = useState<AttemptItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<AttemptItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [testsRes, attemptsRes] = await Promise.allSettled([
        api.listTests(),
        api.getMyAttempts(),
      ]);
      if (testsRes.status === 'fulfilled') setUpcoming(testsRes.value);
      if (attemptsRes.status === 'fulfilled') setAttempts(attemptsRes.value);
    } catch {}
    setLoading(false);
  }

  const completed = attempts.filter(a => a.is_completed);
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, a) => s + (a.total_marks > 0 ? (a.score / a.total_marks) * 100 : 0), 0) / completed.length)
    : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
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
            <h1 className="text-2xl font-semibold tracking-tight">Tests & Assessments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your upcoming and completed tests</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Upcoming</p><p className="text-2xl font-semibold tracking-tight">{upcoming.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Completed</p><p className="text-2xl font-semibold tracking-tight">{completed.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Avg Score</p><p className="text-2xl font-semibold tracking-tight">{avgScore}%</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Passed</p><p className="text-2xl font-semibold tracking-tight text-green-600">{completed.filter(a => a.passed).length}</p></CardContent></Card>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-tight mb-3">Upcoming Tests</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {upcoming.length === 0 && (
                    <p className="px-6 py-8 text-sm text-muted-foreground text-center">No upcoming tests</p>
                  )}
                  {upcoming.map((test) => (
                    <div key={test.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{test.title}</p>
                          <Badge variant="outline" className="text-[10px]">{getSubjectName(test.subject) || test.type || 'Quiz'}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {test.starts_at && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(test.starts_at).toLocaleDateString()}</span>}
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{test.duration_minutes}m · {test.total_marks} marks</span>
                        </div>
                      </div>
                      <Link href={`/tests/take?id=${test.id}`}>
                        <Button size="sm">Take Test</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-tight mb-3">Recent Results</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {completed.length === 0 && (
                    <p className="px-6 py-8 text-sm text-muted-foreground text-center">No completed tests yet</p>
                  )}
                  {completed.map((a) => (
                    <div key={a.attempt_id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{a.test_title}</p>
                          {a.subject && <Badge variant="outline" className="text-[10px]">{a.subject}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : ''}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-base font-semibold tabular-nums">{a.score}<span className="text-xs text-muted-foreground">/{a.total_marks}</span></p>
                        </div>
                        <Badge variant={a.passed ? 'default' : 'destructive'} className="font-mono">{a.passed ? 'PASS' : 'FAIL'}</Badge>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => setSelectedResult(a)}>
                          View <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {selectedResult && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedResult(null)}>
          <div className="bg-background rounded-lg max-w-lg w-full overflow-hidden border border-border" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight">Test Result</h2>
              <button onClick={() => setSelectedResult(null)} className="p-1 hover:bg-muted rounded"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{selectedResult.test_title}</h3>
                <p className="text-sm text-muted-foreground">{selectedResult.subject}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Score</p>
                  <p className="text-2xl font-semibold tracking-tight">{selectedResult.score}</p>
                </div>
                <div className="text-center p-4 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-2xl font-semibold tracking-tight">{selectedResult.total_marks}</p>
                </div>
                <div className="text-center p-4 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Result</p>
                  <p className={`text-2xl font-semibold tracking-tight ${selectedResult.passed ? 'text-green-600' : 'text-red-600'}`}>{selectedResult.passed ? 'PASS' : 'FAIL'}</p>
                </div>
              </div>
              {selectedResult.passed && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-md">
                  <Award className="w-4 h-4 shrink-0" />
                  <p className="text-xs">Excellent! A certificate has been added to your collection.</p>
                </div>
              )}
              <Button onClick={() => setSelectedResult(null)} className="w-full">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
