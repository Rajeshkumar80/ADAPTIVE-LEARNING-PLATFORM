'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

export default function TestsPage() {
  const upcoming = [
    { id: 1, title: 'Operating Systems Mid-Term', subject: 'OS', date: 'May 18', time: '10:00 AM', duration: 60, questions: 30, difficulty: 'Hard' },
    { id: 2, title: 'Computer Networks Quiz 4', subject: 'CN', date: 'May 20', time: '2:00 PM', duration: 30, questions: 15, difficulty: 'Medium' },
    { id: 3, title: 'Software Engineering Test', subject: 'SE', date: 'May 22', time: '11:00 AM', duration: 90, questions: 50, difficulty: 'Easy' },
  ];

  const completed = [
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
                      <Button size="sm" variant="outline">Prepare</Button>
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
                        <Button size="sm" variant="ghost" className="h-7">
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
    </div>
  );
}
