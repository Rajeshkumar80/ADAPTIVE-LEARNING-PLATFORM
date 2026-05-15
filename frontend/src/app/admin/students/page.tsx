'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, Plus, MoreHorizontal, Mail } from 'lucide-react';

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');

  const students = Array.from({ length: 15 }, (_, i) => ({
    id: `1MS21CS${String(i + 1).padStart(3, '0')}`,
    name: ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Karthik Rao', 'Anjali Mehta', 'Vikram Singh', 'Pooja Gupta', 'Rahul Verma', 'Divya Iyer', 'Arjun Nair', 'Kavita Joshi', 'Suresh Babu', 'Meera Pillai', 'Nikhil Rao'][i],
    email: `student${i + 1}@vtu.edu`,
    section: ['A', 'B', 'C'][i % 3],
    semester: 6,
    cgpa: (7 + Math.random() * 2.5).toFixed(2),
    attendance: Math.floor(75 + Math.random() * 25),
    tests: Math.floor(8 + Math.random() * 5),
    status: ['active', 'active', 'active', 'inactive'][i % 4],
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin title="All Students" subtitle="Manage and monitor student progress" />
        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <p className="text-xs text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-bold">1,247</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <p className="text-xs text-gray-600 mb-1">Active Today</p>
                <p className="text-2xl font-bold text-green-600">892</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <p className="text-xs text-gray-600 mb-1">Avg CGPA</p>
                <p className="text-2xl font-bold">8.2</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <p className="text-xs text-gray-600 mb-1">Avg Attendance</p>
                <p className="text-2xl font-bold">87%</p>
              </CardContent>
            </Card>
          </div>

          {/* Students Table */}
          <Card className="border shadow-none bg-white">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between mb-3">
                <CardTitle className="text-base font-semibold">Students List</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Student
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Section
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Semester
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-3 h-3 mr-1" />
                  Status
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
                    <th className="text-left p-3 text-xs font-medium">Attendance</th>
                    <th className="text-left p-3 text-xs font-medium">Tests Taken</th>
                    <th className="text-left p-3 text-xs font-medium">Status</th>
                    <th className="text-left p-3 text-xs font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-500 font-mono text-xs">{s.id}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-[10px] font-semibold">
                            {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-xs text-gray-500">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{s.section}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={
                          parseFloat(s.cgpa) >= 9 ? 'border-green-200 bg-green-50 text-green-700' :
                          parseFloat(s.cgpa) >= 8 ? 'border-blue-200 bg-blue-50 text-blue-700' :
                          'border-yellow-200 bg-yellow-50 text-yellow-700'
                        }>
                          {s.cgpa}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                s.attendance >= 90 ? 'bg-green-500' :
                                s.attendance >= 75 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${s.attendance}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{s.attendance}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{s.tests}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={
                          s.status === 'active' ? 'border-green-200 bg-green-50 text-green-700' :
                          'border-gray-200 bg-gray-50 text-gray-600'
                        }>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4" />
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
