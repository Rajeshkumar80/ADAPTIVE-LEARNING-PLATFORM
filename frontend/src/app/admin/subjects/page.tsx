'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Users } from 'lucide-react';

export default function AdminSubjectsPage() {
  const subjects = [
    { id: 1, code: 'CS501', name: 'Data Structures & Algorithms', semester: 5, credits: 4, students: 156, tests: 8, color: 'from-blue-500 to-indigo-600' },
    { id: 2, code: 'CS502', name: 'Database Management Systems', semester: 5, credits: 4, students: 142, tests: 6, color: 'from-purple-500 to-pink-600' },
    { id: 3, code: 'CS503', name: 'Operating Systems', semester: 5, credits: 4, students: 134, tests: 7, color: 'from-yellow-500 to-orange-600' },
    { id: 4, code: 'CS504', name: 'Computer Networks', semester: 5, credits: 3, students: 128, tests: 5, color: 'from-green-500 to-teal-600' },
    { id: 5, code: 'CS505', name: 'Software Engineering', semester: 5, credits: 3, students: 145, tests: 6, color: 'from-pink-500 to-rose-600' },
    { id: 6, code: 'CS506', name: 'Artificial Intelligence', semester: 6, credits: 4, students: 98, tests: 4, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin title="Subjects" subtitle="Manage all subjects and courses" />
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">{subjects.length} subjects across all semesters</p>
            </div>
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <Card key={s.id} className="border shadow-none bg-white overflow-hidden hover:shadow-md transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${s.color}`}></div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-[10px]">{s.code}</Badge>
                    <div className="flex gap-1">
                      <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{s.name}</h3>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
                    <span>Sem {s.semester}</span>
                    <span>•</span>
                    <span>{s.credits} credits</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-gray-500">Students</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {s.students}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tests</p>
                      <p className="font-semibold">{s.tests}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
