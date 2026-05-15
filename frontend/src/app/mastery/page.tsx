'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertCircle, CheckCircle2, Target } from 'lucide-react';

export default function MasteryPage() {
  const topics = [
    { id: 1, subject: 'DSA', topic: 'Arrays & Strings', mastery: 92, status: 'mastered', lastReview: '2 days ago', forgetting: 'low' },
    { id: 2, subject: 'DSA', topic: 'Linked Lists', mastery: 85, status: 'proficient', lastReview: '5 days ago', forgetting: 'low' },
    { id: 3, subject: 'DSA', topic: 'Trees & Graphs', mastery: 70, status: 'learning', lastReview: '1 day ago', forgetting: 'medium' },
    { id: 4, subject: 'DSA', topic: 'Dynamic Programming', mastery: 45, status: 'weak', lastReview: '7 days ago', forgetting: 'high' },
    { id: 5, subject: 'DBMS', topic: 'SQL Queries', mastery: 88, status: 'mastered', lastReview: '3 days ago', forgetting: 'low' },
    { id: 6, subject: 'DBMS', topic: 'Normalization', mastery: 75, status: 'proficient', lastReview: '4 days ago', forgetting: 'low' },
    { id: 7, subject: 'OS', topic: 'Process Scheduling', mastery: 60, status: 'learning', lastReview: '6 days ago', forgetting: 'medium' },
    { id: 8, subject: 'OS', topic: 'Memory Management', mastery: 35, status: 'weak', lastReview: '10 days ago', forgetting: 'high' },
  ];

  const statusColors = {
    mastered: 'bg-green-100 text-green-700 border-green-200',
    proficient: 'bg-blue-100 text-blue-700 border-blue-200',
    learning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    weak: 'bg-red-100 text-red-700 border-red-200',
  };

  const masteryColors = {
    high: 'bg-green-500',
    medium: 'bg-yellow-500',
    low: 'bg-red-500',
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Topic Mastery" subtitle="Track your knowledge across all topics" />
        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-2xl font-bold">{topics.filter(t => t.status === 'mastered').length}</p>
                <p className="text-xs text-gray-600">Mastered</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Target className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-2xl font-bold">{topics.filter(t => t.status === 'proficient').length}</p>
                <p className="text-xs text-gray-600">Proficient</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Brain className="w-5 h-5 text-yellow-600 mb-2" />
                <p className="text-2xl font-bold">{topics.filter(t => t.status === 'learning').length}</p>
                <p className="text-xs text-gray-600">Learning</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <AlertCircle className="w-5 h-5 text-red-600 mb-2" />
                <p className="text-2xl font-bold">{topics.filter(t => t.status === 'weak').length}</p>
                <p className="text-xs text-gray-600">Need Practice</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendation */}
          <Card className="border shadow-none bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">AI Recommendation</p>
                  <p className="text-sm text-gray-700 mb-3">
                    Focus on <strong>Memory Management</strong> and <strong>Dynamic Programming</strong> - they have high forgetting probability and weak mastery. Spend 30 mins on each daily.
                  </p>
                  <Button size="sm" className="bg-black hover:bg-gray-800">Start Review Session</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topics Table */}
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Topic Mastery Levels</CardTitle>
              <p className="text-xs text-gray-500">Bayesian knowledge tracking with Ebbinghaus forgetting curve</p>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs text-gray-500">
                    <th className="text-left p-3 font-medium">Topic</th>
                    <th className="text-left p-3 font-medium">Mastery</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Forgetting Risk</th>
                    <th className="text-left p-3 font-medium">Last Review</th>
                    <th className="text-left p-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr key={topic.id} className="border-b last:border-0 hover:bg-gray-50 text-sm">
                      <td className="p-3">
                        <p className="font-medium">{topic.topic}</p>
                        <p className="text-xs text-gray-500">{topic.subject}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                topic.mastery >= 80 ? 'bg-green-500' :
                                topic.mastery >= 60 ? 'bg-blue-500' :
                                topic.mastery >= 40 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${topic.mastery}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium w-10">{topic.mastery}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={statusColors[topic.status as keyof typeof statusColors]}>
                          {topic.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${masteryColors[topic.forgetting === 'low' ? 'high' : topic.forgetting === 'high' ? 'low' : 'medium']}`}></div>
                          <span className="text-xs capitalize">{topic.forgetting}</span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-gray-600">{topic.lastReview}</td>
                      <td className="p-3">
                        <Button size="sm" variant="outline">Review</Button>
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
