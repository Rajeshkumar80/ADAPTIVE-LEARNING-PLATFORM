'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Users, Star, Play, ChevronRight } from 'lucide-react';

export default function CoursesPage() {
  const subjects = [
    { 
      id: 1, 
      name: 'Data Structures & Algorithms', 
      code: 'CS501', 
      progress: 75, 
      totalTopics: 12, 
      completedTopics: 9,
      mastery: 'High',
      hours: 45,
      color: 'from-blue-500 to-indigo-600',
      icon: '🌳'
    },
    { 
      id: 2, 
      name: 'Database Management Systems', 
      code: 'CS502', 
      progress: 85, 
      totalTopics: 10, 
      completedTopics: 8,
      mastery: 'High',
      hours: 38,
      color: 'from-purple-500 to-pink-600',
      icon: '🗄️'
    },
    { 
      id: 3, 
      name: 'Operating Systems', 
      code: 'CS503', 
      progress: 45, 
      totalTopics: 14, 
      completedTopics: 6,
      mastery: 'Medium',
      hours: 28,
      color: 'from-yellow-500 to-orange-600',
      icon: '⚙️'
    },
    { 
      id: 4, 
      name: 'Computer Networks', 
      code: 'CS504', 
      progress: 60, 
      totalTopics: 11, 
      completedTopics: 7,
      mastery: 'Medium',
      hours: 32,
      color: 'from-green-500 to-teal-600',
      icon: '🌐'
    },
    { 
      id: 5, 
      name: 'Software Engineering', 
      code: 'CS505', 
      progress: 70, 
      totalTopics: 13, 
      completedTopics: 9,
      mastery: 'High',
      hours: 40,
      color: 'from-pink-500 to-rose-600',
      icon: '🔧'
    },
    { 
      id: 6, 
      name: 'Artificial Intelligence', 
      code: 'CS506', 
      progress: 35, 
      totalTopics: 15, 
      completedTopics: 5,
      mastery: 'Low',
      hours: 22,
      color: 'from-cyan-500 to-blue-600',
      icon: '🤖'
    },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="My Subjects" subtitle="6th Semester • Computer Science" />
        <main className="flex-1 p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <BookOpen className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-2xl font-bold">6</p>
                <p className="text-xs text-gray-600">Active Subjects</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Clock className="w-5 h-5 text-purple-600 mb-2" />
                <p className="text-2xl font-bold">205h</p>
                <p className="text-xs text-gray-600">Total Study Time</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Star className="w-5 h-5 text-yellow-600 mb-2" />
                <p className="text-2xl font-bold">62%</p>
                <p className="text-xs text-gray-600">Avg Progress</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Users className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-2xl font-bold">44</p>
                <p className="text-xs text-gray-600">Topics Done</p>
              </CardContent>
            </Card>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Card key={subject.id} className="border shadow-none hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                <div className={`h-24 bg-gradient-to-br ${subject.color} relative`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 right-2 w-16 h-16 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="absolute bottom-2 left-3 text-3xl">
                    {subject.icon}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-white/20 backdrop-blur border-white/30 text-white text-[10px]">
                      {subject.code}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-sm">{subject.name}</h3>
                    <Badge
                      variant="outline"
                      className={`text-[10px] shrink-0 ${
                        subject.mastery === 'High' ? 'border-green-200 bg-green-50 text-green-700' :
                        subject.mastery === 'Medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                        'border-red-200 bg-red-50 text-red-700'
                      }`}
                    >
                      {subject.mastery}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{subject.completedTopics}/{subject.totalTopics} topics</span>
                    <span className="font-semibold text-gray-900">{subject.progress}%</span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div
                      className={`h-1.5 rounded-full bg-gradient-to-r ${subject.color}`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {subject.hours}h studied
                    </div>
                  </div>

                  <Button size="sm" className="w-full bg-black hover:bg-gray-800">
                    <Play className="w-3 h-3 mr-1" />
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
