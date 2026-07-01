'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Users, GraduationCap, Target, AlertTriangle, Loader2 } from 'lucide-react';

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminSubjects().then(setSubjects).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex min-h-screen bg-background"><Sidebar isAdmin /><div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div></div>;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Subjects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{subjects.length} subjects across all semesters</p>
          </div>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Code</th>
                    <th className="text-left px-6 py-3 font-medium">Subject</th>
                    <th className="text-left px-6 py-3 font-medium">Semester</th>
                    <th className="text-left px-6 py-3 font-medium">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s: any) => (
                    <tr key={s.id} className="border-b last:border-0 border-border hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{s.code}</td>
                      <td className="px-6 py-3 font-medium">{s.name}</td>
                      <td className="px-6 py-3 text-muted-foreground">Sem {s.semester}</td>
                      <td className="px-6 py-3 text-muted-foreground">{s.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
