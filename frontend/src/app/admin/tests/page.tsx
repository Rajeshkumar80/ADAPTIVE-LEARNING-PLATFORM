'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, AlertTriangle, MoreHorizontal } from 'lucide-react';

export default function AdminTestsPage() {
  const tests = [
    { id: 'T001', title: 'DSA Mid-Term Exam', subject: 'DSA', completed: 89, total: 156, flags: 3, score: 82, status: 'live' },
    { id: 'T002', title: 'DBMS Quiz 3', subject: 'DBMS', completed: 142, total: 142, flags: 1, score: 76, status: 'completed' },
    { id: 'T003', title: 'OS Assignment 2', subject: 'OS', completed: 98, total: 134, flags: 0, score: 85, status: 'live' },
    { id: 'T004', title: 'CN Lab Test', subject: 'CN', completed: 45, total: 128, flags: 2, score: 79, status: 'live' },
    { id: 'T005', title: 'SE Project Review', subject: 'SE', completed: 0, total: 145, flags: 0, score: 0, status: 'scheduled' },
    { id: 'T006', title: 'AI Workshop Quiz', subject: 'AI', completed: 98, total: 98, flags: 0, score: 88, status: 'completed' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Tests</h1>
              <p className="text-sm text-muted-foreground mt-0.5">All assessments and quizzes</p>
            </div>
            <Link href="/admin/tests/create">
              <Button size="sm">
                <Plus className="w-3.5 h-3.5" />
                Create Test
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-2xl font-semibold tracking-tight">23</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Live</p><p className="text-2xl font-semibold tracking-tight">3</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Submissions</p><p className="text-2xl font-semibold tracking-tight">972</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Avg Score</p><p className="text-2xl font-semibold tracking-tight">82%</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input type="text" placeholder="Search tests..." className="w-full h-8 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors" />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {tests.map((t) => (
                  <div key={t.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-muted-foreground font-mono">{t.id}</span>
                        <span className="text-sm font-medium">{t.title}</span>
                        <Badge variant="outline" className="text-[10px]">{t.subject}</Badge>
                        {t.status === 'live' && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-green-700 font-medium">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Live
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-xs h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-foreground" style={{ width: `${(t.completed / t.total) * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">{t.completed}/{t.total}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      {t.score > 0 && <span className="text-sm font-mono">{t.score}%</span>}
                      {t.flags > 0 && (
                        <Badge variant="outline" className="text-[10px] border-red-200 bg-red-50 text-red-700">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {t.flags}
                        </Badge>
                      )}
                      <Badge variant="outline" className={
                        t.status === 'live' ? 'text-[10px] border-green-200 bg-green-50 text-green-700' :
                        t.status === 'completed' ? 'text-[10px]' :
                        'text-[10px] border-amber-200 bg-amber-50 text-amber-700'
                      }>
                        {t.status}
                      </Badge>
                      <button className="p-1 text-muted-foreground hover:text-foreground rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
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
