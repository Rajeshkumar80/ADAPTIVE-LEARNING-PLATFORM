'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2, Eye } from 'lucide-react';

export default function AntiCheatPage() {
  const flags = [
    { id: 1, severity: 'critical', test: 'DSA Mid-Term', student: 'Student #1MS21CS045', violation: 'Multiple tab switches detected', count: 5, time: '5 min ago' },
    { id: 2, severity: 'warning', test: 'OS Assignment 2', student: 'Student #1MS21CS089', violation: 'Copy-paste blocked', count: 2, time: '15 min ago' },
    { id: 3, severity: 'critical', test: 'CN Lab Test', student: 'Student #1MS21CS112', violation: 'Browser dev tools opened', count: 1, time: '30 min ago' },
    { id: 4, severity: 'info', test: 'DBMS Quiz 3', student: 'Student #1MS21CS067', violation: 'Right-click disabled', count: 1, time: '1 hour ago' },
    { id: 5, severity: 'warning', test: 'DSA Mid-Term', student: 'Student #1MS21CS023', violation: 'Multiple tab switches', count: 3, time: '2 hours ago' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin title="Anti-Cheat Logs" subtitle="Monitor and review violation reports" />
        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <ShieldCheck className="w-5 h-5 text-red-500 mb-2" />
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-gray-600">Total Flags Today</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <AlertCircle className="w-5 h-5 text-red-600 mb-2" />
                <p className="text-2xl font-bold text-red-600">3</p>
                <p className="text-xs text-gray-600">Critical</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mb-2" />
                <p className="text-2xl font-bold text-yellow-600">4</p>
                <p className="text-xs text-gray-600">Warning</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-gray-600">Clean Tests</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border shadow-none bg-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent Violations</CardTitle>
              <p className="text-xs text-gray-500">All anti-cheat alerts and flags</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {flags.map((f) => (
                  <div key={f.id} className="p-4 hover:bg-gray-50 flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      f.severity === 'critical' ? 'bg-red-100 text-red-600' :
                      f.severity === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {f.severity === 'critical' ? <AlertCircle className="w-5 h-5" /> :
                       f.severity === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                       <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-medium text-sm">{f.violation}</p>
                          <p className="text-xs text-gray-500">{f.student} • {f.test}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={
                            f.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-700' :
                            f.severity === 'warning' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' :
                            'border-blue-200 bg-blue-50 text-blue-700'
                          }>
                            {f.severity}
                          </Badge>
                          <Badge variant="outline">×{f.count}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{f.time}</p>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Investigate
                        </Button>
                      </div>
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
