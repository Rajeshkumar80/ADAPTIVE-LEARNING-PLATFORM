'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityChart } from '@/components/charts';
import { useAuth } from '@/contexts/AuthContext';
import { mockDB } from '@/lib/mockdb';
import {
  BookOpen,
  Brain,
  Calendar,
  Trophy,
  Award,
  Target,
  Flame,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [achievementCount, setAchievementCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (user && user.role !== 'student') {
      router.push('/admin');
      return;
    }
    if (user) {
      setAchievementCount(mockDB.getAchievements(user.id).length);
      setCertificateCount(mockDB.getCertificates(user.id).length);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Study Streak', value: '7', unit: 'days', icon: Flame, color: 'text-orange-600 bg-orange-50' },
    { label: 'Avg Score', value: '85.5', unit: '%', icon: Trophy, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Hours This Week', value: '38', unit: 'hrs', icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Topics Mastered', value: '23', unit: '/45', icon: Target, color: 'text-green-600 bg-green-50' },
  ];

  const upcomingTests = [
    { id: 1, title: 'OS Mid-Term', subject: 'Operating Systems', date: 'May 18', time: '10:00 AM', difficulty: 'Hard' },
    { id: 2, title: 'CN Quiz 4', subject: 'Computer Networks', date: 'May 20', time: '2:00 PM', difficulty: 'Medium' },
    { id: 3, title: 'SE Test', subject: 'Software Engineering', date: 'May 22', time: '11:00 AM', difficulty: 'Easy' },
  ];

  const todaySchedule = [
    { time: '09:00 AM', subject: 'Data Structures', topic: 'Trees & Graphs', status: 'completed' },
    { time: '11:00 AM', subject: 'DBMS', topic: 'Normalization', status: 'in-progress' },
    { time: '02:00 PM', subject: 'OS', topic: 'Quick Quiz', status: 'pending' },
    { time: '03:30 PM', subject: 'CN', topic: 'TCP/IP Lab', status: 'pending' },
  ];

  const subjects = [
    { name: 'Data Structures', progress: 75, mastery: 'High', color: 'from-blue-500 to-indigo-600' },
    { name: 'DBMS', progress: 85, mastery: 'High', color: 'from-purple-500 to-pink-600' },
    { name: 'Operating Systems', progress: 45, mastery: 'Medium', color: 'from-yellow-500 to-orange-600' },
    { name: 'Computer Networks', progress: 60, mastery: 'Medium', color: 'from-green-500 to-teal-600' },
    { name: 'Software Engineering', progress: 70, mastery: 'High', color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Banner */}
          <Card className="border shadow-none bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden relative">
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Welcome back,</p>
                  <h2 className="text-2xl font-bold mb-2">{user.full_name}! 👋</h2>
                  <p className="text-sm opacity-90 mb-4">
                    {user.usn} • {user.branch} • Semester {user.semester}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/planner">
                      <Button size="sm" className="bg-white text-indigo-600 hover:bg-gray-100">
                        <Calendar className="w-3 h-3 mr-1" />
                        View Schedule
                      </Button>
                    </Link>
                    <Link href="/ai-tutor">
                      <Button size="sm" variant="outline" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20">
                        <Brain className="w-3 h-3 mr-1" />
                        Ask AI Tutor
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur rounded-full flex items-center justify-center">
                    <Sparkles className="w-16 h-16" />
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/10 rounded-full"></div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="border shadow-none">
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <span className="text-sm text-gray-500">{stat.unit}</span>
                    </div>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Achievements & Certificates Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/achievements">
              <Card className="border shadow-none cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl">
                      🏆
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold">{achievementCount}</p>
                      <p className="text-sm text-gray-600">Achievements Earned</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/certificates">
              <Card className="border shadow-none cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                      <Award className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold">{certificateCount}</p>
                      <p className="text-sm text-gray-600">Certificates Earned</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Today's Schedule + Upcoming Tests */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border shadow-none">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Today's Schedule</CardTitle>
                    <p className="text-xs text-gray-500">Friday, May 15, 2026</p>
                  </div>
                  <Link href="/planner">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {todaySchedule.map((s, idx) => (
                  <div key={idx} className={`flex items-center p-4 border-b last:border-0 hover:bg-gray-50 border-l-4 ${
                    s.status === 'completed' ? 'border-l-green-500' :
                    s.status === 'in-progress' ? 'border-l-yellow-500' :
                    'border-l-gray-200'
                  }`}>
                    <div className="w-20 text-center">
                      <p className="text-sm font-semibold">{s.time.split(' ')[0]}</p>
                      <p className="text-[10px] text-gray-500">{s.time.split(' ')[1]}</p>
                    </div>
                    <div className="flex-1 ml-4">
                      <p className="font-medium text-sm">{s.topic}</p>
                      <p className="text-xs text-gray-500">{s.subject}</p>
                    </div>
                    {s.status === 'completed' ? (
                      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    ) : s.status === 'in-progress' ? (
                      <Button size="sm" className="bg-black hover:bg-gray-800">
                        <Play className="w-3 h-3 mr-1" />
                        Continue
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">Start</Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border shadow-none">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Upcoming Tests</CardTitle>
                  <Link href="/tests">
                    <button className="text-xs hover:underline flex items-center gap-1">
                      All <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {upcomingTests.map((test) => (
                  <div key={test.id} className="p-3 border-b last:border-0 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{test.title}</p>
                        <p className="text-xs text-gray-500">{test.subject}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          test.difficulty === 'Easy' ? 'border-green-200 bg-green-50 text-green-700' :
                          test.difficulty === 'Medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                          'border-red-200 bg-red-50 text-red-700'
                        }`}
                      >
                        {test.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{test.date} • {test.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Subject Progress */}
          <Card className="border shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">My Subjects</CardTitle>
                  <p className="text-xs text-gray-500">Your progress across all subjects this semester</p>
                </div>
                <Link href="/courses">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map((subject) => (
                  <div key={subject.name} className="p-4 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                    <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${subject.color} mb-3`}></div>
                    <p className="font-medium text-sm mb-1">{subject.name}</p>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className="text-xs font-semibold">{subject.progress}%</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${subject.color}`}
                        style={{ width: `${subject.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        {subject.mastery} Mastery
                      </Badge>
                      <button className="text-xs text-gray-600 hover:text-gray-900">
                        Continue →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Chart */}
          <Card className="border shadow-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Study Activity</CardTitle>
                  <p className="text-xs text-gray-500">Your learning trends over time</p>
                </div>
                <select className="text-xs border rounded-md px-2 py-1.5">
                  <option>3 months</option>
                  <option>6 months</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityChart />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
