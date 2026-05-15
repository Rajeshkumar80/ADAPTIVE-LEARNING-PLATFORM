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
  MiniSparkline,
} from '@/components/charts';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  Trophy,
  Flame,
  Target,
  Brain,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Code2,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Study Hours',
      value: '45.5',
      unit: 'hrs',
      change: '+12.5%',
      trend: 'up',
      icon: Clock,
      color: 'blue',
      sparkline: [4, 5, 3, 6, 5, 7, 4],
    },
    {
      title: 'Tests Completed',
      value: '12',
      unit: '',
      change: '+3',
      trend: 'up',
      icon: CheckCircle2,
      color: 'green',
      sparkline: [2, 3, 5, 7, 9, 11, 12],
    },
    {
      title: 'Average Score',
      value: '85.5',
      unit: '%',
      change: '+5.2%',
      trend: 'up',
      icon: Trophy,
      color: 'yellow',
      sparkline: [70, 72, 75, 78, 82, 84, 85],
    },
    {
      title: 'Current Streak',
      value: '7',
      unit: 'days',
      change: '🔥',
      trend: 'up',
      icon: Flame,
      color: 'red',
      sparkline: [1, 2, 3, 4, 5, 6, 7],
    },
  ];

  const upcomingTests = [
    { id: 1, subject: 'Operating Systems', title: 'Process Scheduling', date: 'May 18', time: '10:00 AM', difficulty: 'Medium' },
    { id: 2, subject: 'Computer Networks', title: 'TCP/IP Protocol', date: 'May 20', time: '2:00 PM', difficulty: 'Hard' },
    { id: 3, subject: 'Software Engineering', title: 'SDLC Models', date: 'May 22', time: '11:00 AM', difficulty: 'Easy' },
  ];

  const recentActivity = [
    { id: 1, type: 'test', title: 'Data Structures Quiz', score: 92, time: '2 hours ago', icon: CheckCircle2, color: 'green' },
    { id: 2, type: 'study', title: 'Algorithms Study Session', duration: '1.5 hrs', time: '5 hours ago', icon: BookOpen, color: 'blue' },
    { id: 3, type: 'journal', title: 'Binary Search Implementation', time: '1 day ago', icon: Code2, color: 'purple' },
    { id: 4, type: 'achievement', title: 'Earned "7-Day Streak" Badge', time: '1 day ago', icon: Trophy, color: 'yellow' },
    { id: 5, type: 'test', title: 'DBMS Assignment', score: 88, time: '2 days ago', icon: CheckCircle2, color: 'green' },
  ];

  const tasks = [
    { id: 1, title: 'Complete DSA Assignment 3', priority: 'high', dueDate: 'Today', completed: false },
    { id: 2, title: 'Review OS Notes - Chapter 5', priority: 'medium', dueDate: 'Tomorrow', completed: false },
    { id: 3, title: 'Practice CN Problem Set', priority: 'low', dueDate: 'May 18', completed: true },
    { id: 4, title: 'Watch SE Video Lecture', priority: 'medium', dueDate: 'May 19', completed: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          description="Welcome back, Test Student! Here's your learning overview."
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-50`}>
                        <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                      </div>
                      <Badge variant={stat.trend === 'up' ? 'success' : 'destructive'}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-3xl font-bold">{stat.value}</p>
                        {stat.unit && <span className="text-sm text-gray-500">{stat.unit}</span>}
                      </div>
                    </div>
                    <div className="mt-4 h-10">
                      <MiniSparkline 
                        data={stat.sparkline} 
                        color={
                          stat.color === 'blue' ? '#3b82f6' :
                          stat.color === 'green' ? '#10b981' :
                          stat.color === 'yellow' ? '#f59e0b' : '#ef4444'
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Study Hours Overview</CardTitle>
                    <CardDescription>Your daily study hours vs target</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    This Week
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <StudyHoursChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
                <CardDescription>Overall completion</CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressRadial />
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium">28 / 36 modules</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-medium text-orange-600">8 modules</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Performance by Subject</CardTitle>
                    <CardDescription>Your scores vs class average</CardDescription>
                  </div>
                  <Badge variant="success">Above Average</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Test Trends</CardTitle>
                    <CardDescription>Tests taken & scores over time</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    6 Months
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <TestTrendsChart />
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Tests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Tests</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTests.map((test) => (
                  <div key={test.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{test.title}</p>
                      <p className="text-xs text-gray-500">{test.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {test.date} • {test.time}
                        </Badge>
                        <Badge 
                          variant={
                            test.difficulty === 'Easy' ? 'success' :
                            test.difficulty === 'Medium' ? 'warning' : 'destructive'
                          } 
                          className="text-xs"
                        >
                          {test.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Today's Tasks</CardTitle>
                  <Badge>{tasks.filter(t => !t.completed).length} pending</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">{task.dueDate}</p>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'high' ? 'destructive' :
                        task.priority === 'medium' ? 'warning' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Subject Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
                <CardDescription>Hours per subject this week</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectDistribution />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest learning activities</CardDescription>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${activity.color}-50 shrink-0`}>
                        <Icon className={`w-5 h-5 text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        {activity.score && (
                          <Badge variant="success">{activity.score}%</Badge>
                        )}
                        {activity.duration && (
                          <span className="text-sm text-gray-600">{activity.duration}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
