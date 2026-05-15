'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  Command, 
  GraduationCap, 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  Mail, 
  Lock, 
  User,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

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
      setUsername('student');
      setPassword('student123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  // ROLE SELECTION SCREEN
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          {/* Logo */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-white mb-6">
              <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center">
                <Command className="w-5 h-5" />
              </div>
              <span className="text-xl font-semibold">AdaptLearn</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Welcome back
            </h1>
            <p className="text-zinc-400 text-lg">
              Choose your role to continue
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Card */}
            <button
              onClick={() => setRole('student')}
              className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">I'm a Student</h3>
              <p className="text-zinc-400 mb-4">
                Access your courses, take tests, track progress, and earn certificates.
              </p>
              <ul className="space-y-2 mb-6">
                {['AI-powered study planner', 'Code journal & practice', 'Smart assessments', 'Earn certificates'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="flex items-center text-white font-medium group-hover:gap-3 gap-2 transition-all">
                Continue as Student
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Admin/Teacher Card */}
            <button
              onClick={() => setRole('admin')}
              className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">I'm a Teacher</h3>
              <p className="text-zinc-400 mb-4">
                Manage students, create tests, monitor progress, and analyze performance.
              </p>
              <ul className="space-y-2 mb-6">
                {['Manage all students', 'Create & monitor tests', 'Anti-cheat dashboard', 'Class analytics'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="flex items-center text-white font-medium group-hover:gap-3 gap-2 transition-all">
                Continue as Teacher
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-zinc-500 text-sm">
              New here?{' '}
              <Link href="/register" className="text-white hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // LOGIN FORM SCREEN
  const isStudent = role === 'student';
  
  return (
    <div className={`min-h-screen flex ${isStudent ? 'bg-white' : 'bg-zinc-950'}`}>
      {/* Left Side - Branding */}
      <div className={`hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden ${
        isStudent ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500' : 'bg-gradient-to-br from-zinc-900 via-black to-red-950'
      }`}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>

        <Link href="/" className="relative z-10 flex items-center gap-2 text-white">
          <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-md flex items-center justify-center">
            <Command className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">AdaptLearn</span>
        </Link>

        <div className="relative z-10 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full text-xs mb-6">
            <Sparkles className="w-3 h-3" />
            {isStudent ? 'Student Portal' : 'Teacher Portal'}
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {isStudent 
              ? 'Learn smarter, achieve more.' 
              : 'Empower your students.'}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            {isStudent
              ? 'AI-powered personalized learning that adapts to your pace and style.'
              : 'Comprehensive tools to manage classes and track student progress.'}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white"></div>
              ))}
            </div>
            <p className="text-white/80">
              <span className="font-semibold text-white">1,247+</span> {isStudent ? 'students' : 'teachers'} learning
            </p>
          </div>
        </div>

        <p className="relative z-10 text-white/60 text-xs">
          © 2026 AdaptLearn. All rights reserved.
        </p>
      </div>

      {/* Right Side - Form */}
      <div className={`flex-1 flex items-center justify-center p-8 ${isStudent ? 'bg-white' : 'bg-zinc-950'}`}>
        <div className="w-full max-w-md">
          <button
            onClick={() => setRole(null)}
            className={`flex items-center gap-1 text-sm mb-6 transition-colors ${
              isStudent ? 'text-gray-600 hover:text-gray-900' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-3 h-3" />
            Change role
          </button>

          {/* Logo (mobile) */}
          <div className="lg:hidden mb-6">
            <Link href="/" className={`flex items-center gap-2 ${isStudent ? 'text-gray-900' : 'text-white'}`}>
              <Command className="w-5 h-5" />
              <span className="font-semibold">AdaptLearn</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
              isStudent 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'bg-red-900/20 text-red-300 border border-red-900/30'
            }`}>
              {isStudent ? <GraduationCap className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              {isStudent ? 'Student Login' : 'Teacher Login'}
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isStudent ? 'text-gray-900' : 'text-white'}`}>
              Sign in
            </h1>
            <p className={`text-sm ${isStudent ? 'text-gray-600' : 'text-zinc-400'}`}>
              Enter your credentials to access your {isStudent ? 'student' : 'teacher'} dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className={`text-sm font-medium block mb-1.5 ${isStudent ? 'text-gray-700' : 'text-zinc-300'}`}>
                Username or Email
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isStudent ? 'text-gray-400' : 'text-zinc-500'
                }`} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isStudent ? 'student' : 'admin'}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                    isStudent
                      ? 'bg-white border-gray-200 focus:ring-indigo-200 focus:border-indigo-500'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:ring-red-900 focus:border-red-700 placeholder-zinc-600'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-sm font-medium ${isStudent ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Password
                </label>
                <Link href="#" className={`text-xs hover:underline ${isStudent ? 'text-indigo-600' : 'text-red-400'}`}>
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isStudent ? 'text-gray-400' : 'text-zinc-500'
                }`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                    isStudent
                      ? 'bg-white border-gray-200 focus:ring-indigo-200 focus:border-indigo-500'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:ring-red-900 focus:border-red-700 placeholder-zinc-600'
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-md font-medium text-sm transition-colors disabled:opacity-50 ${
                isStudent
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700'
              }`}
            >
              {loading ? 'Signing in...' : `Sign in as ${isStudent ? 'Student' : 'Teacher'}`}
            </button>

            {/* Demo Credentials */}
            <div className={`p-3 rounded-md border ${
              isStudent 
                ? 'bg-indigo-50/50 border-indigo-100' 
                : 'bg-red-950/20 border-red-900/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium ${isStudent ? 'text-indigo-700' : 'text-red-300'}`}>
                    Demo Credentials
                  </p>
                  <p className={`text-[11px] ${isStudent ? 'text-indigo-600' : 'text-red-400'}`}>
                    {isStudent ? 'student / student123' : 'admin / admin123'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillDemo}
                  className={`text-xs font-medium px-2.5 py-1 rounded ${
                    isStudent
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  Auto Fill
                </button>
              </div>
            </div>
          </form>

          <p className={`text-sm text-center mt-6 ${isStudent ? 'text-gray-600' : 'text-zinc-400'}`}>
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className={`font-medium hover:underline ${isStudent ? 'text-indigo-600' : 'text-red-400'}`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
