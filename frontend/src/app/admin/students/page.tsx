'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search, Download, Plus, MoreHorizontal, Users, X,
  GraduationCap, ChevronRight,
} from 'lucide-react';
import {
  ALL_STUDENTS,
  BRANCHES,
  SECTIONS,
  SEMESTERS,
  filterStudents,
  getStudentStats,
  type Branch,
  type Section,
  type StudentRecord,
} from '@/lib/students-data';

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState<Branch | 'all'>('all');
  const [section, setSection] = useState<Section | 'all'>('all');
  const [semester, setSemester] = useState<number | 'all'>('all');
  const [status, setStatus] = useState<'active' | 'inactive' | 'all'>('all');
  const [selected, setSelected] = useState<StudentRecord | null>(null);

  const filtered = useMemo(
    () => filterStudents({ branch, section, semester, status, search }),
    [branch, section, semester, status, search]
  );

  const stats = useMemo(() => getStudentStats(filtered), [filtered]);

  const clearFilters = () => {
    setBranch('all');
    setSection('all');
    setSemester('all');
    setStatus('all');
    setSearch('');
  };

  const hasFilters = branch !== 'all' || section !== 'all' || semester !== 'all' || status !== 'all' || search !== '';

  // Get current selection label
  const selectionLabel = useMemo(() => {
    const parts = [];
    if (branch !== 'all') parts.push(branch);
    if (section !== 'all') parts.push(`Sec ${section}`);
    if (semester !== 'all') parts.push(`Sem ${semester}`);
    return parts.join(' · ') || 'All branches';
  }, [branch, section, semester]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stats.total} students · {selectionLabel}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-3.5 h-3.5" />
                Add Student
              </Button>
            </div>
          </div>

          {/* Branch quick-pick row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => { setBranch('all'); setSection('all'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border transition-colors ${
                branch === 'all'
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border hover:bg-muted'
              }`}
            >
              All branches
              <span className="ml-1.5 opacity-60">{ALL_STUDENTS.length}</span>
            </button>
            {BRANCHES.map((b) => (
              <button
                key={b.code}
                onClick={() => { setBranch(b.code); setSection('all'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border transition-colors ${
                  branch === b.code
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:bg-muted'
                }`}
                title={b.name}
              >
                {b.code}
                <span className="ml-1.5 opacity-60">{b.students}</span>
              </button>
            ))}
          </div>

          {/* Section selector — only when a branch is selected */}
          {branch !== 'all' && (
            <div className="flex items-center gap-2 animate-fade-in">
              <span className="text-xs text-muted-foreground mr-1">Section:</span>
              <button
                onClick={() => setSection('all')}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                  section === 'all'
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:bg-muted'
                }`}
              >
                All
              </button>
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                    section === s
                      ? 'bg-foreground text-background border-foreground'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  Section {s}
                </button>
              ))}
            </div>
          )}

          {/* Stats — recalculated based on filter */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">Showing</p>
                <p className="text-2xl font-semibold tracking-tight">{stats.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">Active</p>
                <p className="text-2xl font-semibold tracking-tight text-green-700">{stats.active}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">Avg CGPA</p>
                <p className="text-2xl font-semibold tracking-tight">{stats.avgCgpa}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">Top performers</p>
                <p className="text-2xl font-semibold tracking-tight">{stats.topPerformers}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">At risk</p>
                <p className="text-2xl font-semibold tracking-tight text-amber-700">{stats.atRisk}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search + secondary filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or USN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="h-8 px-2 text-xs border border-border rounded-md bg-background"
            >
              <option value="all">All semesters</option>
              {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="h-8 px-2 text-xs border border-border rounded-md bg-background"
            >
              <option value="all">All statuses</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8">
                <X className="w-3 h-3" />
                Clear
              </Button>
            )}
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">No students found</p>
                  <p className="text-xs text-muted-foreground mb-4">Try adjusting your filters</p>
                  <Button size="sm" variant="outline" onClick={clearFilters}>Clear filters</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border text-xs text-muted-foreground bg-muted/30">
                      <tr>
                        <th className="text-left px-6 py-3 font-medium">USN</th>
                        <th className="text-left px-6 py-3 font-medium">Name</th>
                        <th className="text-left px-6 py-3 font-medium">Branch</th>
                        <th className="text-left px-6 py-3 font-medium">Section</th>
                        <th className="text-left px-6 py-3 font-medium">Sem</th>
                        <th className="text-left px-6 py-3 font-medium">CGPA</th>
                        <th className="text-left px-6 py-3 font-medium">Attendance</th>
                        <th className="text-left px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.slice(0, 100).map((s) => (
                        <tr
                          key={s.id}
                          className="border-b last:border-0 border-border hover:bg-muted/40 transition-colors cursor-pointer"
                          onClick={() => setSelected(s)}
                        >
                          <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{s.usn}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-muted text-foreground flex items-center justify-center text-[10px] font-semibold">
                                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <p className="font-medium">{s.name}</p>
                                <p className="text-[11px] text-muted-foreground">{s.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <Badge variant="outline" className="text-[10px]">{s.branch}</Badge>
                          </td>
                          <td className="px-6 py-3 text-muted-foreground">{s.section}</td>
                          <td className="px-6 py-3 text-muted-foreground">{s.semester}</td>
                          <td className="px-6 py-3 font-mono">
                            <span className={
                              s.cgpa >= 9 ? 'text-green-700' :
                              s.cgpa >= 7 ? '' :
                              'text-amber-700'
                            }>
                              {s.cgpa}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    s.attendance >= 90 ? 'bg-green-500' :
                                    s.attendance >= 75 ? 'bg-foreground' :
                                    'bg-amber-500'
                                  }`}
                                  style={{ width: `${s.attendance}%` }}
                                />
                              </div>
                              <span className="text-[11px] text-muted-foreground font-mono">{s.attendance}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <Badge variant="outline" className={
                              s.status === 'active'
                                ? 'text-[10px] border-green-200 bg-green-50 text-green-700'
                                : 'text-[10px]'
                            }>
                              {s.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelected(s); }}
                              className="p-1 text-muted-foreground hover:text-foreground rounded"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filtered.length > 100 && (
                    <div className="px-6 py-3 border-t border-border bg-muted/30 text-center">
                      <p className="text-xs text-muted-foreground">
                        Showing first 100 of {filtered.length} students. Use filters to narrow down.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Student Detail Modal */}
      {selected && <StudentDetail student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function StudentDetail({ student, onClose }: { student: StudentRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-background rounded-lg max-w-lg w-full overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">Student Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-muted text-foreground flex items-center justify-center text-base font-semibold shrink-0">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold tracking-tight">{student.name}</h3>
              <p className="text-sm text-muted-foreground">{student.email}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{student.usn}</p>
            </div>
            <Badge variant="outline" className={
              student.status === 'active'
                ? 'text-[10px] border-green-200 bg-green-50 text-green-700'
                : 'text-[10px]'
            }>
              {student.status}
            </Badge>
          </div>

          {/* Academic info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 border border-border rounded-md">
              <p className="text-xs text-muted-foreground mb-0.5">Branch</p>
              <p className="text-sm font-semibold">{student.branch}</p>
            </div>
            <div className="text-center p-3 border border-border rounded-md">
              <p className="text-xs text-muted-foreground mb-0.5">Section</p>
              <p className="text-sm font-semibold">{student.section}</p>
            </div>
            <div className="text-center p-3 border border-border rounded-md">
              <p className="text-xs text-muted-foreground mb-0.5">Semester</p>
              <p className="text-sm font-semibold">{student.semester}</p>
            </div>
          </div>

          {/* Performance */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</p>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm">CGPA</p>
                <p className="text-sm font-semibold font-mono">{student.cgpa}</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground" style={{ width: `${(student.cgpa / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm">Attendance</p>
                <p className="text-sm font-semibold font-mono">{student.attendance}%</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    student.attendance >= 90 ? 'bg-green-500' :
                    student.attendance >= 75 ? 'bg-foreground' :
                    'bg-amber-500'
                  }`}
                  style={{ width: `${student.attendance}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm">Avg test score</p>
                <p className="text-sm font-semibold font-mono">{student.avgScore}%</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground" style={{ width: `${student.avgScore}%` }} />
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[11px] text-muted-foreground">Tests completed</p>
                <p className="text-sm font-semibold">{student.testsCompleted}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[11px] text-muted-foreground">Last active</p>
                <p className="text-sm font-semibold">{student.lastActive}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button>
            View full profile
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
