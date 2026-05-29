'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search, Download, Plus, MoreHorizontal, Users, X,
  GraduationCap, ChevronRight, CheckCircle2, AlertCircle,
} from 'lucide-react';
import {
  ALL_STUDENTS,
  BRANCHES,
  SECTIONS,
  SEMESTERS,
  getStudentStats,
  buildUSN,
  nextUSNSequence,
  type Branch,
  type Section,
  type StudentRecord,
} from '@/lib/students-data';

const ADDED_KEY = 'adaptlearn_added_students';

export default function AdminStudentsPage() {
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState<Branch | 'all'>('all');
  const [section, setSection] = useState<Section | 'all'>('all');
  const [semester, setSemester] = useState<number | 'all'>('all');
  const [status, setStatus] = useState<'active' | 'inactive' | 'all'>('all');
  const [selected, setSelected] = useState<StudentRecord | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addedStudents, setAddedStudents] = useState<StudentRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(ADDED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const allStudents = useMemo(() => [...addedStudents, ...ALL_STUDENTS], [addedStudents]);

  const filtered = useMemo(() => {
    // Manual filtering since we now have augmented list
    return allStudents.filter(s => {
      if (branch !== 'all' && s.branch !== branch) return false;
      if (section !== 'all' && s.section !== section) return false;
      if (semester !== 'all' && s.semester !== semester) return false;
      if (status !== 'all' && s.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.usn.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [allStudents, branch, section, semester, status, search]);

  const stats = useMemo(() => getStudentStats(filtered), [filtered]);

  const clearFilters = () => {
    setBranch('all');
    setSection('all');
    setSemester('all');
    setStatus('all');
    setSearch('');
  };

  const hasFilters = branch !== 'all' || section !== 'all' || semester !== 'all' || status !== 'all' || search !== '';

  const handleAddStudent = (newStudent: StudentRecord) => {
    // Check for duplicates
    if (allStudents.some(s => s.usn === newStudent.usn)) {
      setToast({ message: `USN ${newStudent.usn} already exists`, type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (allStudents.some(s => s.email === newStudent.email)) {
      setToast({ message: `Email ${newStudent.email} already registered`, type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const updated = [newStudent, ...addedStudents];
    setAddedStudents(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADDED_KEY, JSON.stringify(updated));
    }
    setShowAddForm(false);
    setToast({ message: `${newStudent.name} added successfully`, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    const csv = [
      ['USN', 'Name', 'Email', 'Branch', 'Section', 'Semester', 'CGPA', 'Attendance', 'Status'].join(','),
      ...filtered.map(s => [s.usn, s.name, s.email, s.branch, s.section, s.semester, s.cgpa, s.attendance + '%', s.status].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast({ message: `Exported ${filtered.length} students`, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

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
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-3.5 h-3.5" />
                Export
              </Button>
              <Button size="sm" onClick={() => setShowAddForm(true)}>
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

      {/* Add Student Modal */}
      {showAddForm && (
        <AddStudentForm
          existingStudents={allStudents}
          onAdd={handleAddStudent}
          onCancel={() => setShowAddForm(false)}
          defaults={{
            branch: branch !== 'all' ? branch : 'CSE',
            section: section !== 'all' ? section : 'A',
            semester: semester !== 'all' ? semester : 6,
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-md border shadow-lg animate-slide-up ${
          toast.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </div>
  );
}

function StudentDetail({ student, onClose }: { student: StudentRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-[3px] flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
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


// ============= Add Student Form =============
function AddStudentForm({
  existingStudents,
  onAdd,
  onCancel,
  defaults,
}: {
  existingStudents: StudentRecord[];
  onAdd: (student: StudentRecord) => void;
  onCancel: () => void;
  defaults: { branch: Branch; section: Section; semester: number };
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    // Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'male' as 'male' | 'female' | 'other',

    // Academic
    usn: '',
    branch: defaults.branch,
    section: defaults.section,
    semester: defaults.semester,
    admissionYear: 2023,
    cgpa: 0,
    attendance: 100,

    // Contact / Other
    parentName: '',
    parentPhone: '',
    address: '',
    bloodGroup: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  // Auto-generate USN like 1GD23CS001
  const generateUSN = () => {
    const seq = nextUSNSequence(existingStudents, form.branch, form.admissionYear);
    return buildUSN(form.branch, form.admissionYear, seq);
  };

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (!form.firstName.trim()) errs.firstName = 'First name is required';
      if (!form.lastName.trim()) errs.lastName = 'Last name is required';
      if (!form.email.trim()) errs.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
      if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Phone must be 10 digits';
    }
    if (s === 2) {
      if (!form.usn.trim()) errs.usn = 'USN is required';
      else if (!/^1GD\d{2}[A-Z]{2}\d{3,4}$/.test(form.usn)) errs.usn = 'Format: 1GD23CS001';
      if (form.cgpa < 0 || form.cgpa > 10) errs.cgpa = 'CGPA must be 0-10';
      if (form.attendance < 0 || form.attendance > 100) errs.attendance = 'Attendance must be 0-100';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      if (step === 1 && !form.usn) updateField('usn', generateUSN());
      setStep(s => (s + 1) as 1 | 2 | 3);
    }
  };

  const back = () => setStep(s => (s - 1) as 1 | 2 | 3);

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const newStudent: StudentRecord = {
      id: `std_new_${Date.now()}`,
      usn: form.usn.toUpperCase(),
      name: fullName,
      branch: form.branch,
      section: form.section,
      semester: form.semester,
      email: form.email.toLowerCase(),
      cgpa: form.cgpa,
      attendance: form.attendance,
      status: 'active',
      lastActive: 'Just now',
      testsCompleted: 0,
      avgScore: 0,
    };
    onAdd(newStudent);
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onCancel}>
      <div
        className="bg-background rounded-lg max-w-xl w-full overflow-hidden border border-border max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with stepper */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold tracking-tight">Add Student</h2>
            <button onClick={onCancel} className="p-1 hover:bg-muted rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2">
            {[
              { n: 1, label: 'Personal' },
              { n: 2, label: 'Academic' },
              { n: 3, label: 'Contact' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${step >= s.n ? 'text-foreground' : 'text-muted-foreground'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono shrink-0 ${
                    step > s.n ? 'bg-foreground text-background' :
                    step === s.n ? 'border-2 border-foreground' :
                    'border border-border'
                  }`}>
                    {step > s.n ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.n}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-px ${step > s.n ? 'bg-foreground' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {step === 1 && (
            <>
              <p className="text-xs text-muted-foreground -mt-2 mb-2">Personal information</p>

              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" required error={errors.firstName}>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Rajesh"
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                    autoFocus
                  />
                </Field>
                <Field label="Last name" required error={errors.lastName}>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Kumar"
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </Field>
              </div>

              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="rajesh.kumar@vtu.edu"
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="9876543210"
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </Field>
                <Field label="Date of birth">
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => updateField('dob', e.target.value)}
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </Field>
              </div>

              <Field label="Gender">
                <div className="flex gap-2">
                  {(['male', 'female', 'other'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateField('gender', g)}
                      className={`px-3 h-9 rounded-md text-sm capitalize border transition-colors ${
                        form.gender === g
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-xs text-muted-foreground -mt-2 mb-2">Academic details</p>

              <Field label="USN" required error={errors.usn} hint="Format: 1GD23CS001 (1GD + year + branch + number)">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.usn}
                    onChange={(e) => updateField('usn', e.target.value.toUpperCase())}
                    placeholder="1GD23CS001"
                    className="flex-1 h-9 px-3 border border-border rounded-md text-sm font-mono uppercase focus:outline-none focus:border-foreground"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateField('usn', generateUSN())}
                    className="h-9"
                  >
                    Auto
                  </Button>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Branch" required>
                  <select
                    value={form.branch}
                    onChange={(e) => updateField('branch', e.target.value as Branch)}
                    className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background focus:outline-none focus:border-foreground"
                  >
                    {BRANCHES.map(b => (
                      <option key={b.code} value={b.code}>{b.code} — {b.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Section" required>
                  <select
                    value={form.section}
                    onChange={(e) => updateField('section', e.target.value as Section)}
                    className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background focus:outline-none focus:border-foreground"
                  >
                    {SECTIONS.map(s => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Current semester" required>
                  <select
                    value={form.semester}
                    onChange={(e) => updateField('semester', Number(e.target.value))}
                    className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background focus:outline-none focus:border-foreground"
                  >
                    {SEMESTERS.map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Admission year">
                  <input
                    type="number"
                    min={2015}
                    max={new Date().getFullYear()}
                    value={form.admissionYear}
                    onChange={(e) => updateField('admissionYear', Number(e.target.value))}
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Current CGPA" error={errors.cgpa}>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={10}
                    value={form.cgpa}
                    onChange={(e) => updateField('cgpa', Number(e.target.value))}
                    placeholder="8.5"
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </Field>
                <Field label="Attendance %" error={errors.attendance}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.attendance}
                    onChange={(e) => updateField('attendance', Number(e.target.value))}
                    placeholder="85"
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-xs text-muted-foreground -mt-2 mb-2">Contact &amp; emergency info</p>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Parent / Guardian name">
                  <input
                    type="text"
                    value={form.parentName}
                    onChange={(e) => updateField('parentName', e.target.value)}
                    placeholder="Suresh Kumar"
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </Field>
                <Field label="Parent phone">
                  <input
                    type="tel"
                    value={form.parentPhone}
                    onChange={(e) => updateField('parentPhone', e.target.value)}
                    placeholder="9876543210"
                    className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </Field>
              </div>

              <Field label="Address">
                <textarea
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  rows={3}
                  placeholder="Permanent address"
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-foreground resize-none"
                />
              </Field>

              <Field label="Blood group">
                <select
                  value={form.bloodGroup}
                  onChange={(e) => updateField('bloodGroup', e.target.value)}
                  className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background focus:outline-none focus:border-foreground"
                >
                  <option value="">Not specified</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>

              {/* Review summary */}
              <div className="mt-6 p-4 bg-muted/40 border border-border rounded-md">
                <p className="text-xs font-medium mb-3 text-muted-foreground uppercase tracking-wider">Review</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{form.firstName} {form.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">USN</p>
                    <p className="font-medium font-mono">{form.usn || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{form.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Branch &amp; Section</p>
                    <p className="font-medium">{form.branch} — Section {form.section}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Semester</p>
                    <p className="font-medium">{form.semester}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">CGPA</p>
                    <p className="font-medium">{form.cgpa || '—'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-between gap-2">
          {step > 1 ? (
            <Button variant="outline" onClick={back}>Back</Button>
          ) : (
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          )}

          {step < 3 ? (
            <Button onClick={next}>
              Continue
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Add Student
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============= Field wrapper =============
function Field({
  label,
  required = false,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium mb-1.5 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
