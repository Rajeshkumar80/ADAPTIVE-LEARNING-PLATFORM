'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AntiCheatPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAntiCheatFlags().then(setFlags).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex min-h-screen bg-background"><Sidebar isAdmin /><div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div></div>;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Anti-Cheat Logs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{flags.length} violation reports</p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {flags.length === 0 && <p className="px-6 py-8 text-sm text-muted-foreground text-center">No violations recorded</p>}
                {flags.map((f: any) => (
                  <div key={f.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${f.severity === 'critical' ? 'bg-red-500' : f.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{f.violation}</p>
                      <p className="text-xs text-muted-foreground">User #{f.user_id} · {f.created_at ? new Date(f.created_at).toLocaleString() : ''}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${f.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-700' : f.severity === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                      {f.severity} · ×{f.count}
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
