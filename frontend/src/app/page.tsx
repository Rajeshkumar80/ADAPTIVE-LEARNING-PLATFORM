'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ArrowRight, Sparkles, Github } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background text-xs font-bold">A</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">AdaptLearn</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="h-8 px-3 inline-flex items-center text-xs font-medium hover:bg-muted rounded-md transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="h-8 px-3.5 inline-flex items-center text-xs font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-20 text-center animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-8 border border-border rounded-full text-[11px] text-muted-foreground bg-muted/30">
          <Sparkles className="w-3 h-3" />
          AI-powered learning for VTU students
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter mb-6 leading-[1.05]">
          Learn smarter,
          <br />
          <span className="text-muted-foreground">achieve more.</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
          A simple, intelligent platform that adapts to how you learn. Personalized study plans, 
          smart assessments, and AI tutoring—designed for students who want to excel.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/login"
            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors"
          >
            Start learning
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/login"
            className="h-10 px-5 inline-flex items-center justify-center text-sm font-medium border border-border hover:bg-muted rounded-md transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Everything you need</h2>
          <p className="text-sm text-muted-foreground">Core features designed to elevate your learning</p>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-border rounded-lg overflow-hidden border border-border">
          {[
            { title: 'Smart Subjects', description: 'AI-curated content tailored to your learning pace and style.' },
            { title: 'VTU Integration', description: 'Complete CSE 22 Scheme subjects with CO/PO mapping.' },
            { title: 'Adaptive Tests', description: 'Smart assessments that adjust to your level in real-time.' },
            { title: 'AI Tutor', description: 'Get instant help on any topic, available 24/7.' },
            { title: 'Study Planner', description: 'Smart scheduler that learns your patterns.' },
            { title: 'Achievements', description: 'Earn certificates and badges as you progress.' },
          ].map((feature) => (
            <div key={feature.title} className="bg-background p-8 hover:bg-muted/30 transition-colors">
              <h3 className="text-base font-semibold tracking-tight mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">How it works</h2>
          <p className="text-sm text-muted-foreground">Four simple steps</p>
        </div>
        <div className="space-y-6">
          {[
            { step: '01', title: 'Sign up', desc: 'Create your account in seconds.' },
            { step: '02', title: 'Diagnostic test', desc: 'Quick assessment to understand your current knowledge.' },
            { step: '03', title: 'Personalized plan', desc: 'AI generates a custom study schedule for you.' },
            { step: '04', title: 'Learn & adapt', desc: 'The plan evolves based on your progress every day.' },
          ].map((s) => (
            <div key={s.step} className="flex gap-5">
              <div className="text-3xl font-semibold tracking-tighter text-muted-foreground/40 shrink-0 w-12">
                {s.step}
              </div>
              <div>
                <h3 className="font-semibold tracking-tight mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">Ready to start?</h2>
        <p className="text-sm text-muted-foreground mb-8">Join thousands of students learning smarter every day.</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/login"
            className="h-10 px-5 inline-flex items-center justify-center gap-1.5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors"
          >
            Create free account
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/login"
            className="h-10 px-5 inline-flex items-center justify-center text-sm font-medium border border-border hover:bg-muted rounded-md transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
          <p>&copy; 2026 AdaptLearn</p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Github className="w-3 h-3" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
