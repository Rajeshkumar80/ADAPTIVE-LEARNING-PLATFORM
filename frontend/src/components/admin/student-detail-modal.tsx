'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, GraduationCap, Users, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { StudentRecord } from '@/lib/students-data';

interface StudentDetailModalProps {
  student: StudentRecord;
  onClose: () => void;
  onEdit: (student: StudentRecord) => void;
  onDelete: (usn: string) => void;
}

export default function StudentDetailModal({
  student,
  onClose,
  onEdit,
  onDelete,
}: StudentDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground border border-border shadow-lg rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">Student Details</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold shrink-0">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold tracking-tight truncate">{student.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{student.email}</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">{student.usn}</p>
            </div>
            <Badge
              variant="outline"
              className={
                student.status === 'active'
                  ? 'text-[10px] border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'text-[10px] border-border bg-muted text-muted-foreground'
              }
            >
              {student.status}
            </Badge>
          </div>

          {/* Academic Info Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="text-center p-3 border border-border rounded-lg bg-muted/20">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Branch</p>
              <p className="text-sm font-semibold">{student.branch}</p>
            </div>
            <div className="text-center p-3 border border-border rounded-lg bg-muted/20">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Section</p>
              <p className="text-sm font-semibold">{student.section}</p>
            </div>
            <div className="text-center p-3 border border-border rounded-lg bg-muted/20">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Semester</p>
              <p className="text-sm font-semibold">{student.semester}</p>
            </div>
          </div>

          {/* Progress Metrics */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Metrics</p>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">CGPA</span>
                <span className="text-xs font-semibold font-mono">{student.cgpa.toFixed(2)}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${(student.cgpa / 10) * 100}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Attendance</span>
                <span className="text-xs font-semibold font-mono">{student.attendance}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    student.attendance >= 90 ? 'bg-emerald-500' :
                    student.attendance >= 75 ? 'bg-primary' :
                    'bg-amber-500'
                  }`} 
                  style={{ width: `${student.attendance}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Average Test Score</span>
                <span className="text-xs font-semibold font-mono">{student.avgScore}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${student.avgScore}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Secondary Details */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Tests Completed</p>
                <p className="text-xs font-semibold">{student.testsCompleted}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">Last Active</p>
                <p className="text-xs font-semibold">{student.lastActive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/10">
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => {
              if (confirm(`Are you sure you want to delete student ${student.name}?`)) {
                onDelete(student.usn);
              }
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" onClick={() => onEdit(student)}>
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Edit Student
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
