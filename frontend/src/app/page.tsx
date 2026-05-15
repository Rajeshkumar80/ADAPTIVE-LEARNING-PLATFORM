'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Command, Sparkles, BookOpen, Code2, GraduationCap, BarChart3, ArrowRight, Github } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Command className="w-5 h-5" />
            <span className="font-semibold">AdaptLearn</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <Link href="/courses" className="hover:text-gray-900">Courses</Link>
            <Link href="/admin" className="hover:text-gray-900">Admin</Link>
            <a href="#features" className="hover:text-gray-900">Features</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-md">
              <Github className="w-4 h-4" />
            </a>
            <Link href="/login" className="px-4 py-1.5 text-sm border rounded-md hover:bg-gray-50">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs text-gray-600 mb-6">
          <Sparkles className="w-3 h-3" />
          AI-powered adaptive learning
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
          Learn smarter,
          <br />
          not harder.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          AI-powered adaptive learning platform for VTU students. Personalized study plans, smart assessments, and intelligent tutoring.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 inline-flex items-center justify-center gap-2"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border rounded-md font-medium hover:bg-gray-50 inline-flex items-center justify-center"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 border-t">
        <h2 className="text-3xl font-semibold mb-12 text-center">Everything you need</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, title: 'Smart Courses', description: 'AI-curated content tailored to your learning pace' },
            { icon: Code2, title: 'Code Journal', description: 'Document and track your coding journey' },
            { icon: GraduationCap, title: 'Adaptive Tests', description: 'Smart assessments that adjust to your level' },
            { icon: BarChart3, title: 'Analytics', description: 'Detailed insights into your progress' },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-semibold mb-4">Ready to get started?</h2>
        <p className="text-gray-600 mb-8">Join thousands of students learning smarter every day.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800"
        >
          Create Free Account
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4" />
            <span className="text-sm">AdaptLearn © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
