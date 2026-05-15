'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityChart, PerformanceChart, TestTrendsChart, SubjectDistribution } from '@/components/charts';

export default function AdminAnalyticsPage() {
  const stats = [
    { label: 'Students', value: '1,247', change: '+12%' },
    { label: 'Tests', value: '142', change: '+8%' },
    { label: 'Avg Score', value: '78.5%', change: '+3.2%' },
    { label: 'Top performers', value: '89', change: '+15' },
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
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-2xl font-semibold tracking-tight mb-1">{s.value}</p>
                  <span className="text-[11px] text-green-600 font-medium">{s.change}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Platform Activity</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Student engagement over time</p>
              </CardHeader>
              <CardContent><ActivityChart /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Subject Performance</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Average scores by subject</p>
              </CardHeader>
              <CardContent><PerformanceChart /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Test Trends</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Tests over months</p>
              </CardHeader>
              <CardContent><TestTrendsChart /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Subject Distribution</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Students per subject</p>
              </CardHeader>
              <CardContent><SubjectDistribution /></CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
