'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

export default function TestsPage() {
  const upcoming = [
    { id: 1, title: 'Operating Systems Mid-Term', subject: 'OS', date: 'May 18, 2026', time: '10:00 AM', duration: 60, questions: 30, difficulty: 'Hard' },
    { id: 2, title: 'Computer Networks Quiz 4', subject: 'CN', date: 'May 20, 2026', time: '2:00 PM', duration: 30, questions: 15, difficulty: 'Medium' },
    { id: 3, title: 'Software Engineering Test', subject: 'SE', date: 'May 22, 2026', time: '11:00 AM', duration: 90, questions: 50, difficulty: 'Easy' },
  ];

  const completed = [
    { id: 1, title: 'Data Structures Mid-Term', subject: 'DSA', date: 'May 12, 2026', score: 92, grade: 'A+' },
    { id: 2, title: 'DBMS Quiz 3', subject: 'DBMS', date: 'May 10, 2026', score: 88, grade: 'A' },
    { id: 3, title: 'Algorithms Assignment', subject: 'DSA', date: 'May 8, 2026', score: 85, grade: 'A' },
    { id: 4, title: 'OS Theory Test', subject: 'OS', date: 'May 5, 2026', score: 78, grade: 'B+' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Calendar className="w-4 h-4 text-gray-500 mb-2" />
                <p className="text-2xl font-semibold mb-1">3</p>
                <p className="text-xs text-gray-500">Upcoming this week</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <CheckCircle2 className="w-4 h-4 text-gray-500 mb-2" />
                <p className="text-2xl font-semibold mb-1">12</p>
                <p className="text-xs text-gray-500">Completed this semester</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <TrendingUp className="w-4 h-4 text-gray-500 mb-2" />
                <p className="text-2xl font-semibold mb-1">85.5%</p>
                <p className="text-xs text-gray-500">Average score</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <FileText className="w-4 h-4 text-gray-500 mb-2" />
                <p className="text-2xl font-semibold mb-1">+5.2%</p>
                <p className="text-xs text-gray-500">From last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Upcoming Tests</CardTitle>
              <p className="text-xs text-gray-500">Prepare for your scheduled assessments</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcoming.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.subject} • {test.date} at {test.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{test.questions} Q</Badge>
                      <Badge variant="outline" className="text-xs">{test.duration} min</Badge>
                      <Badge variant="outline" className={`text-xs ${
                        test.difficulty === 'Easy' ? 'border-green-200 bg-green-50 text-green-700' :
                        test.difficulty === 'Medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                        'border-red-200 bg-red-50 text-red-700'
                      }`}>{test.difficulty}</Badge>
                      <Button size="sm" className="bg-black hover:bg-gray-800">Prepare</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent Results</CardTitle>
              <p className="text-xs text-gray-500">Your test performance history</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completed.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.subject} • {test.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold">{test.score}<span className="text-sm text-gray-400">/100</span></p>
                      </div>
                      <Badge className="bg-black text-white">{test.grade}</Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
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
