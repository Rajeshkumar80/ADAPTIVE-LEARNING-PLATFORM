'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Command, Github } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      // Demo: allow login for demo purposes
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Command className="w-5 h-5" />
          <span className="font-semibold">AdaptLearn</span>
        </Link>
        <div>
          <p className="text-2xl font-medium leading-relaxed">
            "AdaptLearn has transformed how I prepare for exams. The AI tutor and adaptive scheduling have boosted my scores significantly."
          </p>
          <p className="text-sm text-gray-400 mt-4">— Sneha Reddy, VTU Student</p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Command className="w-5 h-5" />
              <span className="font-semibold">AdaptLearn</span>
            </Link>
          </div>

          <h1 className="text-2xl font-semibold mb-2">Sign in to your account</h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter your credentials below to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-xs text-gray-600 hover:text-gray-900">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md font-medium text-sm hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full border py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-gray-900 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          {/* Quick demo access */}
          <div className="mt-6 p-3 bg-gray-50 rounded-md border">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick Demo Access:</p>
            <div className="flex gap-2">
              <Link href="/dashboard" className="flex-1 text-center text-xs px-3 py-1.5 border bg-white rounded-md hover:bg-gray-100">
                Student Demo
              </Link>
              <Link href="/admin" className="flex-1 text-center text-xs px-3 py-1.5 border bg-white rounded-md hover:bg-gray-100">
                Admin Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
