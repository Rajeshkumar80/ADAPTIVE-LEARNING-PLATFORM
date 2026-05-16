'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronRight, X, Award } from 'lucide-react';

interface CompletedTest {
  id: number;
  title: string;
  subject: string;
  date: string;
  score: number;
  grade: string;
}

export default function TestsPage() {
  const [selectedResult, setSelectedResult] = useState<CompletedTest | null>(null);

  const upcoming = [
    { id: 1, title: 'Operating Systems Mid-Term', subject: 'OS', date: 'May 18', time: '10:00 AM', duration: 60, questions: 30, difficulty: 'Hard' },
    { id: 2, title: 'Computer Networks Quiz 4', subject: 'CN', date: 'May 20', time: '2:00 PM', duration: 30, questions: 15, difficulty: 'Medium' },
    { id: 3, title: 'Software Engineering Test', subject: 'SE', date: 'May 22', time: '11:00 AM', duration: 90, questions: 50, difficulty: 'Easy' },
  ];

  const completed: CompletedTest[] = [
    { id: 1, title: 'Data Structures Mid-Term', subject: 'DSA', date: 'May 12', score: 92, grade: 'A+' },
    { id: 2, title: 'DBMS Quiz 3', subject: 'DBMS', date: 'May 10', score: 88, grade: 'A' },
    { id: 3, title: 'Algorithms Assignment', subject: 'DSA', date: 'May 8', score: 85, grade: 'A' },
    { id: 4, title: 'OS Theory Test', subject: 'OS', date: 'May 5', score: 78, grade: 'B+' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tests & Assessments</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your upcoming and completed tests
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Upcoming</p><p className="text-2xl font-semibold tracking-tight">3</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Completed</p><p className="text-2xl font-semibold tracking-tight">12</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Avg Score</p><p className="text-2xl font-semibold tracking-tight">85.5%</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Improvement</p><p className="text-2xl font-semibold tracking-tight text-green-600">+5.2%</p></CardContent></Card>
          </div>

          {/* Upcoming */}
          <div>
            <h2 className="text-sm font-semibold tracking-tight mb-3">Upcoming Tests</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {upcoming.map((test) => (
                    <div key={test.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{test.title}</p>
                          <Badge variant="outline" className="text-[10px]">{test.subject}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{test.date} · {test.time}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{test.duration}m · {test.questions}Q</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`mr-3 text-[10px] ${
                        test.difficulty === 'Easy' ? 'border-green-200 bg-green-50 text-green-700' :
                        test.difficulty === 'Medium' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                        'border-red-200 bg-red-50 text-red-700'
                      }`}>
                        {test.difficulty}
                      </Badge>
                      <Link href="/ai-tutor">
                        <Button size="sm" variant="outline">Prepare</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Results */}
          <div>
            <h2 className="text-sm font-semibold tracking-tight mb-3">Recent Results</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {completed.map((test) => (
                    <div key={test.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{test.title}</p>
                          <Badge variant="outline" className="text-[10px]">{test.subject}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{test.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-base font-semibold tabular-nums">{test.score}<span className="text-xs text-muted-foreground">/100</span></p>
                        </div>
                        <Badge variant="default" className="font-mono">{test.grade}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7"
                          onClick={() => setSelectedResult(test)}
                        >
                          View
                          <ChevronRight className="w-3 h-3" />
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

      {/* Result Modal */}
      {selectedResult && (
        <div
          className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedResult(null)}
        >
          <div
            className="bg-background rounded-lg max-w-lg w-full overflow-hidden border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-tight">Test Result</h2>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-lg font-semibold tracking-tight">{selectedResult.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedResult.subject} · {selectedResult.date}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Score</p>
                  <p className="text-2xl font-semibold tracking-tight">{selectedResult.score}</p>
                </div>
                <div className="text-center p-4 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="text-2xl font-semibold tracking-tight">100</p>
                </div>
                <div className="text-center p-4 border border-border rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Grade</p>
                  <p className="text-2xl font-semibold tracking-tight font-mono">{selectedResult.grade}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Performance Breakdown</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span>Easy questions</span>
                    <span className="font-mono">10/10 · 100%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Medium questions</span>
                    <span className="font-mono">8/10 · 80%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Hard questions</span>
                    <span className="font-mono">7/10 · 70%</span>
                  </div>
                </div>
              </div>

              {selectedResult.score >= 90 && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-md">
                  <Award className="w-4 h-4 shrink-0" />
                  <p className="text-xs">
                    Excellent! A certificate has been added to your collection.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Link href="/certificates" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View Certificate
                  </Button>
                </Link>
                <Button onClick={() => setSelectedResult(null)} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
