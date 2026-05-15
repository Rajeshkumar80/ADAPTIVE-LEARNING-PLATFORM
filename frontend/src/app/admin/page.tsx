'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart, AssignmentStatusChart } from '@/components/charts';
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Search,
  Filter,
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Students', value: '1,247', change: '+12.5%', trend: 'up', sub: 'Across all programs' },
    { label: 'Active Tests', value: '23', change: '+8.3%', trend: 'up', sub: 'Currently running' },
    { label: 'Total Subjects', value: '45,678', change: '+12.5%', trend: 'up', sub: 'Course catalog' },
    { label: 'Avg Performance', value: '78.5%', change: '+4.5%', trend: 'up', sub: 'This semester' },
  ];

  const tests = [
    { id: 'OP-1842', name: 'Data Structures Mid-Term', stage: 'Active', priority: 1, health: 92, value: '156 students' },
    { id: 'OP-1841', name: 'DBMS Quiz 3', stage: 'Completed', priority: 1, health: 76, value: '142 students' },
    { id: 'OP-1840', name: 'OS Assignment 2', stage: 'Active', priority: 1, health: 85, value: '134 students' },
    { id: 'OP-1839', name: 'CN Lab Test', stage: 'Active', priority: 1, health: 79, value: '128 students' },
    { id: 'OP-1838', name: 'SE Project Review', stage: 'Pending', priority: 2, health: 65, value: '145 students' },
    { id: 'OP-1837', name: 'AI Workshop', stage: 'Active', priority: 1, health: 88, value: '98 students' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar isAdmin />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                  </div>
                  <div className="flex items-end justify-between mb-1">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <div className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${
                      stat.trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border shadow-none">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Platform Activity</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">User activity for the last 3 months</p>
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

            <Card className="border shadow-none">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Assignment Status</CardTitle>
                  <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
                    View
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <AssignmentStatusChart />
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Meetings & Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border shadow-none">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Upcoming Reviews</CardTitle>
                  <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
                    View Calendar
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2 mb-4 text-xs text-gray-500 flex justify-between">
                  <span>08:45</span>
                  <span>09:00</span>
                  <span>10:00</span>
                  <span>10:20</span>
                </div>
                <div className="bg-black text-white rounded-md p-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">Faculty Meeting - Term Review</p>
                    <p className="text-xs text-gray-400">Conference Room A</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-none">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-semibold">Monthly Goal Progress</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-end gap-2 mb-2">
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-sm text-gray-500 mb-1">tests created</p>
                  <p className="ml-auto text-sm font-medium">18 target</p>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-8 rounded-sm ${i < 33 ? 'bg-gray-900' : 'bg-gray-200'}`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">67% of this month's goal reached.</p>
              </CardContent>
            </Card>
          </div>

          {/* Tests Table */}
          <Card className="border shadow-none">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Active Tests & Assessments</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    Track running assessments through their lifecycle
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tests..."
                    className="w-full pl-9 pr-3 py-1.5 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Stage
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Health
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs text-gray-500">
                    <th className="text-left p-3 font-medium">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-left p-3 font-medium">ID</th>
                    <th className="text-left p-3 font-medium">Test Name</th>
                    <th className="text-left p-3 font-medium">Stage</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                    <th className="text-left p-3 font-medium">Health</th>
                    <th className="text-left p-3 font-medium">Participants</th>
                    <th className="text-left p-3 font-medium">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test.id} className="border-b last:border-0 hover:bg-gray-50 text-sm">
                      <td className="p-3">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-3 text-gray-600 font-mono text-xs">{test.id}</td>
                      <td className="p-3 font-medium">{test.name}</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            test.stage === 'Active' ? 'border-green-200 bg-green-50 text-green-700' :
                            test.stage === 'Completed' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                            'border-yellow-200 bg-yellow-50 text-yellow-700'
                          }
                        >
                          {test.stage}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">{test.priority}</td>
                      <td className="p-3">
                        <div className="flex gap-0.5 items-center">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-4 rounded-sm ${
                                i < test.health / 5 
                                  ? test.health >= 80 ? 'bg-green-500' : test.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  : 'bg-gray-200'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{test.value}</td>
                      <td className="p-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          ✎
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
