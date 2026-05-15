'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart, AssignmentStatusChart } from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  FileText,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Students', value: '1,247', change: '+23', trend: 'up', sub: 'Across all batches', icon: Users, color: 'red' },
    { label: 'Active Tests', value: '23', change: '+4', trend: 'up', sub: 'Currently running', icon: GraduationCap, color: 'orange' },
    { label: 'Anti-Cheat Flags', value: '8', change: '-12%', trend: 'down', sub: 'Last 7 days', icon: ShieldCheck, color: 'yellow' },
    { label: 'Avg Performance', value: '78.5%', change: '+3.2%', trend: 'up', sub: 'Class average', icon: TrendingUp, color: 'green' },
  ];

  const recentStudents = [
    { id: '1MS21CS001', name: 'Rajesh Kumar', section: 'A', cgpa: 8.5, lastActive: '2 mins ago', status: 'online' },
    { id: '1MS21CS002', name: 'Priya Sharma', section: 'A', cgpa: 9.2, lastActive: '15 mins ago', status: 'online' },
    { id: '1MS21CS003', name: 'Amit Patel', section: 'B', cgpa: 7.8, lastActive: '1 hour ago', status: 'away' },
    { id: '1MS21CS004', name: 'Sneha Reddy', section: 'A', cgpa: 8.9, lastActive: '3 hours ago', status: 'offline' },
    { id: '1MS21CS005', name: 'Karthik Rao', section: 'B', cgpa: 8.2, lastActive: '1 day ago', status: 'offline' },
  ];

  const activeTests = [
    { id: 'T001', title: 'DSA Mid-Term', students: 156, completed: 89, flags: 3, status: 'live' },
    { id: 'T002', title: 'DBMS Quiz 3', students: 142, completed: 142, flags: 1, status: 'completed' },
    { id: 'T003', title: 'OS Assignment', students: 134, completed: 98, flags: 0, status: 'live' },
    { id: 'T004', title: 'CN Lab Test', students: 128, completed: 45, flags: 2, status: 'live' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Tab switching detected in DSA Test', user: 'Student #1MS21CS045', time: '5 min ago' },
    { id: 2, type: 'info', message: '15 new test submissions received', user: 'OS Mid-Term', time: '20 min ago' },
    { id: 3, type: 'critical', message: 'Multiple violation flags raised', user: 'Student #1MS21CS089', time: '1 hour ago' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Banner */}
          <Card className="border shadow-none bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Welcome back,</p>
                  <h2 className="text-2xl font-bold mb-2">{user.full_name} 👋</h2>
                  <p className="text-sm opacity-90 mb-4">
                    {user.department} • {user.employee_id}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/admin/tests/create">
                      <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100">
                        <Plus className="w-3 h-3 mr-1" />
                        Create Test
                      </Button>
                    </Link>
                    <Link href="/admin/reports">
                      <Button size="sm" variant="outline" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20">
                        <FileText className="w-3 h-3 mr-1" />
                        Export Report
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-16 h-16" />
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/10 rounded-full"></div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border shadow-none bg-white">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        stat.color === 'red' ? 'bg-red-50 text-red-600' :
                        stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                        stat.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${
                        stat.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                      }`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xs text-gray-500">{stat.sub}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border shadow-none bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Student Activity</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">Platform usage over the last 3 months</p>
                  </div>
                  <select className="text-xs border rounded-md px-2 py-1.5 bg-white">
                    <option>3 months</option>
                    <option>6 months</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <ActivityChart />
              </CardContent>
            </Card>

            <Card className="border shadow-none bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Assignment Status</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">Class submissions overview</p>
                  </div>
                  <Link href="/admin/reports">
                    <button className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1">
                      View <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <AssignmentStatusChart />
              </CardContent>
            </Card>
          </div>

          {/* Active Tests + Anti-Cheat */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border shadow-none bg-white">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Activity className="w-4 h-4 text-red-500" />
                      Active Tests
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">Real-time monitoring of running assessments</p>
                  </div>
                  <Link href="/admin/tests">
                    <Button size="sm" variant="outline">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left p-3 text-xs font-medium">ID</th>
                      <th className="text-left p-3 text-xs font-medium">Title</th>
                      <th className="text-left p-3 text-xs font-medium">Progress</th>
                      <th className="text-left p-3 text-xs font-medium">Flags</th>
                      <th className="text-left p-3 text-xs font-medium">Status</th>
                      <th className="text-left p-3 text-xs font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTests.map((test) => (
                      <tr key={test.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-gray-500 font-mono text-xs">{test.id}</td>
                        <td className="p-3 font-medium">{test.title}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 rounded-full"
                                style={{ width: `${(test.completed / test.students) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{test.completed}/{test.students}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {test.flags > 0 ? (
                            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {test.flags}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Clean
                            </Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={
                              test.status === 'live'
                                ? 'border-blue-200 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-gray-50 text-gray-600'
                            }
                          >
                            {test.status === 'live' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>}
                            {test.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <button className="text-gray-400 hover:text-gray-700">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="border shadow-none bg-white">
              <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  Anti-Cheat Alerts
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">Real-time security monitoring</p>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        alert.type === 'critical' ? 'bg-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.user}</p>
                        <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-3">
                  <Link href="/admin/anti-cheat">
                    <button className="text-xs text-gray-600 hover:text-gray-900 w-full text-center">
                      View All Alerts →
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Students */}
          <Card className="border shadow-none bg-white">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <CardTitle className="text-base font-semibold">Students Overview</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">Recent student activity and performance</p>
                </div>
                <Link href="/admin/students">
                  <Button size="sm" variant="outline">View All</Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-9 pr-3 py-1.5 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <Button size="sm" variant="outline">
                  <Filter className="w-3 h-3 mr-1" />
                  Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium">USN</th>
                    <th className="text-left p-3 text-xs font-medium">Name</th>
                    <th className="text-left p-3 text-xs font-medium">Section</th>
                    <th className="text-left p-3 text-xs font-medium">CGPA</th>
                    <th className="text-left p-3 text-xs font-medium">Status</th>
                    <th className="text-left p-3 text-xs font-medium">Last Active</th>
                    <th className="text-left p-3 text-xs font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-500 font-mono text-xs">{student.id}</td>
                      <td className="p-3 font-medium">{student.name}</td>
                      <td className="p-3 text-gray-600">{student.section}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={
                          student.cgpa >= 9 ? 'border-green-200 bg-green-50 text-green-700' :
                          student.cgpa >= 8 ? 'border-blue-200 bg-blue-50 text-blue-700' :
                          'border-yellow-200 bg-yellow-50 text-yellow-700'
                        }>
                          {student.cgpa}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            student.status === 'online' ? 'bg-green-500' :
                            student.status === 'away' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}></div>
                          <span className="text-xs capitalize text-gray-600">{student.status}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-gray-500">{student.lastActive}</td>
                      <td className="p-3">
                        <button className="text-gray-400 hover:text-gray-700">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
