'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, AlertTriangle } from 'lucide-react';

export default function AdminTestsPage() {
  const tests = [
    { id: 'T001', title: 'DSA Mid-Term Exam', subject: 'Data Structures', students: 156, completed: 89, flags: 3, avgScore: 82, status: 'live', date: 'May 15, 2026' },
    { id: 'T002', title: 'DBMS Quiz 3', subject: 'DBMS', students: 142, completed: 142, flags: 1, avgScore: 76, status: 'completed', date: 'May 12, 2026' },
    { id: 'T003', title: 'OS Assignment 2', subject: 'Operating Systems', students: 134, completed: 98, flags: 0, avgScore: 85, status: 'live', date: 'May 14, 2026' },
    { id: 'T004', title: 'CN Lab Test', subject: 'Computer Networks', students: 128, completed: 45, flags: 2, avgScore: 79, status: 'live', date: 'May 16, 2026' },
    { id: 'T005', title: 'SE Project Review', subject: 'Software Engineering', students: 145, completed: 0, flags: 0, avgScore: 0, status: 'scheduled', date: 'May 22, 2026' },
    { id: 'T006', title: 'AI Workshop Quiz', subject: 'Artificial Intelligence', students: 98, completed: 98, flags: 0, avgScore: 88, status: 'completed', date: 'May 8, 2026' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin title="All Tests" subtitle="Manage all assessments and quizzes" />
        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <p className="text-xs text-gray-600 mb-1">Total Tests</p>
                <p className="text-2xl font-bold">23</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <p className="text-xs text-gray-600 mb-1">Live Now</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <p className="text-xs text-gray-600 mb-1">Total Submissions</p>
                <p className="text-2xl font-bold">972</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <p className="text-xs text-gray-600 mb-1">Avg Score</p>
                <p className="text-2xl font-bold">82%</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-none bg-white">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between mb-3">
                <CardTitle className="text-base font-semibold">Tests List</CardTitle>
                <Link href="/admin/tests/create">
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                    <Plus className="w-3 h-3 mr-1" />
                    Create Test
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tests..."
                    className="w-full pl-9 pr-3 py-1.5 border rounded-md text-xs"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Status
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Subject
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium">ID</th>
                    <th className="text-left p-3 text-xs font-medium">Title</th>
                    <th className="text-left p-3 text-xs font-medium">Date</th>
                    <th className="text-left p-3 text-xs font-medium">Progress</th>
                    <th className="text-left p-3 text-xs font-medium">Avg Score</th>
                    <th className="text-left p-3 text-xs font-medium">Flags</th>
                    <th className="text-left p-3 text-xs font-medium">Status</th>
                    <th className="text-left p-3 text-xs font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t) => (
                    <tr key={t.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-500 font-mono text-xs">{t.id}</td>
                      <td className="p-3">
                        <p className="font-medium">{t.title}</p>
                        <p className="text-xs text-gray-500">{t.subject}</p>
                      </td>
                      <td className="p-3 text-xs text-gray-600">{t.date}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-red-500 to-orange-500 h-1.5 rounded-full"
                              style={{ width: `${(t.completed / t.students) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{t.completed}/{t.students}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        {t.avgScore > 0 ? (
                          <Badge variant="outline" className={
                            t.avgScore >= 80 ? 'border-green-200 bg-green-50 text-green-700' :
                            t.avgScore >= 60 ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                            'border-red-200 bg-red-50 text-red-700'
                          }>
                            {t.avgScore}%
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        {t.flags > 0 ? (
                          <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {t.flags}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={
                          t.status === 'live' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                          t.status === 'completed' ? 'border-green-200 bg-green-50 text-green-700' :
                          'border-gray-200 bg-gray-50 text-gray-600'
                        }>
                          {t.status === 'live' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>}
                          {t.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
