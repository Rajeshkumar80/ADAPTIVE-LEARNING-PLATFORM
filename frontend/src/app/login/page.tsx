'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowLeft, GraduationCap, Shield, ArrowRight } from 'lucide-react';

type Role = 'student' | 'admin' | null;

export default function LoginPage() {
  const [role, setRole] = useState<Role>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password, role!);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    if (role === 'student') {
      setUsername('1GD23CS001');
      setPassword('student123');
    } else {
      setUsername('admin@gcem.edu');
      setPassword('admin123');
    }
  };

  // Role Selection
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
                Welcome
              </h1>
              <p className="text-sm text-muted-foreground">
                Choose your role to continue
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
                <h3 className="text-base font-semibold tracking-tight mb-1">Student</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Access courses, take tests, and earn certificates.
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  Continue
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
                <h3 className="text-base font-semibold tracking-tight mb-1">Teacher</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Manage classes, create tests, and track student progress.
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium">
                  Continue
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Login Form
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
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-4 bg-muted rounded text-[11px] text-muted-foreground">
              {isStudent ? <GraduationCap className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              {isStudent ? 'Student' : 'Teacher'}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mb-1">Sign in</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-medium block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isStudent ? '1GD23CS001' : 'admin@gcem.edu'}
                className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-9 mt-2 bg-foreground text-background rounded-md font-medium text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="mt-6 p-3 bg-muted/40 border border-border rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium">Demo Account</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    {isStudent ? '1GD23CS001 / student123' : 'admin@gcem.edu / admin123'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="h-7 px-2.5 text-xs font-medium border border-border bg-background hover:bg-muted rounded transition-colors"
                >
                  Use
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
