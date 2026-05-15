'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ActivityChart, PerformanceChart, TestTrendsChart, SubjectDistribution } from '@/components/charts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Hours', value: '245', change: '+15%', trend: 'up' },
    { label: 'Best Score', value: '98%', change: 'DSA', trend: 'up' },
    { label: 'Goals Hit', value: '23/30', change: '76%', trend: 'up' },
    { label: 'Streak', value: '7 days', change: '+2', trend: 'up' },
    { label: 'Focus Score', value: '92%', change: '+8%', trend: 'up' },
    { label: 'Improvement', value: '+12%', change: 'this month', trend: 'up' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs text-gray-600 mb-2">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-xl font-semibold">{stat.value}</p>
                    <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Study Activity</CardTitle>
                <p className="text-xs text-gray-500">Daily activity over time</p>
              </CardHeader>
              <CardContent>
                <ActivityChart />
              </CardContent>
            </Card>

            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Performance by Subject</CardTitle>
                <p className="text-xs text-gray-500">Your scores vs class average</p>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Test Trends</CardTitle>
                <p className="text-xs text-gray-500">6-month performance</p>
              </CardHeader>
              <CardContent>
                <TestTrendsChart />
              </CardContent>
            </Card>

            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Subject Distribution</CardTitle>
                <p className="text-xs text-gray-500">Time spent per subject</p>
              </CardHeader>
              <CardContent>
                <SubjectDistribution />
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">AI Insights</CardTitle>
              <p className="text-xs text-gray-500">Personalized recommendations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <Badge variant="outline" className="mb-2 border-green-200 bg-green-50 text-green-700">Strength</Badge>
                  <p className="text-sm">You excel at Data Structures with consistent 90%+ scores.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Badge variant="outline" className="mb-2 border-yellow-200 bg-yellow-50 text-yellow-700">Focus Area</Badge>
                  <p className="text-sm">Operating Systems needs attention. Consider 30 min daily review.</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Badge variant="outline" className="mb-2 border-blue-200 bg-blue-50 text-blue-700">Tip</Badge>
                  <p className="text-sm">Your focus is highest 9-11 AM. Schedule complex topics then.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
