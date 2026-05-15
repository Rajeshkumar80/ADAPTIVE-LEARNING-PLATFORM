'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, TrendingUp, Award } from 'lucide-react';

export default function TestsPage() {
  const upcomingTests = [
    { id: 1, title: 'Operating Systems Mid-Term', subject: 'OS', date: 'May 18, 2026', time: '10:00 AM', duration: 60, questions: 30, difficulty: 'Hard' },
    { id: 2, title: 'Computer Networks Quiz 4', subject: 'CN', date: 'May 20, 2026', time: '2:00 PM', duration: 30, questions: 15, difficulty: 'Medium' },
    { id: 3, title: 'Software Engineering Test', subject: 'SE', date: 'May 22, 2026', time: '11:00 AM', duration: 90, questions: 50, difficulty: 'Easy' },
  ];

  const completedTests = [
    { id: 1, title: 'Data Structures Mid-Term', subject: 'DSA', date: 'May 12, 2026', score: 92, total: 100, grade: 'A+', trend: 'up' },
    { id: 2, title: 'DBMS Quiz 3', subject: 'DBMS', date: 'May 10, 2026', score: 88, total: 100, grade: 'A', trend: 'up' },
    { id: 3, title: 'Algorithms Assignment', subject: 'DSA', date: 'May 8, 2026', score: 85, total: 100, grade: 'A', trend: 'down' },
    { id: 4, title: 'OS Theory Test', subject: 'OS', date: 'May 5, 2026', score: 78, total: 100, grade: 'B+', trend: 'up' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Tests & Assessments" description="View upcoming tests and review past performance" />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <Badge variant="outline">Upcoming</Badge>
                </div>
                <p className="text-3xl font-bold">3</p>
                <p className="text-sm text-gray-600">Tests this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <Badge variant="success">Completed</Badge>
                </div>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-gray-600">Tests this semester</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <Badge variant="warning">Average</Badge>
                </div>
                <p className="text-3xl font-bold">85.5%</p>
                <p className="text-sm text-gray-600">Overall performance</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <Badge variant="success">Improving</Badge>
                </div>
                <p className="text-3xl font-bold">+5.2%</p>
                <p className="text-sm text-gray-600">From last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tests</CardTitle>
              <CardDescription>Prepare for your scheduled assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTests.map((test) => (
                  <div key={test.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{test.title}</h3>
                          <p className="text-sm text-gray-600">{test.subject}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">
                              <Calendar className="w-3 h-3 mr-1" />
                              {test.date}
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {test.time} • {test.duration} min
                            </Badge>
                            <Badge variant="outline">{test.questions} questions</Badge>
                            <Badge variant={
                              test.difficulty === 'Easy' ? 'success' :
                              test.difficulty === 'Medium' ? 'warning' : 'destructive'
                            }>
                              {test.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button>Start Preparation</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completed Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
              <CardDescription>Your test performance history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{test.title}</h3>
                        <p className="text-sm text-gray-600">{test.subject} • {test.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{test.score}<span className="text-sm text-gray-500">/{test.total}</span></p>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                      <Badge variant={test.grade.startsWith('A') ? 'success' : test.grade.startsWith('B') ? 'warning' : 'destructive'} className="text-base px-3 py-1">
                        {test.grade}
                      </Badge>
                      <Button variant="outline" size="sm">View Details</Button>
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
