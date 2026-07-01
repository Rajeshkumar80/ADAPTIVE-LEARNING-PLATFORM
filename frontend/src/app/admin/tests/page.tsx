'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Plus, Loader2 } from 'lucide-react';

export default function AdminTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listTests().then(setTests).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex min-h-screen bg-background"><Sidebar isAdmin /><div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div></div>;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Tests</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{tests.length} assessments</p>
            </div>
            <Link href="/admin/tests/create"><Button size="sm"><Plus className="w-3.5 h-3.5" /> Create Test</Button></Link>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {tests.length === 0 && <p className="px-6 py-8 text-sm text-muted-foreground text-center">No tests created yet</p>}
                {tests.map((t: any) => (
                  <div key={t.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{t.title}</span>
                        <Badge variant="outline" className="text-[10px]">{t.type || 'quiz'}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{t.duration_minutes}m · {t.total_marks} marks · Pass: {t.passing_marks}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${t.is_active ? 'border-green-200 bg-green-50 text-green-700' : ''}`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </Badge>
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
