'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart, AssignmentStatusChart, MiniSparkline } from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Plus,
  Eye,
  AlertTriangle,
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Students', value: '1,247', change: '+23', trend: 'up', sparkline: [1100, 1150, 1180, 1200, 1220, 1240, 1247] },
    { label: 'Active Tests', value: '23', change: '+4', trend: 'up', sparkline: [15, 17, 19, 20, 21, 22, 23] },
    { label: 'Anti-Cheat Flags', value: '8', change: '-12%', trend: 'down', sparkline: [12, 11, 10, 9, 9, 8, 8] },
    { label: 'Avg Performance', value: '78.5%', change: '+3.2%', trend: 'up', sparkline: [72, 74, 75, 76, 77, 78, 78.5] },
  ];

  const students = [
    { id: '1MS21CS001', name: 'Rajesh Kumar', section: 'A', cgpa: 8.5, status: 'online' },
    { id: '1MS21CS002', name: 'Priya Sharma', section: 'A', cgpa: 9.2, status: 'online' },
    { id: '1MS21CS003', name: 'Amit Patel', section: 'B', cgpa: 7.8, status: 'away' },
    { id: '1MS21CS004', name: 'Sneha Reddy', section: 'A', cgpa: 8.9, status: 'offline' },
    { id: '1MS21CS005', name: 'Karthik Rao', section: 'B', cgpa: 8.2, status: 'offline' },
  ];

  const tests = [
    { id: 'T001', title: 'DSA Mid-Term', completed: 89, total: 156, flags: 3, status: 'live' },
    { id: 'T002', title: 'DBMS Quiz 3', completed: 142, total: 142, flags: 1, status: 'completed' },
    { id: 'T003', title: 'OS Assignment', completed: 98, total: 134, flags: 0, status: 'live' },
    { id: 'T004', title: 'CN Lab Test', completed: 45, total: 128, flags: 2, status: 'live' },
  ];

  const alerts = [
    { type: 'critical', message: 'Multiple violation flags raised', user: '#1MS21CS089', time: '5m ago' },
    { type: 'warning', message: 'Tab switching detected', user: '#1MS21CS045', time: '12m ago' },
    { type: 'info', message: '15 new test submissions', user: 'OS Mid-Term', time: '20m ago' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          {/* Greeting */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Hi, {user.full_name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user.department} · {user.employee_id}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/admin/reports">
                <Button variant="outline" size="sm">Export Report</Button>
              </Link>
              <Link href="/admin/tests/create">
                <Button size="sm">
                  <Plus className="w-3.5 h-3.5" />
                  Create Test
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-2xl font-semibold tracking-tight mb-1">{stat.value}</p>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-0.5 text-[11px] font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </div>
                    <div className="w-20 h-8">
                      <MiniSparkline data={stat.sparkline} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Platform Activity</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Last 3 months</p>
                  </div>
                  <select className="h-7 text-xs border border-border rounded-md px-2 bg-background">
                    <option>3 months</option>
                    <option>6 months</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <ActivityChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Assignment Status</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">By section</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AssignmentStatusChart />
              </CardContent>
            </Card>
          </div>

          {/* Tests + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Tests</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Real-time monitoring</p>
                  </div>
                  <Link href="/admin/tests">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View all
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {tests.map((test) => (
                    <div key={test.id} className="flex items-center px-6 py-3 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-muted-foreground font-mono">{test.id}</span>
                          <span className="text-sm font-medium">{test.title}</span>
                          {test.status === 'live' && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-green-700 font-medium">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                              Live
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-xs h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-foreground"
                              style={{ width: `${(test.completed / test.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">
                            {test.completed}/{test.total}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        {test.flags > 0 ? (
                          <Badge variant="outline" className="text-[10px] border-red-200 bg-red-50 text-red-700">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            {test.flags}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] border-green-200 bg-green-50 text-green-700">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Clean
                          </Badge>
                        )}
                        <button className="p-1 text-muted-foreground hover:text-foreground rounded">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Anti-Cheat Alerts</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Last 24 hours</p>
                  </div>
                  <Link href="/admin/anti-cheat">
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      All
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {alerts.map((alert, i) => (
                    <div key={i} className="px-6 py-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          alert.type === 'critical' ? 'bg-red-500' :
                          alert.type === 'warning' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground font-mono">{alert.user}</span>
                            <span className="text-[10px] text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{alert.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Students */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Students</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Currently active</p>
                </div>
                <Link href="/admin/students">
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    View all
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center px-6 py-3 hover:bg-muted/50 transition-colors">
                    <div className={`w-1.5 h-1.5 rounded-full mr-3 ${
                      student.status === 'online' ? 'bg-green-500' :
                      student.status === 'away' ? 'bg-amber-500' :
                      'bg-muted-foreground/30'
                    }`}></div>
                    <span className="text-xs text-muted-foreground font-mono w-32">{student.id}</span>
                    <span className="text-sm font-medium flex-1">{student.name}</span>
                    <span className="text-xs text-muted-foreground w-20 text-center">Section {student.section}</span>
                    <Badge variant="outline" className="text-xs">
                      CGPA {student.cgpa}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
