'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';

export default function AdminSubjectsPage() {
  const subjects = [
    { id: 1, code: 'CS501', name: 'Data Structures & Algorithms', semester: 5, credits: 4, students: 156, tests: 8 },
    { id: 2, code: 'CS502', name: 'Database Management Systems', semester: 5, credits: 4, students: 142, tests: 6 },
    { id: 3, code: 'CS503', name: 'Operating Systems', semester: 5, credits: 4, students: 134, tests: 7 },
    { id: 4, code: 'CS504', name: 'Computer Networks', semester: 5, credits: 3, students: 128, tests: 5 },
    { id: 5, code: 'CS505', name: 'Software Engineering', semester: 5, credits: 3, students: 145, tests: 6 },
    { id: 6, code: 'CS506', name: 'Artificial Intelligence', semester: 6, credits: 4, students: 98, tests: 4 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Subjects</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{subjects.length} subjects across all semesters</p>
            </div>
            <Button size="sm">
              <Plus className="w-3.5 h-3.5" />
              Add Subject
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Code</th>
                    <th className="text-left px-6 py-3 font-medium">Subject</th>
                    <th className="text-left px-6 py-3 font-medium">Semester</th>
                    <th className="text-left px-6 py-3 font-medium">Credits</th>
                    <th className="text-left px-6 py-3 font-medium">Students</th>
                    <th className="text-left px-6 py-3 font-medium">Tests</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 border-border hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{s.code}</td>
                      <td className="px-6 py-3 font-medium">{s.name}</td>
                      <td className="px-6 py-3 text-muted-foreground">Sem {s.semester}</td>
                      <td className="px-6 py-3 text-muted-foreground">{s.credits}</td>
                      <td className="px-6 py-3 font-mono">{s.students}</td>
                      <td className="px-6 py-3 font-mono">{s.tests}</td>
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
