'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { StudentRecord } from '@/lib/students-data';

interface StudentListDialogProps {
  type: 'active' | 'top' | 'risk' | 'avg';
  students: StudentRecord[];
  onClose: () => void;
  onSelect: (s: StudentRecord) => void;
}

export default function StudentListDialog({
  type,
  students,
  onClose,
  onSelect,
}: StudentListDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const config = {
    active: { title: 'Active Students', filter: (s: StudentRecord) => s.status === 'active', color: 'text-green-700' },
    top: { title: 'Top Performers', filter: (s: StudentRecord) => s.cgpa >= 9.0, color: 'text-primary' },
    risk: { title: 'At Risk Students', filter: (s: StudentRecord) => s.cgpa < 6.0 || s.attendance < 75, color: 'text-amber-700' },
    avg: { title: 'All Students by CGPA', filter: () => true, color: 'text-primary' },
  }[type];

  let list = students.filter(config.filter);
  if (type === 'top' || type === 'avg') list = [...list].sort((a, b) => b.cgpa - a.cgpa);
  if (type === 'risk') list = [...list].sort((a, b) => a.cgpa - b.cgpa);

  const dialogContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground border border-border shadow-lg rounded-xl w-full max-w-lg max-h-[75vh] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold">{config.title}</h2>
            <p className="text-xs text-muted-foreground">{list.length} students</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No students in this category</p>
          ) : (
            list.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onSelect(s)}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors text-left"
              >
                <span className="text-xs text-muted-foreground font-mono w-6 shrink-0">{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold shrink-0">
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{s.usn} · Sec {s.section}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${config.color}`}>
                    {type === 'risk' ? `${s.attendance}%` : s.cgpa.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {type === 'risk' ? 'attendance' : 'CGPA'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
