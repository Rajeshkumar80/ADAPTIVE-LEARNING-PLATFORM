'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart, MiniSparkline } from '@/components/charts';
import {
  Clock,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Filter,
  ArrowUpRight,
  Search,
} from 'lucide-react';

export default function DashboardPage() {
  const [filter, setFilter] = useState('all');

  const stats = [
    {
      icon: Clock,
      label: 'Total Study Hours',
      value: '245.5',
      change: '+12.5%',
      trend: 'up',
      description: 'Hours logged for the last 6 months',
      sparkline: [200, 210, 220, 215, 230, 240, 245],
    },
    {
      icon: GraduationCap,
      label: 'Tests Taken',
      value: '1,234',
      change: '-20%',
      trend: 'down',
      description: 'Performance needs attention',
      sparkline: [1500, 1450, 1400, 1380, 1350, 1280, 1234],
    },
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: '45,678',
      change: '+12.5%',
      trend: 'up',
      description: 'Engagement exceeds targets',
      sparkline: [40000, 41000, 42000, 43000, 44000, 45000, 45678],
    },
    {
      icon: TrendingUp,
      label: 'Growth Rate',
      value: '4.5%',
      change: '+4.5%',
      trend: 'up',
      description: 'Meets growth projections',
      sparkline: [3.5, 3.7, 3.9, 4.0, 4.2, 4.4, 4.5],
    },
  ];

  const students = [
    { id: 'ST-1842', name: 'Rajesh Kumar', plan: 'Pro Plus', billing: 'Annual', status: 'Active', signup: 'Jan 15, 2026' },
    { id: 'ST-1841', name: 'Priya Sharma', plan: 'Pro', billing: 'Monthly', status: 'Active', signup: 'Jan 14, 2026' },
    { id: 'ST-1840', name: 'Amit Patel', plan: 'Basic', billing: 'Monthly', status: 'Pending', signup: 'Jan 13, 2026' },
    { id: 'ST-1839', name: 'Sneha Reddy', plan: 'Pro Plus', billing: 'Annual', status: 'Active', signup: 'Jan 12, 2026' },
    { id: 'ST-1838', name: 'Karthik Rao', plan: 'Pro', billing: 'Monthly', status: 'Inactive', signup: 'Jan 11, 2026' },
    { id: 'ST-1837', name: 'Anjali Mehta', plan: 'Pro Plus', billing: 'Annual', status: 'Active', signup: 'Jan 10, 2026' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{stat.label}</span>
                      </div>
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
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Activity Chart */}
          <Card className="border shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Student Activity</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    Student activity for the last 3 months
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="text-xs border rounded-md px-2 py-1.5 bg-white">
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>1 year</option>
                  </select>
                  <select className="text-xs border rounded-md px-2 py-1.5 bg-white">
                    <option>All segments</option>
                    <option>Active</option>
                    <option>New</option>
                  </select>
                  <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
                    View report
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                  <span className="text-xs text-gray-600">Active Accounts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-xs text-gray-600">New Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span className="text-xs text-gray-600">Returning Users</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card className="border shadow-none">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">18,426 Students</CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    Recent student records with plan, billing, status, and signup activity
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
                    placeholder="Search students..."
                    className="w-full pl-9 pr-3 py-1.5 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Status
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Joined date
                </Button>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm">Billing</Button>
                  <Button variant="outline" size="sm">Sort</Button>
                </div>
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
                    <th className="text-left p-3 font-medium">Student</th>
                    <th className="text-left p-3 font-medium">Plan</th>
                    <th className="text-left p-3 font-medium">Billing</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Signup Date</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b last:border-0 hover:bg-gray-50 text-sm">
                      <td className="p-3">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-3 text-gray-600 font-mono text-xs">{student.id}</td>
                      <td className="p-3 font-medium">{student.name}</td>
                      <td className="p-3 text-gray-600">{student.plan}</td>
                      <td className="p-3 text-gray-600">{student.billing}</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            student.status === 'Active' ? 'border-green-200 bg-green-50 text-green-700' :
                            student.status === 'Pending' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                            'border-gray-200 bg-gray-50 text-gray-700'
                          }
                        >
                          {student.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">{student.signup}</td>
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
