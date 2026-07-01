'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getClassAnalytics().then(setAnalytics).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex min-h-screen bg-background"><Sidebar isAdmin /><div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div></div>;

  const stats = [
    { label: 'Students', value: analytics.total_students || 0 },
    { label: 'Tests', value: analytics.total_tests || 0 },
    { label: 'Avg Score', value: `${analytics.avg_score || 0}%` },
    { label: 'Top Performers', value: analytics.top_performers?.length || 0 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Class Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Detailed performance insights</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
              <Card key={s.label}><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">{s.label}</p><p className="text-2xl font-semibold tracking-tight">{s.value}</p></CardContent></Card>
            ))}
          </div>
          {analytics.top_performers && analytics.top_performers.length > 0 && (
            <Card>
              <CardHeader className="pb-3"><CardTitle>Top Performers</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {analytics.top_performers.map((p: any, i: number) => (
                    <div key={i} className="flex items-center px-6 py-3">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-mono mr-3">{i + 1}</div>
                      <div className="flex-1"><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground font-mono">{p.usn}</p></div>
                      <span className="text-sm font-semibold">{p.cgpa}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
