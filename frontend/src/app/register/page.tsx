'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, GraduationCap, Shield, ArrowRight } from 'lucide-react';

type Role = 'student' | 'admin' | null;

export default function RegisterPage() {
  const [role, setRole] = useState<Role>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    usn: '',
    employee_id: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        usn: formData.usn,
        employee_id: formData.employee_id,
      }, role!);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
                <span className="text-background text-xs font-bold">A</span>
              </div>
              <span className="font-semibold text-sm tracking-tight">AdaptLearn</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl animate-fade-in">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                Get started
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose how you'll use AdaptLearn
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={() => setRole('student')}
                className="group p-6 border border-border rounded-lg text-left hover:border-foreground transition-all hover:shadow-sm"
              >
                <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors">
                  <GraduationCap className="w-5 h-5 group-hover:text-background transition-colors" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-1">I'm a Student</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  For VTU students who want to excel in their studies.
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  Sign up as student
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>

              <button
                onClick={() => setRole('admin')}
                className="group p-6 border border-border rounded-lg text-left hover:border-foreground transition-all hover:shadow-sm"
              >
                <div className="w-9 h-9 bg-muted rounded-md flex items-center justify-center mb-4 group-hover:bg-foreground transition-colors">
                  <Shield className="w-5 h-5 group-hover:text-background transition-colors" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-1">I'm a Teacher</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  For educators managing classes and assessments.
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  Sign up as teacher
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{' '}
              <Link href="/login" className="text-foreground font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  const isStudent = role === 'student';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background text-xs font-bold">A</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">AdaptLearn</span>
          </Link>
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Change role
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-4 bg-muted rounded text-[11px] text-muted-foreground">
              {isStudent ? <GraduationCap className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              {isStudent ? 'Student' : 'Teacher'}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1">
              Create account
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-medium block mb-1.5">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@vtu.edu"
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>
            </div>

            {isStudent ? (
              <div>
                <label className="text-xs font-medium block mb-1.5">USN</label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  placeholder="1MS21CS001"
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-medium block mb-1.5">Employee ID</label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  placeholder="EMP001"
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Confirm</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 mt-2 bg-foreground text-background rounded-md font-medium text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-foreground font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
