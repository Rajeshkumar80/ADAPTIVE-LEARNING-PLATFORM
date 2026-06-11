'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { StudentRecord, Branch, Section } from '@/lib/students-data';

interface AddStudentModalProps {
  student?: StudentRecord | null; // If provided, we are editing
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function AddStudentModal({
  student,
  onSave,
  onCancel,
}: AddStudentModalProps) {
  const [mounted, setMounted] = useState(false);
  const isEdit = !!student;

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    usn: '',
    branch: 'CSE' as Branch,
    section: 'A' as Section,
    semester: 6,
    cgpa: 0.0,
    password: '',
    status: 'active' as 'active' | 'inactive',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        username: student.usn.toLowerCase(),
        usn: student.usn,
        branch: student.branch,
        section: student.section,
        semester: student.semester,
        cgpa: student.cgpa,
        password: '',
        status: student.status,
      });
    }
    return () => setMounted(false);
  }, [student]);

  if (!mounted) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let nextValue: any = value;
    if (name === 'semester') nextValue = parseInt(value) || 6;
    if (name === 'cgpa') nextValue = parseFloat(value) || 0.0;
    
    setForm(prev => {
      const updated = { ...prev, [name]: nextValue };
      // Auto-populate email & username based on USN when creating
      if (!isEdit && name === 'usn') {
        const cleanUSN = value.trim().toLowerCase();
        updated.username = cleanUSN;
        updated.email = cleanUSN ? `${cleanUSN}@gcem.edu` : '';
      }
      return updated;
    });

    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Invalid email address';
    }

    if (!form.username.trim()) errs.username = 'Username is required';
    
    if (!form.usn.trim()) {
      errs.usn = 'USN is required';
    } else if (!/^1GD\d{2}[A-Z]{2}\d{3,4}$/i.test(form.usn.trim())) {
      errs.usn = 'Invalid VTU USN format (e.g. 1GD23CS001)';
    }

    if (form.cgpa < 0 || form.cgpa > 10) errs.cgpa = 'CGPA must be between 0.0 and 10.0';

    if (!isEdit && form.password && form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      usn: form.usn.trim().toUpperCase(),
      username: form.username.trim().toLowerCase(),
      email: form.email.trim().toLowerCase(),
    });
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-card text-card-foreground border border-border shadow-lg rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">
            {isEdit ? 'Edit Student Details' : 'Add New Student'}
          </h2>
          <button type="button" onClick={onCancel} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Fields */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* USN Field */}
          <div>
            <label className="text-xs font-semibold block mb-1 text-muted-foreground">USN</label>
            <input
              type="text"
              name="usn"
              value={form.usn}
              onChange={handleInputChange}
              disabled={isEdit}
              placeholder="1GD23CS001"
              className={`w-full h-9 px-3 border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none transition-colors ${
                errors.usn ? 'border-destructive focus:border-destructive' : 'border-border focus:border-foreground'
              } ${isEdit ? 'bg-muted/50 cursor-not-allowed' : 'bg-background'}`}
              required
            />
            {errors.usn && <p className="text-[10px] text-destructive mt-0.5">{errors.usn}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold block mb-1 text-muted-foreground">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Aishwarya R"
              className={`w-full h-9 px-3 bg-background border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors ${
                errors.name ? 'border-destructive' : 'border-border'
              }`}
              required
            />
            {errors.name && <p className="text-[10px] text-destructive mt-0.5">{errors.name}</p>}
          </div>

          {/* Email and Username */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleInputChange}
                placeholder="1gd23cs001"
                className={`w-full h-9 px-3 bg-background border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors ${
                  errors.username ? 'border-destructive' : 'border-border'
                }`}
                required
              />
              {errors.username && <p className="text-[10px] text-destructive mt-0.5">{errors.username}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="student@gcem.edu"
                className={`w-full h-9 px-3 bg-background border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors ${
                  errors.email ? 'border-destructive' : 'border-border'
                }`}
                required
              />
              {errors.email && <p className="text-[10px] text-destructive mt-0.5">{errors.email}</p>}
            </div>
          </div>

          {/* Password (only optional/required on create) */}
          {!isEdit && (
            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground">
                Password <span className="text-[10px] font-normal text-muted-foreground">(defaults to lowercase USN if empty)</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full h-9 px-3 bg-background border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors ${
                  errors.password ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.password && <p className="text-[10px] text-destructive mt-0.5">{errors.password}</p>}
            </div>
          )}

          {/* Academic Selectors */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground">Branch</label>
              <select
                name="branch"
                value={form.branch}
                onChange={handleInputChange}
                className="w-full h-9 px-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
              >
                <option value="CSE">CSE</option>
                <option value="ISE">ISE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground">Section</label>
              <select
                name="section"
                value={form.section}
                onChange={handleInputChange}
                className="w-full h-9 px-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground">Semester</label>
              <select
                name="semester"
                value={form.semester}
                onChange={handleInputChange}
                className="w-full h-9 px-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Sem {sem}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CGPA and Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground">CGPA</label>
              <input
                type="number"
                name="cgpa"
                step="0.01"
                min="0"
                max="10"
                value={form.cgpa || ''}
                onChange={handleInputChange}
                placeholder="8.50"
                className={`w-full h-9 px-3 bg-background border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors ${
                  errors.cgpa ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.cgpa && <p className="text-[10px] text-destructive mt-0.5">{errors.cgpa}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full h-9 px-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/10">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            <Check className="w-3.5 h-3.5 mr-1" />
            {isEdit ? 'Save Changes' : 'Create Student'}
          </Button>
        </div>
      </form>
    </div>
  );

  return createPortal(modalContent, document.body);
}
