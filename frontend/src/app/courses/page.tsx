'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function CoursesPage() {
  const subjects = [
    { id: 1, name: 'Data Structures & Algorithms', code: 'CS501', progress: 75, topics: 9, totalTopics: 12, hours: 45 },
    { id: 2, name: 'Database Management Systems', code: 'CS502', progress: 85, topics: 8, totalTopics: 10, hours: 38 },
    { id: 3, name: 'Operating Systems', code: 'CS503', progress: 45, topics: 6, totalTopics: 14, hours: 28 },
    { id: 4, name: 'Computer Networks', code: 'CS504', progress: 60, topics: 7, totalTopics: 11, hours: 32 },
    { id: 5, name: 'Software Engineering', code: 'CS505', progress: 70, topics: 9, totalTopics: 13, hours: 40 },
    { id: 6, name: 'Artificial Intelligence', code: 'CS506', progress: 35, topics: 5, totalTopics: 15, hours: 22 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Subjects</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              6th Semester · Computer Science · {subjects.length} active subjects
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">Total Subjects</p>
                <p className="text-2xl font-semibold tracking-tight">{subjects.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">Hours Studied</p>
                <p className="text-2xl font-semibold tracking-tight">205h</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">Avg Progress</p>
                <p className="text-2xl font-semibold tracking-tight">62%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">Topics Done</p>
                <p className="text-2xl font-semibold tracking-tight">44/75</p>
              </CardContent>
            </Card>
          </div>

          {/* Subjects List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="group flex items-center px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-muted-foreground font-mono">{subject.code}</span>
                        <h3 className="text-sm font-medium">{subject.name}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {subject.topics}/{subject.totalTopics} topics
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {subject.hours}h
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-6">
                      <div className="hidden md:flex items-center gap-2 w-48">
                        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground"
                            style={{ width: `${subject.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono w-9 text-right">
                          {subject.progress}%
                        </span>
                      </div>
                      <Link href="/ai-tutor">
                        <Button variant="ghost" size="sm" className="h-7">
                          Continue
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
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
