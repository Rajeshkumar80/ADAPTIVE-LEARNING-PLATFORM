'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AntiCheatPage() {
  const flags = [
    { id: 1, severity: 'critical', test: 'DSA Mid-Term', student: '#1MS21CS045', violation: 'Multiple tab switches detected', count: 5, time: '5m ago' },
    { id: 2, severity: 'warning', test: 'OS Assignment 2', student: '#1MS21CS089', violation: 'Copy-paste blocked', count: 2, time: '15m ago' },
    { id: 3, severity: 'critical', test: 'CN Lab Test', student: '#1MS21CS112', violation: 'Browser dev tools opened', count: 1, time: '30m ago' },
    { id: 4, severity: 'info', test: 'DBMS Quiz 3', student: '#1MS21CS067', violation: 'Right-click disabled', count: 1, time: '1h ago' },
    { id: 5, severity: 'warning', test: 'DSA Mid-Term', student: '#1MS21CS023', violation: 'Multiple tab switches', count: 3, time: '2h ago' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Anti-Cheat Logs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Monitor and review violation reports</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Total today</p><p className="text-2xl font-semibold tracking-tight">8</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Critical</p><p className="text-2xl font-semibold tracking-tight text-red-600">3</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Warnings</p><p className="text-2xl font-semibold tracking-tight text-amber-600">4</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Clean tests</p><p className="text-2xl font-semibold tracking-tight">94%</p></CardContent></Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {flags.map((f) => (
                  <div key={f.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${
                      f.severity === 'critical' ? 'bg-red-500' :
                      f.severity === 'warning' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">{f.violation}</p>
                        <Badge variant="outline" className="text-[10px]">×{f.count}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono">{f.student}</span>
                        <span>·</span>
                        <span>{f.test}</span>
                        <span>·</span>
                        <span>{f.time}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`mr-3 text-[10px] ${
                      f.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-700' :
                      f.severity === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                      'border-blue-200 bg-blue-50 text-blue-700'
                    }`}>
                      {f.severity}
                    </Badge>
                    <Button size="sm" variant="outline">Investigate</Button>
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
