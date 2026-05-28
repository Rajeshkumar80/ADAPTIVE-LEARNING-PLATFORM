'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { BookOpen, GraduationCap, ChevronRight, Target } from 'lucide-react';

interface VTUSubject {
  code: string;
  name: string;
  credits: number;
}

interface SubjectDetail {
  code: string;
  name: string;
  credits: number;
  semester: number;
  course_outcomes: string[];
  program_outcomes: string[];
}

export default function VTUSubjectsPage() {
  const { user } = useAuth();
  const [semester, setSemester] = useState(user?.semester || 6);
  const [subjects, setSubjects] = useState<VTUSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, [semester]);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await api.getVTUSubjects(semester);
      setSubjects(data.subjects || []);
    } catch {
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjectDetail = async (code: string) => {
    try {
      const data = await api.getVTUSubjectDetails(code);
      setSelectedSubject(data);
    } catch {
      setSelectedSubject(null);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="VTU Subjects" subtitle="CSE 22 Scheme" />
        <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
          {/* Semester Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <Button
                key={s}
                size="sm"
                variant={semester === s ? 'default' : 'outline'}
                onClick={() => { setSemester(s); setSelectedSubject(null); }}
              >
                Sem {s}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subject List */}
            <div className="lg:col-span-1 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
                Semester {semester} Subjects
              </p>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-foreground border-t-transparent" />
                </div>
              ) : subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4">No subjects found</p>
              ) : (
                subjects.map(s => (
                  <Card
                    key={s.code}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedSubject?.code === s.code ? 'border-foreground' : ''}`}
                    onClick={() => loadSubjectDetail(s.code)}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.code} · {s.credits} credits</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Subject Detail */}
            <div className="lg:col-span-2">
              {selectedSubject ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      {selectedSubject.name}
                    </CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{selectedSubject.code}</Badge>
                      <Badge variant="outline">{selectedSubject.credits} Credits</Badge>
                      <Badge variant="outline">Semester {selectedSubject.semester}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Course Outcomes */}
                    {selectedSubject.course_outcomes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                          <Target className="w-4 h-4" /> Course Outcomes
                        </h3>
                        <div className="space-y-2">
                          {selectedSubject.course_outcomes.map((co, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                              <Badge variant="outline" className="shrink-0 text-[10px]">CO{i + 1}</Badge>
                              <p className="text-xs">{co.replace(/^CO\d+:\s*/, '')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Program Outcomes */}
                    <div>
                      <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                        <GraduationCap className="w-4 h-4" /> Program Outcomes (PO)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedSubject.program_outcomes.slice(0, 6).map((po, i) => (
                          <div key={i} className="text-xs p-2 bg-muted/30 rounded-md">
                            {po}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">Select a subject to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
