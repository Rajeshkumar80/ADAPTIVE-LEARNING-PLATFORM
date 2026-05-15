'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, Users, GraduationCap, BarChart3 } from 'lucide-react';

export default function AdminReportsPage() {
  const reports = [
    { title: 'Student Performance Report', description: 'Overall class performance metrics', icon: BarChart3 },
    { title: 'Attendance Summary', description: 'Monthly attendance breakdown', icon: Calendar },
    { title: 'Test Analytics', description: 'Test scores and pass rates', icon: GraduationCap },
    { title: 'Student Engagement', description: 'Activity and engagement metrics', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Generate and download class reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((r, i) => {
              const Icon = r.icon;
              return (
                <Card key={i} className="hover:border-foreground transition-colors">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold mb-0.5">{r.title}</h3>
                      <p className="text-xs text-muted-foreground">{r.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <FileText className="w-3.5 h-3.5" />
                        View
                      </Button>
                      <Button size="sm">
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
