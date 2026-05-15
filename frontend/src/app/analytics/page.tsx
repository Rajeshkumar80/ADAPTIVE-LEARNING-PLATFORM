'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  StudyHoursChart,
  PerformanceChart,
  TestTrendsChart,
  SubjectDistribution,
  ProgressRadial,
} from '@/components/charts';
import { TrendingUp, Award, Target, Zap, Brain, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Analytics" description="Detailed insights into your learning journey" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { icon: Clock, label: 'Total Hours', value: '245', change: '+15%', color: 'blue' },
              { icon: Award, label: 'Best Score', value: '98%', change: 'DSA Quiz', color: 'yellow' },
              { icon: Target, label: 'Goals Hit', value: '23/30', change: '76%', color: 'green' },
              { icon: Zap, label: 'Streak', value: '7 days', change: '🔥', color: 'red' },
              { icon: Brain, label: 'Focus Score', value: '92%', change: '+8%', color: 'purple' },
              { icon: TrendingUp, label: 'Improvement', value: '+12%', change: 'this month', color: 'indigo' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className={`w-8 h-8 rounded-lg bg-${stat.color}-50 flex items-center justify-center mb-2`}>
                      <Icon className={`w-4 h-4 text-${stat.color}-600`} />
                    </div>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Time Analysis</CardTitle>
                <CardDescription>Daily study hours pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <StudyHoursChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Your scores vs class average</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Trends</CardTitle>
                <CardDescription>Tests & scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TestTrendsChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Time spent per subject</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectDistribution />
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">Strength</Badge>
                  <p className="text-sm text-gray-700">You excel at Data Structures with consistent 90%+ scores.</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Badge className="bg-yellow-100 text-yellow-800 mb-2">Focus Area</Badge>
                  <p className="text-sm text-gray-700">Operating Systems needs more attention. Consider 30 min daily review.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <Badge className="bg-green-100 text-green-800 mb-2">Tip</Badge>
                  <p className="text-sm text-gray-700">Your focus is highest 9-11 AM. Schedule complex topics during this time.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
