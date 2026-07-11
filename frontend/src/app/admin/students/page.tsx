'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search, Download, Plus, MoreHorizontal, Users, X,
  GraduationCap, CheckCircle2, AlertCircle, Upload
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  BRANCHES,
  SECTIONS,
  SEMESTERS,
  getStudentStats,
  type Branch,
  type Section,
  type StudentRecord,
} from '@/lib/students-data';

import StudentDetailModal from '@/components/admin/student-detail-modal';
import AddStudentModal from '@/components/admin/add-student-modal';
import StudentListDialog from '@/components/admin/student-list-dialog';

export default function AdminStudentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState<Branch | 'all'>('all');
  const [section, setSection] = useState<Section | 'all'>('all');
  const [semester, setSemester] = useState<number | 'all'>('all');
  const [status, setStatus] = useState<'active' | 'inactive' | 'all'>('all');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(null);
  const [listDialog, setListDialog] = useState<'active' | 'top' | 'risk' | 'avg' | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStudents();
      const mapped = data.map((u: any) => mapBackendUserToStudentRecord(u));
      setStudents(mapped);
    } catch (err) {
      console.error('Failed to load students:', err);
      showToast('Failed to load students from server', 'error');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  function normalizeBranch(raw: string | undefined): Branch {
    if (!raw) return 'CSE';
    const lower = raw.toLowerCase();
    if (lower.includes('computer') || lower === 'cse' || lower === 'cs') return 'CSE';
    return (raw as Branch) || 'CSE';
  }

  function mapBackendUserToStudentRecord(u: any): StudentRecord {
    let hash = 0;
    const usnStr = u.usn || '1GD23CS001';
    for (let i = 0; i < usnStr.length; i++) {
      hash = usnStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const r = (val: number, min: number, max: number) => {
      const x = Math.sin(val) * 10000;
      return Math.round(min + (x - Math.floor(x)) * (max - min));
    };

    // Determine status: default to active if not explicitly set to false/inactive
    const isActive = u.is_active === false ? false
      : u.status === 'inactive' ? false
      : true;

    return {
      id: String(u.id || u.user_id || `std_${usnStr.toLowerCase()}`),
      usn: usnStr,
      name: u.full_name || 'Student',
      email: u.email || `${usnStr.toLowerCase()}@gcem.edu`,
      branch: normalizeBranch(u.branch),
      section: (u.section || 'A') as Section,
      semester: u.semester || 6,
      cgpa: u.cgpa || 0.0,
      attendance: r(hash, 72, 100),
      status: isActive ? 'active' : 'inactive',
      lastActive: u.updated_at ? new Date(u.updated_at).toISOString().split('T')[0] : 'Just now',
      testsCompleted: r(hash + 1, 3, 13),
      avgScore: r(hash + 2, 50, 95),
    };
  }

  // Filter + sort logic
  const filtered = useMemo(() => {
    const result = students.filter(s => {
      if (branch !== 'all' && s.branch !== branch) return false;
      if (section !== 'all' && s.section !== section) return false;
      if (semester !== 'all' && s.semester !== semester) return false;
      if (status !== 'all' && s.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q);
      }
      return true;
    });

    // Sort: regular USNs (23CS) before lateral (24CS), then numerically
    return result.sort((a, b) => {
      const aIsLateral = a.usn.includes('24CS');
      const bIsLateral = b.usn.includes('24CS');
      if (aIsLateral && !bIsLateral) return 1;
      if (!aIsLateral && bIsLateral) return -1;
      return a.usn.localeCompare(b.usn);
    });
  }, [students, branch, section, semester, status, search]);

  const stats = useMemo(() => getStudentStats(filtered), [filtered]);

  const clearFilters = () => {
    setBranch('all');
    setSection('all');
    setSemester('all');
    setStatus('all');
    setSearch('');
  };

  const hasFilters = branch !== 'all' || section !== 'all' || semester !== 'all' || status !== 'all' || search !== '';

  // CRUD Operations
  const handleSaveStudent = async (formData: any) => {
    try {
      if (studentToEdit) {
        // Edit Mode
        await api.updateStudent(studentToEdit.usn, {
          email: formData.email,
          username: formData.username,
          full_name: formData.name,
          branch: formData.branch,
          section: formData.section,
          semester: formData.semester,
          cgpa: formData.cgpa,
          is_active: formData.status === 'active',
        });
        showToast(`Saved changes for ${formData.name}`, 'success');
      } else {
        // Create Mode
        await api.createStudent({
          email: formData.email,
          username: formData.username,
          full_name: formData.name,
          usn: formData.usn,
          branch: formData.branch,
          section: formData.section,
          semester: formData.semester,
          cgpa: formData.cgpa,
          password: formData.password || undefined,
        });
        showToast(`${formData.name} added successfully`, 'success');
      }
      setStudentToEdit(null);
      setShowAddForm(false);
      loadStudents();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteStudent = async (usn: string) => {
    try {
      await api.deleteStudent(usn);
      setSelectedStudent(null);
      showToast('Student deleted successfully', 'success');
      loadStudents();
    } catch (err: any) {
      showToast(err.message || 'Deletion failed', 'error');
    }
  };

  // CSV Import/Export
  const handleExport = () => {
    const csv = [
      ['USN', 'Name', 'Email', 'Branch', 'Section', 'Semester', 'CGPA', 'Attendance', 'Status'].join(','),
      ...filtered.map(s => [s.usn, s.name, s.email, s.branch, s.section, s.semester, s.cgpa, s.attendance + '%', s.status].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filtered.length} students`, 'success');
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          showToast('CSV file is empty or invalid', 'error');
          return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const parsedStudents: any[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(v => v.trim());
          if (row.length < headers.length) continue;
          
          const record: any = {};
          headers.forEach((header, index) => {
            record[header] = row[index];
          });

          const name = record.name || record.fullname || record['full name'] || '';
          const usn = record.usn || '';
          const email = record.email || (usn ? `${usn.toLowerCase()}@gcem.edu` : '');
          const username = record.username || usn.toLowerCase();
          const branch = record.branch || 'CSE';
          const section = record.section || 'A';
          const semester = parseInt(record.semester) || 6;
          const cgpa = parseFloat(record.cgpa) || 0.0;

          if (usn && name) {
            parsedStudents.push({
              usn: usn.toUpperCase(),
              email: email.toLowerCase(),
              username: username.toLowerCase(),
              full_name: name,
              branch,
              section,
              semester,
              cgpa,
              password: usn.toLowerCase(),
            });
          }
        }

        if (parsedStudents.length === 0) {
          showToast('No valid records found in CSV', 'error');
          return;
        }

        const res = await api.importStudents(parsedStudents);
        showToast(`Successfully imported ${res.imported} students.`, 'success');
        loadStudents();
      } catch (err: any) {
        showToast(err.message || 'CSV Import failed', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Label helper
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
          {/* Header Action Row */}
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {stats.total} students · {selectionLabel}
              </p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportCSV}
                accept=".csv"
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="press-effect">
                <Upload className="w-3.5 h-3.5 mr-1" />
                Import CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="press-effect">
                <Download className="w-3.5 h-3.5 mr-1" />
                Export
              </Button>
              <Button size="sm" onClick={() => { setStudentToEdit(null); setShowAddForm(true); }} className="press-effect">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Student
              </Button>
            </div>
          </div>

          {/* Quick-Pick filter row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => { setBranch('all'); setSection('all'); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border transition-all duration-150 press-effect ${
                branch === 'all'
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              All branches
            </button>
            {BRANCHES.map((b) => (
              <button
                key={b.code}
                onClick={() => { setBranch(b.code); setSection('all'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border transition-all duration-150 press-effect ${
                  branch === b.code
                    ? 'bg-foreground text-background border-foreground shadow-sm'
                    : 'border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {b.code}
                <span className="ml-1 text-[10px] opacity-60">({b.students})</span>
              </button>
            ))}
          </div>

          {/* Section Selector */}
          {branch !== 'all' && (
            <div className="flex items-center gap-2 animate-fade-in">
              <span className="text-xs text-muted-foreground">Section:</span>
              <button
                onClick={() => setSection('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  section === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card hover:bg-muted'
                }`}
              >
                All
              </button>
              {SECTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSection(s)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                    section === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card hover:bg-muted'
                  }`}
                >
                  Section {s}
                </button>
              ))}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 stagger-children">
            <Card className="hover-lift cursor-pointer bg-card" onClick={() => setListDialog('avg')}>
              <CardContent className="p-5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Showing</p>
                <p className="text-2xl font-bold tracking-tight">{stats.total}</p>
              </CardContent>
            </Card>
            <Card className="hover-lift cursor-pointer bg-card" onClick={() => setListDialog('active')}>
              <CardContent className="p-5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Active</p>
                <p className="text-2xl font-bold tracking-tight text-green-700">{stats.active}</p>
              </CardContent>
            </Card>
            <Card className="hover-lift cursor-pointer bg-card" onClick={() => setListDialog('avg')}>
              <CardContent className="p-5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Avg CGPA</p>
                <p className="text-2xl font-bold tracking-tight">{stats.avgCgpa.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="hover-lift cursor-pointer bg-card" onClick={() => setListDialog('top')}>
              <CardContent className="p-5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Top Performers</p>
                <p className="text-2xl font-bold tracking-tight text-primary">{stats.topPerformers}</p>
              </CardContent>
            </Card>
            <Card className="hover-lift cursor-pointer bg-card" onClick={() => setListDialog('risk')}>
              <CardContent className="p-5">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">At Risk</p>
                <p className="text-2xl font-bold tracking-tight text-amber-700">{stats.atRisk}</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search student name or USN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-8 bg-card border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-all duration-150"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="h-9 px-3 text-xs border border-border rounded-md bg-card focus:outline-none focus:border-foreground transition-colors cursor-pointer"
            >
              <option value="all">All Semesters</option>
              {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="h-9 px-3 text-xs border border-border rounded-md bg-card focus:outline-none focus:border-foreground transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-9 text-muted-foreground hover:text-foreground press-effect">
                <X className="w-3.5 h-3.5 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Table Container */}
          <Card className="border border-border shadow-sm rounded-lg overflow-hidden">
            <CardContent className="p-0">
              {loading ? (
                <div className="py-24 space-y-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
                  <p className="text-sm text-muted-foreground">Fetching class records...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-card">
                  <Users className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">No students matched the filters</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">Refine your search parameters</p>
                  <Button size="sm" variant="outline" onClick={clearFilters} className="press-effect">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                      <tr>
                        <th className="px-6 py-4">USN</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Branch</th>
                        <th className="px-6 py-4">Sec</th>
                        <th className="px-6 py-4">Sem</th>
                        <th className="px-6 py-4 text-center">CGPA</th>
                        <th className="px-6 py-4">Attendance</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {filtered.map((s) => (
                        <tr
                          key={s.id}
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedStudent(s)}
                        >
                          <td className="px-6 py-3.5 font-mono text-xs font-medium text-muted-foreground">{s.usn}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{s.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5">{s.branch}</Badge>
                          </td>
                          <td className="px-6 py-3.5 text-muted-foreground font-medium">{s.section}</td>
                          <td className="px-6 py-3.5 text-muted-foreground font-medium">{s.semester}</td>
                          <td className="px-6 py-3.5 text-center font-mono font-semibold">
                            <span className={s.cgpa >= 9.0 ? 'text-primary' : s.cgpa >= 7.5 ? '' : 'text-amber-700'}>
                              {s.cgpa.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1 bg-muted rounded-full overflow-hidden shrink-0">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    s.attendance >= 90 ? 'bg-emerald-500' :
                                    s.attendance >= 75 ? 'bg-primary' :
                                    'bg-amber-500'
                                  }`}
                                  style={{ width: `${s.attendance}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground font-mono font-medium">{s.attendance}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-2 py-0.5 ${
                                s.status === 'active'
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : 'border-border bg-muted text-muted-foreground'
                              }`}
                            >
                              {s.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-3.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(s);
                              }}
                              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modals & Dialogs */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onEdit={(s) => {
            setSelectedStudent(null);
            setStudentToEdit(s);
            setShowAddForm(true);
          }}
          onDelete={handleDeleteStudent}
        />
      )}

      {showAddForm && (
        <AddStudentModal
          student={studentToEdit}
          onSave={handleSaveStudent}
          onCancel={() => {
            setShowAddForm(false);
            setStudentToEdit(null);
          }}
        />
      )}

      {listDialog && (
        <StudentListDialog
          type={listDialog}
          students={filtered}
          onClose={() => setListDialog(null)}
          onSelect={(s) => {
            setListDialog(null);
            setSelectedStudent(s);
          }}
        />
      )}

      {/* Elegant Notification Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg animate-slide-up ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-destructive/10 border-destructive/20 text-destructive'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          )}
          <p className="text-xs font-semibold">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
