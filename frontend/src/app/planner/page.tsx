'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart } from '@/components/charts';
import { Calendar, Clock, Plus, Sparkles, ArrowUpRight } from 'lucide-react';

export default function PlannerPage() {
  const schedule = [
    { id: 1, time: '09:00', subject: 'Data Structures', topic: 'Trees & Graphs', duration: 90, status: 'completed' },
    { id: 2, time: '11:00', subject: 'DBMS', topic: 'Normalization', duration: 60, status: 'in-progress' },
    { id: 3, time: '14:00', subject: 'Operating Systems', topic: 'Quick Quiz', duration: 30, status: 'pending' },
    { id: 4, time: '15:30', subject: 'Computer Networks', topic: 'TCP/IP Lab', duration: 90, status: 'pending' },
    { id: 5, time: '18:00', subject: 'Software Engineering', topic: 'Review', duration: 45, status: 'pending' },
  ];

  const goals = [
    { id: 1, title: 'Complete DSA Module 5', progress: 75, deadline: 'May 18' },
    { id: 2, title: 'Practice 50 Coding Problems', progress: 60, deadline: 'May 20' },
    { id: 3, title: 'Read OS Chapters 6-8', progress: 40, deadline: 'May 19' },
    { id: 4, title: 'Submit SE Project', progress: 90, deadline: 'May 22' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          {/* AI Insights */}
          <Card className="border shadow-none bg-gray-50">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">AI Recommendation</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Based on your patterns, focus on Operating Systems tomorrow morning. Your retention is 23% higher in morning sessions.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-black hover:bg-gray-800">Apply</Button>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Clock className="w-4 h-4 text-gray-500 mb-2" />
                <p className="text-2xl font-semibold">5.5h</p>
                <p className="text-xs text-gray-500">Today's plan</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Calendar className="w-4 h-4 text-gray-500 mb-2" />
                <p className="text-2xl font-semibold">38h</p>
                <p className="text-xs text-gray-500">This week</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Sparkles className="w-4 h-4 text-gray-500 mb-2" />
                <p className="text-2xl font-semibold">85%</p>
                <p className="text-xs text-gray-500">Goal completion</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Sparkles className="w-4 h-4 text-gray-500 mb-2" />
                <p className="text-2xl font-semibold">92%</p>
                <p className="text-xs text-gray-500">Focus score</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Today's Schedule */}
            <Card className="lg:col-span-2 border shadow-none">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Today's Schedule</CardTitle>
                    <p className="text-xs text-gray-500">Friday, May 15, 2026</p>
                  </div>
                  <Button size="sm" className="bg-black hover:bg-gray-800">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {schedule.map((s) => (
                  <div key={s.id} className={`flex items-center p-3 border-b last:border-0 hover:bg-gray-50 border-l-4 ${
                    s.status === 'completed' ? 'border-l-green-500' :
                    s.status === 'in-progress' ? 'border-l-yellow-500' :
                    'border-l-gray-200'
                  }`}>
                    <div className="w-16 text-center">
                      <p className="text-sm font-medium">{s.time}</p>
                      <p className="text-xs text-gray-500">{s.duration}m</p>
                    </div>
                    <div className="flex-1 ml-4">
                      <p className="text-sm font-medium">{s.topic}</p>
                      <p className="text-xs text-gray-500">{s.subject}</p>
                    </div>
                    <Badge variant="outline" className={`text-xs ${
                      s.status === 'completed' ? 'border-green-200 bg-green-50 text-green-700' :
                      s.status === 'in-progress' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                      ''
                    }`}>
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Goals */}
            <Card className="border shadow-none">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Weekly Goals</CardTitle>
                  <button className="text-xs hover:text-gray-700 flex items-center gap-1">
                    All
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {goals.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{g.title}</p>
                      <span className="text-xs text-gray-500">{g.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                      <div className="bg-black h-1.5 rounded-full" style={{ width: `${g.progress}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-500">Due {g.deadline}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart */}
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Weekly Activity</CardTitle>
              <p className="text-xs text-gray-500">Your study time distribution</p>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
