'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, Plus, MoreHorizontal } from 'lucide-react';

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');

  const students = Array.from({ length: 15 }, (_, i) => ({
    id: `1MS21CS${String(i + 1).padStart(3, '0')}`,
    name: ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Karthik Rao', 'Anjali Mehta', 'Vikram Singh', 'Pooja Gupta', 'Rahul Verma', 'Divya Iyer', 'Arjun Nair', 'Kavita Joshi', 'Suresh Babu', 'Meera Pillai', 'Nikhil Rao'][i],
    section: ['A', 'B', 'C'][i % 3],
    cgpa: (7 + Math.random() * 2.5).toFixed(2),
    attendance: Math.floor(75 + Math.random() * 25),
    status: ['active', 'active', 'active', 'inactive'][i % 4],
  }));

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage all enrolled students
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-3.5 h-3.5" />
                Add Student
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-2xl font-semibold tracking-tight">1,247</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Active today</p><p className="text-2xl font-semibold tracking-tight">892</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Avg CGPA</p><p className="text-2xl font-semibold tracking-tight">8.2</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Avg Attendance</p><p className="text-2xl font-semibold tracking-tight">87%</p></CardContent></Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-3 h-3" />
              Section
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-3 h-3" />
              Status
            </Button>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">USN</th>
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-left px-6 py-3 font-medium">Section</th>
                    <th className="text-left px-6 py-3 font-medium">CGPA</th>
                    <th className="text-left px-6 py-3 font-medium">Attendance</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 border-border hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-muted text-foreground flex items-center justify-center text-[10px] font-semibold">
                            {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{s.section}</td>
                      <td className="px-6 py-3 font-mono">{s.cgpa}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground" style={{ width: `${s.attendance}%` }}></div>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{s.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant="outline" className={
                          s.status === 'active' ? 'text-[10px] border-green-200 bg-green-50 text-green-700' :
                          'text-[10px]'
                        }>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <button className="p-1 text-muted-foreground hover:text-foreground rounded">
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
