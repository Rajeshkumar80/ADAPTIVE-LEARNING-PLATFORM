'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityChart, PerformanceChart, TestTrendsChart, SubjectDistribution } from '@/components/charts';
import { Users, GraduationCap, TrendingUp, Award } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin title="Class Analytics" subtitle="Detailed performance insights" />
        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Total Students', value: '1,247', change: '+12%' },
              { icon: GraduationCap, label: 'Tests Conducted', value: '142', change: '+8%' },
              { icon: TrendingUp, label: 'Avg Performance', value: '78.5%', change: '+3.2%' },
              { icon: Award, label: 'Top Performers', value: '89', change: '+15' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Card key={i} className="border shadow-none bg-white">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold mb-1">{s.value}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">{s.label}</p>
                      <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{s.change}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border shadow-none bg-white">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Platform Activity</CardTitle>
                <p className="text-xs text-gray-500">Student engagement over time</p>
              </CardHeader>
              <CardContent>
                <ActivityChart />
              </CardContent>
            </Card>

            <Card className="border shadow-none bg-white">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Subject Performance</CardTitle>
                <p className="text-xs text-gray-500">Average scores by subject</p>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            <Card className="border shadow-none bg-white">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Test Trends</CardTitle>
                <p className="text-xs text-gray-500">Tests conducted over months</p>
              </CardHeader>
              <CardContent>
                <TestTrendsChart />
              </CardContent>
            </Card>

            <Card className="border shadow-none bg-white">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Subject Distribution</CardTitle>
                <p className="text-xs text-gray-500">Students per subject</p>
              </CardHeader>
              <CardContent>
                <SubjectDistribution />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
