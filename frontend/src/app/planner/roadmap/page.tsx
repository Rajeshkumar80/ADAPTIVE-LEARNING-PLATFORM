'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Sparkles, Clock, BookOpen, Calendar, Loader2, AlertCircle } from 'lucide-react';

interface RoadmapDay {
  day: string;
  date: string;
  topics: { name: string; subject: string; duration_minutes: number; activity: string; mastery_before?: number }[];
  total_minutes: number;
  notes?: string;
}

interface RoadmapWeek {
  week: number;
  days: RoadmapDay[];
}

const activityColors: Record<string, string> = {
  learn: 'bg-blue-100 text-blue-700',
  review: 'bg-amber-100 text-amber-700',
  practice: 'bg-emerald-100 text-emerald-700',
  test_prep: 'bg-red-100 text-red-700',
};

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [weeks, setWeeks] = useState(4);
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.getRoadmap().then((data: any) => {
      if (data.roadmap && data.roadmap.length > 0) {
        setRoadmap(data.roadmap);
        setSummary(data.summary || '');
      }
    }).catch(() => {}).finally(() => setLoadingExisting(false));
  }, [user]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.generateRoadmap(hoursPerDay, weeks) as any;
      if (data.roadmap) {
        setRoadmap(data.roadmap);
        setSummary(data.summary || '');
        setSelectedWeek(0);
      } else {
        setError(data.detail || 'Failed to generate roadmap');
      }
    } catch (err: any) {
      setError(err.message || 'Could not generate roadmap. Please try again.');
    }
    setLoading(false);
  };

  const currentWeek = roadmap[selectedWeek];
  const totalMinutesAllWeeks = roadmap.reduce((sum, w) =>
    sum + w.days.reduce((ds, d) => ds + d.total_minutes, 0), 0);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Study Roadmap" subtitle="AI-generated multi-week study plan" />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Config + Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Hours/day:</label>
                <input type="number" min={0.5} max={12} step={0.5} value={hoursPerDay}
                  onChange={e => setHoursPerDay(parseFloat(e.target.value) || 2)}
                  className="w-16 px-2 py-1 text-sm border rounded-md bg-background" />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Weeks:</label>
                <input type="number" min={1} max={12} value={weeks}
                  onChange={e => setWeeks(parseInt(e.target.value) || 4)}
                  className="w-16 px-2 py-1 text-sm border rounded-md bg-background" />
              </div>
              <Button onClick={handleGenerate} disabled={loading} size="sm">
                {loading ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1" />}
                {roadmap.length > 0 ? 'Regenerate' : 'Generate Roadmap'}
              </Button>
            </div>
            {roadmap.length > 0 && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {roadmap.length} weeks</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {Math.round(totalMinutesAllWeeks / 60)}h total</span>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {!loadingExisting && roadmap.length === 0 && !loading && (
            <Card>
              <CardContent className="py-16 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                <p className="text-lg font-medium mb-2">No roadmap yet</p>
                <p className="text-sm text-muted-foreground mb-4">Generate a personalized study plan based on your mastery levels</p>
                <Button onClick={handleGenerate} size="sm">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Generate Roadmap
                </Button>
              </CardContent>
            </Card>
          )}

          {roadmap.length > 0 && (
            <>
              {summary && <p className="text-sm text-muted-foreground">{summary}</p>}

              {/* Week selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {roadmap.map((w, i) => (
                  <button key={i} onClick={() => setSelectedWeek(i)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      i === selectedWeek ? 'bg-foreground text-background' : 'bg-muted hover:bg-muted/80'
                    }`}>
                    Week {w.week}
                  </button>
                ))}
              </div>

              {/* Week grid */}
              {currentWeek && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {currentWeek.days.map((day, di) => (
                    <Card key={di} className="overflow-hidden">
                      <CardHeader className="pb-2 py-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{day.day}</CardTitle>
                          <span className="text-xs text-muted-foreground">{day.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" /> {Math.round(day.total_minutes / 60 * 10) / 10}h
                          <span className="text-muted-foreground/50">·</span>
                          {day.topics.length} topic{day.topics.length !== 1 ? 's' : ''}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-2">
                        {day.topics.map((topic, ti) => (
                          <div key={ti} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                            <BookOpen className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{topic.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-muted-foreground">{topic.subject}</span>
                                <span className="text-[10px] text-muted-foreground">·</span>
                                <span className="text-[10px] text-muted-foreground">{topic.duration_minutes}m</span>
                                {topic.mastery_before !== undefined && (
                                  <span className={`text-[10px] px-1 py-0.5 rounded ${topic.mastery_before < 40 ? 'bg-red-100 text-red-600' : topic.mastery_before < 70 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {topic.mastery_before}%
                                  </span>
                                )}
                              </div>
                              <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${activityColors[topic.activity] || 'bg-gray-100 text-gray-600'}`}>
                                {topic.activity.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        ))}
                        {day.notes && (
                          <p className="text-[10px] text-muted-foreground italic">{day.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
