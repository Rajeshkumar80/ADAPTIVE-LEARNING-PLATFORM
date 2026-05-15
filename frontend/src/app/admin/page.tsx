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
  MiniSparkline,
} from '@/components/charts';
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Activity,
  DollarSign,
  Target,
  Award,
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Students',
      value: '1,247',
      change: '+23 new',
      trend: 'up',
      icon: Users,
      color: 'blue',
      sparkline: [1100, 1150, 1180, 1200, 1220, 1240, 1247],
    },
    {
      title: 'Active Tests',
      value: '23',
      change: '+4 today',
      trend: 'up',
      icon: GraduationCap,
      color: 'green',
      sparkline: [15, 17, 19, 20, 21, 22, 23],
    },
    {
      title: 'Total Subjects',
      value: '15',
      change: '3 semesters',
      trend: 'up',
      icon: BookOpen,
      color: 'purple',
      sparkline: [12, 13, 13, 14, 14, 15, 15],
    },
    {
      title: 'Avg Performance',
      value: '78.5%',
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      color: 'orange',
      sparkline: [72, 74, 75, 76, 77, 78, 78.5],
    },
  ];

  const recentStudents = [
    { id: 1, name: 'Rajesh Kumar', usn: '1MS21CS001', semester: 5, cgpa: 8.5, avatar: 'RK' },
    { id: 2, name: 'Priya Sharma', usn: '1MS21CS002', semester: 5, cgpa: 9.2, avatar: 'PS' },
    { id: 3, name: 'Amit Patel', usn: '1MS21CS003', semester: 5, cgpa: 7.8, avatar: 'AP' },
    { id: 4, name: 'Sneha Reddy', usn: '1MS21CS004', semester: 5, cgpa: 8.9, avatar: 'SR' },
    { id: 5, name: 'Karthik Rao', usn: '1MS21CS005', semester: 5, cgpa: 8.2, avatar: 'KR' },
  ];

  const activeTests = [
    { id: 1, title: 'Data Structures Mid-Term', subject: 'DSA', students: 156, completed: 89, avgScore: 82, status: 'active' },
    { id: 2, title: 'DBMS Quiz 3', subject: 'DBMS', students: 142, completed: 142, avgScore: 76, status: 'completed' },
    { id: 3, title: 'OS Assignment 2', subject: 'OS', students: 134, completed: 98, avgScore: 85, status: 'active' },
    { id: 4, title: 'CN Lab Test', subject: 'CN', students: 128, completed: 45, avgScore: 79, status: 'active' },
  ];

  const recentActivity = [
    { id: 1, action: 'New test created', user: 'Prof. Sharma', time: '10 mins ago', type: 'test', icon: GraduationCap, color: 'blue' },
    { id: 2, action: 'Student registered', user: 'Rajesh Kumar', time: '25 mins ago', type: 'student', icon: Users, color: 'green' },
    { id: 3, action: 'Grades published', user: 'Prof. Patel', time: '1 hour ago', type: 'grade', icon: Award, color: 'purple' },
    { id: 4, action: 'Anti-cheat flag raised', user: 'System', time: '2 hours ago', type: 'alert', icon: AlertCircle, color: 'red' },
    { id: 5, action: 'New subject added', user: 'Admin', time: '3 hours ago', type: 'subject', icon: BookOpen, color: 'yellow' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isAdmin />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Admin Dashboard"
          description="Manage your platform, students, and content"
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Test
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Add Student
            </Button>
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
            <Button variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>

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
                      <Badge variant="success">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className="mt-4 h-10">
                      <MiniSparkline 
                        data={stat.sparkline} 
                        color={
                          stat.color === 'blue' ? '#3b82f6' :
                          stat.color === 'green' ? '#10b981' :
                          stat.color === 'purple' ? '#a855f7' : '#f97316'
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Platform Activity</CardTitle>
                    <CardDescription>Daily active users this week</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">This Week</Button>
                </div>
              </CardHeader>
              <CardContent>
                <StudyHoursChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Average scores by subject</CardDescription>
                  </div>
                  <Badge variant="success">Improving</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>
          </div>

          {/* Test Trends & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Test Trends</CardTitle>
                    <CardDescription>Tests conducted & average scores</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">6 Months</Button>
                </div>
              </CardHeader>
              <CardContent>
                <TestTrendsChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Distribution</CardTitle>
                <CardDescription>Students per subject</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectDistribution />
              </CardContent>
            </Card>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Students */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Students</CardTitle>
                    <CardDescription>Newly registered students</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {student.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.usn} • Sem {student.semester}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{student.cgpa}</p>
                        <p className="text-xs text-gray-500">CGPA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Tests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Tests</CardTitle>
                    <CardDescription>Currently running assessments</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeTests.map((test) => (
                    <div key={test.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">{test.title}</p>
                          <p className="text-xs text-gray-500">{test.subject}</p>
                        </div>
                        <Badge variant={test.status === 'active' ? 'default' : 'success'}>
                          {test.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{test.completed}/{test.students} completed</span>
                        <span className="font-semibold text-indigo-600">{test.avgScore}% avg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${(test.completed / test.students) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform events</CardDescription>
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
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
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
