'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityChart, PerformanceChart, TestTrendsChart, SubjectDistribution } from '@/components/charts';

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Detailed insights into your learning journey
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Hours', value: '245' },
              { label: 'Best Score', value: '98%' },
              { label: 'Goals', value: '23/30' },
              { label: 'Streak', value: '7d' },
              { label: 'Focus', value: '92%' },
              { label: 'Growth', value: '+12%' },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="p-4">
                  <p className="text-[11px] text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-xl font-semibold tracking-tight">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Study Activity</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Daily engagement over time</p>
              </CardHeader>
              <CardContent>
                <ActivityChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Subject Performance</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Average scores by subject</p>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Test Trends</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">6-month progression</p>
              </CardHeader>
              <CardContent>
                <TestTrendsChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Time Distribution</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Hours per subject</p>
              </CardHeader>
              <CardContent>
                <SubjectDistribution />
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>AI Insights</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Personalized recommendations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 border border-border rounded-md">
                  <Badge variant="outline" className="mb-2 text-[10px] border-green-200 bg-green-50 text-green-700">Strength</Badge>
                  <p className="text-sm">You excel at Data Structures with consistent 90%+ scores.</p>
                </div>
                <div className="p-4 border border-border rounded-md">
                  <Badge variant="outline" className="mb-2 text-[10px] border-amber-200 bg-amber-50 text-amber-700">Focus area</Badge>
                  <p className="text-sm">Operating Systems needs attention. Try 30 min daily review.</p>
                </div>
                <div className="p-4 border border-border rounded-md">
                  <Badge variant="outline" className="mb-2 text-[10px] border-blue-200 bg-blue-50 text-blue-700">Tip</Badge>
                  <p className="text-sm">Your focus is highest 9–11 AM. Schedule complex topics then.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
