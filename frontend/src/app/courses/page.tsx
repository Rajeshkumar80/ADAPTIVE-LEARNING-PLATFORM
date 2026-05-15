'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AssignmentStatusChart } from '@/components/charts';
import {
  Users,
  Calendar,
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from 'lucide-react';

export default function CoursesPage() {
  const stats = [
    { label: 'Students Enrolled', value: '128', change: '+2.8%', sub: 'across 5 Grade 11 sections' },
    { label: 'Avg. Attendance', value: '94.2%', change: '+1.7%', sub: 'vs last month' },
    { label: 'Assignments', value: '81', change: '', sub: '63 pending • 18 overdue' },
    { label: 'Classes Today', value: '5', change: '', sub: '1 in progress • 3 upcoming • 1 cancelled' },
  ];

  const schedule = [
    { id: 1, time: '08:00 - 08:45', subject: 'Pure Mathematics', section: 'Grade 11A • Room 214', status: 'In Progress', date: 'Friday, 15 May' },
    { id: 2, time: '09:00 - 09:45', subject: 'English Literature', section: 'Grade 11B • Seminar Room 3', status: 'Upcoming', date: 'Friday, 15 May' },
    { id: 3, time: '10:00 - 10:45', subject: 'Physics', section: 'Grade 11C • Physics Lab', status: 'Upcoming', date: 'Friday, 15 May' },
    { id: 4, time: '11:00 - 11:45', subject: 'Modern European History', section: 'Grade 11A • Room 108', status: 'Cancelled', date: 'Friday, 15 May' },
    { id: 5, time: '12:00 - 12:45', subject: 'Computer Science', section: 'Grade 11B • Computing Lab', status: 'Upcoming', date: 'Friday, 15 May' },
  ];

  const performance = [
    { id: 1, class: 'G11A', subject: 'Pure Math', score: 84, color: 'bg-gray-900' },
    { id: 2, class: 'G11B', subject: 'Literature', score: 78, color: 'bg-gray-700' },
    { id: 3, class: 'G11C', subject: 'Physics', score: 80, color: 'bg-gray-800' },
    { id: 4, class: 'G11D', subject: 'History', score: 73, color: 'bg-gray-600' },
  ];

  const events = [
    { date: 'MAY 21', title: 'Science Exhibition', time: '08:30 AM - 12:30 PM', tag: 'On Campus' },
    { date: 'MAY 24', title: "Parents' Evening", time: '02:00 PM - 05:00 PM', tag: 'Meeting' },
    { date: 'MAY 27', title: 'Inter-House Sports Day', time: '09:00 AM - 04:00 PM', tag: 'Sports' },
    { date: 'MAY 30', title: 'Grade 11 Mock Exam', time: '09:00 AM - 12:00 PM', tag: 'Exam' },
    { date: 'JUN 2', title: 'Department Planning', time: '03:30 PM - 04:30 PM', tag: 'Meeting' },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border shadow-none">
                <CardContent className="p-5">
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <div className="flex items-end gap-2 mb-1">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    {stat.change && (
                      <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{stat.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Class Schedule and Assignment Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border shadow-none">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Class Schedule</CardTitle>
                  <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
                    View Full Schedule
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {schedule.map((item) => {
                  const statusColor = 
                    item.status === 'In Progress' ? 'bg-green-50 text-green-700 border-green-200' :
                    item.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200';
                  
                  const borderColor = 
                    item.status === 'In Progress' ? 'border-l-green-500' :
                    item.status === 'Cancelled' ? 'border-l-red-500' :
                    'border-l-yellow-500';

                  return (
                    <div key={item.id} className={`flex items-center justify-between p-3 border-b last:border-b-0 border-l-4 ${borderColor} hover:bg-gray-50`}>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium">{item.time}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.subject}</p>
                          <p className="text-xs text-gray-500">{item.section}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={statusColor}>
                        {item.status}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Assignment Status</CardTitle>
                  <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
                    View Report
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                    <span className="text-xs text-gray-600">Overdue</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <span className="text-xs text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="text-xs text-gray-600">Submitted</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AssignmentStatusChart />
              </CardContent>
            </Card>
          </div>

          {/* Performance Highlights & Upcoming Events */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Performance Highlights</CardTitle>
                  <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
                    View Insights
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performance.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-12">{item.class}</span>
                      <div className="flex-1">
                        <div className={`${item.color} h-7 rounded-md flex items-center px-3 text-xs text-white font-medium`} style={{ width: `${item.score}%` }}>
                          {item.subject}
                        </div>
                      </div>
                      <span className="text-sm font-medium w-10 text-right">{item.score}%</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-gray-500 pt-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-none">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
                  <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
                    View Calendar
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {events.map((event, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50">
                    <div className="w-12 text-center shrink-0">
                      <p className="text-[10px] font-medium text-gray-500 uppercase">{event.date.split(' ')[0]}</p>
                      <p className="text-lg font-bold">{event.date.split(' ')[1]}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{event.tag}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
