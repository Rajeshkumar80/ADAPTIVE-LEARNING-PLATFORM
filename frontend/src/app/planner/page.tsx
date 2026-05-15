'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StudyHoursChart } from '@/components/charts';
import { Calendar, Clock, Plus, Target, Sparkles, Brain } from 'lucide-react';

export default function PlannerPage() {
  const todaySchedule = [
    { id: 1, time: '09:00 AM', duration: 90, subject: 'Data Structures', topic: 'Trees & Graphs', type: 'study', status: 'completed' },
    { id: 2, time: '11:00 AM', duration: 60, subject: 'DBMS', topic: 'Normalization', type: 'study', status: 'in-progress' },
    { id: 3, time: '02:00 PM', duration: 30, subject: 'Operating Systems', topic: 'Quick Quiz', type: 'test', status: 'pending' },
    { id: 4, time: '03:30 PM', duration: 90, subject: 'Computer Networks', topic: 'TCP/IP Lab', type: 'practical', status: 'pending' },
    { id: 5, time: '06:00 PM', duration: 45, subject: 'Software Engineering', topic: 'Review Session', type: 'review', status: 'pending' },
  ];

  const weeklyGoals = [
    { id: 1, title: 'Complete DSA Module 5', progress: 75, deadline: 'May 18' },
    { id: 2, title: 'Practice 50 Coding Problems', progress: 60, deadline: 'May 20' },
    { id: 3, title: 'Read OS Chapter 6-8', progress: 40, deadline: 'May 19' },
    { id: 4, title: 'Submit SE Project', progress: 90, deadline: 'May 22' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Study Planner" description="AI-powered study schedule and goal tracking" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">AI Recommendation</h3>
                  <p className="text-gray-700 mb-3">
                    Based on your performance patterns, I recommend focusing on <strong>Operating Systems</strong> tomorrow morning. Your retention rate is 23% higher in morning sessions. Also, consider taking a 15-min break after every 90 minutes of study.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Apply Suggestions</Button>
                    <Button variant="outline" size="sm">Learn More</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <Clock className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-3xl font-bold">5.5h</p>
                <p className="text-sm text-gray-600">Today's plan</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Target className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-3xl font-bold">85%</p>
                <p className="text-sm text-gray-600">Goal completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Calendar className="w-5 h-5 text-purple-600 mb-2" />
                <p className="text-3xl font-bold">38h</p>
                <p className="text-sm text-gray-600">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Brain className="w-5 h-5 text-orange-600 mb-2" />
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm text-gray-600">Focus score</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Friday, May 15, 2026</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaySchedule.map((session) => (
                    <div key={session.id} className="flex items-start gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-20 text-center shrink-0">
                        <p className="text-sm font-semibold">{session.time}</p>
                        <p className="text-xs text-gray-500">{session.duration}m</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="font-medium">{session.topic}</p>
                            <p className="text-sm text-gray-600">{session.subject}</p>
                          </div>
                          <Badge
                            variant={
                              session.status === 'completed' ? 'success' :
                              session.status === 'in-progress' ? 'warning' : 'outline'
                            }
                          >
                            {session.status}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-xs">{session.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Goals</CardTitle>
                <CardDescription>Track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyGoals.map((goal) => (
                    <div key={goal.id}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{goal.title}</p>
                        <span className="text-xs text-gray-500">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">Due {goal.deadline}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Study Hours Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Study Hours</CardTitle>
              <CardDescription>Your study time distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyHoursChart />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
