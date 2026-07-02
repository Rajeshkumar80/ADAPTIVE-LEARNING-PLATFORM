'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Brain, Target, GraduationCap, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [dashboard, setDashboard] = useState<any>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    api.getAdminDashboard().then(setDashboard).catch(() => {}).finally(() => setLoadingData(false));
  }, []);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" /></div>;

  const stats = [
    { label: 'Total Students', value: dashboard.total_students || 0, icon: Users },
    { label: 'Active Tests', value: dashboard.active_tests || 0, icon: GraduationCap },
    { label: 'Avg Performance', value: `${dashboard.avg_performance || 0}%`, icon: Target },
    { label: 'Anti-Cheat Flags', value: dashboard.flags_count || 0, icon: AlertTriangleIcon },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Hi, {user.full_name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{user.department || 'Admin'}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/admin/students"><Button variant="outline" size="sm"><Users className="w-3.5 h-3.5" /> View Students</Button></Link>
              <Link href="/admin/tests/create"><Button size="sm"><Plus className="w-3.5 h-3.5" /> Create Test</Button></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(stat => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}><CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3"><div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center"><Icon className="w-4 h-4" /></div></div>
                  <p className="text-2xl font-semibold tracking-tight mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent></Card>
              );
            })}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/admin/students" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors"><Users className="w-4 h-4 mb-2 text-muted-foreground" /><p className="text-sm font-medium">Browse Students</p></Link>
            <Link href="/admin/subjects" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors"><Brain className="w-4 h-4 mb-2 text-muted-foreground" /><p className="text-sm font-medium">Manage Subjects</p></Link>
            <Link href="/admin/analytics" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors"><Target className="w-4 h-4 mb-2 text-muted-foreground" /><p className="text-sm font-medium">Analytics</p></Link>
            <Link href="/admin/anti-cheat" className="border border-border rounded-md p-4 hover:bg-muted/40 transition-colors"><GraduationCap className="w-4 h-4 mb-2 text-muted-foreground" /><p className="text-sm font-medium">Anti-Cheat Logs</p></Link>
          </div>
        </main>
      </div>
    </div>
  );
}

function AlertTriangleIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
}
