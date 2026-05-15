'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, BarChart3, Users, GraduationCap } from 'lucide-react';

export default function AdminReportsPage() {
  const reports = [
    { id: 1, title: 'Student Performance Report', description: 'Overall class performance metrics', icon: BarChart3, color: 'blue' },
    { id: 2, title: 'Attendance Summary', description: 'Monthly attendance breakdown', icon: Calendar, color: 'green' },
    { id: 3, title: 'Test Analytics', description: 'Test scores and pass rates', icon: GraduationCap, color: 'purple' },
    { id: 4, title: 'Student Engagement', description: 'Activity and engagement metrics', icon: Users, color: 'orange' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin title="Reports" subtitle="Generate and download class reports" />
        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((r) => {
              const Icon = r.icon;
              return (
                <Card key={r.id} className="border shadow-none bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center bg-${r.color}-50 text-${r.color}-600 shrink-0`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{r.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{r.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
