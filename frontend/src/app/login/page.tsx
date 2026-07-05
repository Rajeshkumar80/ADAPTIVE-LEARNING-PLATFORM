'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
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
      await login(username, password, 'student');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setUsername('1GD23CS001');
    setPassword('student123');
  };

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
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8">
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
                placeholder="e.g. 1GD23CS001"
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
                  <p className="text-[11px] text-muted-foreground font-mono">1GD23CS001 / student123</p>
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

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-foreground font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
