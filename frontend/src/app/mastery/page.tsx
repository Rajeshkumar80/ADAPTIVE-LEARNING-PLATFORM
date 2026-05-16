'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function MasteryPage() {
  const topics = [
    { id: 1, subject: 'DSA', topic: 'Arrays & Strings', mastery: 92, status: 'mastered', forgetting: 'low' },
    { id: 2, subject: 'DSA', topic: 'Linked Lists', mastery: 85, status: 'proficient', forgetting: 'low' },
    { id: 3, subject: 'DSA', topic: 'Trees & Graphs', mastery: 70, status: 'learning', forgetting: 'medium' },
    { id: 4, subject: 'DSA', topic: 'Dynamic Programming', mastery: 45, status: 'weak', forgetting: 'high' },
    { id: 5, subject: 'DBMS', topic: 'SQL Queries', mastery: 88, status: 'mastered', forgetting: 'low' },
    { id: 6, subject: 'DBMS', topic: 'Normalization', mastery: 75, status: 'proficient', forgetting: 'low' },
    { id: 7, subject: 'OS', topic: 'Process Scheduling', mastery: 60, status: 'learning', forgetting: 'medium' },
    { id: 8, subject: 'OS', topic: 'Memory Management', mastery: 35, status: 'weak', forgetting: 'high' },
  ];

  const statusConfig = {
    mastered: 'bg-green-50 text-green-700 border-green-200',
    proficient: 'bg-blue-50 text-blue-700 border-blue-200',
    learning: 'bg-amber-50 text-amber-700 border-amber-200',
    weak: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Topic Mastery</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Track your knowledge across all topics with AI-powered insights
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Mastered</p><p className="text-2xl font-semibold tracking-tight">{topics.filter(t => t.status === 'mastered').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Proficient</p><p className="text-2xl font-semibold tracking-tight">{topics.filter(t => t.status === 'proficient').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Learning</p><p className="text-2xl font-semibold tracking-tight">{topics.filter(t => t.status === 'learning').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Need Practice</p><p className="text-2xl font-semibold tracking-tight">{topics.filter(t => t.status === 'weak').length}</p></CardContent></Card>
          </div>

          {/* AI Recommendation */}
          <Card className="bg-muted/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-background" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">AI Recommendation</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Focus on Memory Management and Dynamic Programming — they have high forgetting probability and weak mastery. Spend 30 mins on each daily.
                  </p>
                  <Link href="/ai-tutor">
                    <Button size="sm">Start Review Session</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topics List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topics.map((topic) => (
                  <div key={topic.id} className="flex items-center px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-muted-foreground font-mono">{topic.subject}</span>
                        <span className="text-sm font-medium">{topic.topic}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-xs h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground"
                            style={{ width: `${topic.mastery}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono w-9">{topic.mastery}%</span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <Badge variant="outline" className={`text-[10px] ${statusConfig[topic.status as keyof typeof statusConfig]}`}>
                        {topic.status}
                      </Badge>
                      <Link href="/ai-tutor">
                        <Button size="sm" variant="outline">Review</Button>
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
