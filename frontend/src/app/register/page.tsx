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
  Sparkles,
  CheckCircle2
} from 'lucide-react';

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

  // ROLE SELECTION
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-white mb-6">
              <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center">
                <Command className="w-5 h-5" />
              </div>
              <span className="text-xl font-semibold">AdaptLearn</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Get started for free
            </h1>
            <p className="text-zinc-400 text-lg">
              Choose how you want to use AdaptLearn
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => setRole('student')}
              className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Sign up as Student</h3>
              <p className="text-zinc-400 mb-4">
                For VTU students who want to excel in their studies.
              </p>
              <ul className="space-y-2 mb-6">
                {['Personalized study plans', 'Practice tests & journal', 'Earn certificates', 'AI tutor support'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="flex items-center text-white font-medium gap-2 group-hover:gap-3 transition-all">
                Get started
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => setRole('admin')}
              className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all text-left"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Sign up as Teacher</h3>
              <p className="text-zinc-400 mb-4">
                For educators managing classes and assessments.
              </p>
              <ul className="space-y-2 mb-6">
                {['Create unlimited tests', 'Manage students', 'Anti-cheat tools', 'Class analytics'].map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {feat}
                  </li>
                ))}
              </ul>
              <div className="flex items-center text-white font-medium gap-2 group-hover:gap-3 transition-all">
                Get started
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-zinc-500 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isStudent = role === 'student';

  return (
    <div className={`min-h-screen flex ${isStudent ? 'bg-white' : 'bg-zinc-950'}`}>
      <div className={`hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative overflow-hidden ${
        isStudent ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500' : 'bg-gradient-to-br from-zinc-900 via-black to-red-950'
      }`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rounded-full"></div>
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
            Join AdaptLearn
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {isStudent ? 'Start your learning journey today' : 'Transform how you teach'}
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            {isStudent
              ? 'Join thousands of VTU students who are achieving their academic goals.'
              : 'Empower your students with AI-powered tools and analytics.'}
          </p>
        </div>

        <p className="relative z-10 text-white/60 text-xs">© 2026 AdaptLearn</p>
      </div>

      <div className={`flex-1 flex items-center justify-center p-8 overflow-y-auto ${isStudent ? 'bg-white' : 'bg-zinc-950'}`}>
        <div className="w-full max-w-md py-8">
          <button
            onClick={() => setRole(null)}
            className={`flex items-center gap-1 text-sm mb-6 transition-colors ${
              isStudent ? 'text-gray-600 hover:text-gray-900' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-3 h-3" />
            Change role
          </button>

          <div className="mb-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
              isStudent ? 'bg-indigo-50 text-indigo-700' : 'bg-red-900/20 text-red-300 border border-red-900/30'
            }`}>
              {isStudent ? <GraduationCap className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              {isStudent ? 'Student Registration' : 'Teacher Registration'}
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isStudent ? 'text-gray-900' : 'text-white'}`}>
              Create account
            </h1>
            <p className={`text-sm ${isStudent ? 'text-gray-600' : 'text-zinc-400'}`}>
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className={`text-sm font-medium block mb-1.5 ${isStudent ? 'text-gray-700' : 'text-zinc-300'}`}>
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  isStudent
                    ? 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500'
                    : 'bg-zinc-900 border-zinc-800 text-white focus:ring-2 focus:ring-red-900 focus:border-red-700 placeholder-zinc-600'
                }`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-sm font-medium block mb-1.5 ${isStudent ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@vtu.edu"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isStudent
                      ? 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-200'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:ring-2 focus:ring-red-900 placeholder-zinc-600'
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1.5 ${isStudent ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isStudent
                      ? 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-200'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:ring-2 focus:ring-red-900 placeholder-zinc-600'
                  }`}
                  required
                />
              </div>
            </div>

            {isStudent ? (
              <div>
                <label className="text-sm font-medium block mb-1.5 text-gray-700">USN</label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  placeholder="1MS21CS001"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium block mb-1.5 text-zinc-300">Employee ID</label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  placeholder="EMP001"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-md text-sm focus:ring-2 focus:ring-red-900 placeholder-zinc-600"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-sm font-medium block mb-1.5 ${isStudent ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isStudent
                      ? 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-200'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:ring-2 focus:ring-red-900 placeholder-zinc-600'
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`text-sm font-medium block mb-1.5 ${isStudent ? 'text-gray-700' : 'text-zinc-300'}`}>
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    isStudent
                      ? 'bg-white border-gray-200 focus:ring-2 focus:ring-indigo-200'
                      : 'bg-zinc-900 border-zinc-800 text-white focus:ring-2 focus:ring-red-900 placeholder-zinc-600'
                  }`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-md font-medium text-sm transition-colors disabled:opacity-50 mt-4 ${
                isStudent
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700'
              }`}
            >
              {loading ? 'Creating...' : `Create ${isStudent ? 'Student' : 'Teacher'} Account`}
            </button>
          </form>

          <p className={`text-sm text-center mt-6 ${isStudent ? 'text-gray-600' : 'text-zinc-400'}`}>
            Already have an account?{' '}
            <Link href="/login" className={`font-medium hover:underline ${isStudent ? 'text-indigo-600' : 'text-red-400'}`}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
