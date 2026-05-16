'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  BookOpen,
  Code2,
  GraduationCap,
  Calendar,
  Trophy,
  Award,
  ShieldCheck,
  Target,
  Sparkles,
  BarChart3,
  Users,
  Zap,
  CheckCircle2,
  Github,
} from 'lucide-react';

export default function LearnMorePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const goHome = () => {
    if (isAuthenticated && user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      router.push('/');
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI Tutor',
      description: 'Powered by GPT-4 with RAG (Retrieval-Augmented Generation) over your study material. Get instant, contextual answers to any question.',
      tech: ['OpenAI GPT-4', 'LangChain', 'Pinecone Vector DB'],
    },
    {
      icon: Calendar,
      title: 'Adaptive Scheduler',
      description: 'Reinforcement learning model (DQN) personalizes your study schedule based on your performance, focus patterns, and the Ebbinghaus forgetting curve.',
      tech: ['PyTorch', 'Deep Q-Networks', 'Bayesian Knowledge Tracing'],
    },
    {
      icon: GraduationCap,
      title: 'Smart Assessments',
      description: 'Tests adapt difficulty in real-time. Question randomization, anti-cheat monitoring, and instant grading.',
      tech: ['Tab-switch detection', 'Copy-paste blocking', '3-strike auto-submit'],
    },
    {
      icon: Code2,
      title: 'Code Journal',
      description: 'Document your coding journey with syntax-highlighted snippets, tags, and version history.',
      tech: ['Monaco Editor', 'Multi-language support', 'Markdown notes'],
    },
    {
      icon: Target,
      title: 'Topic Mastery Tracking',
      description: 'Bayesian knowledge tracing combined with the Ebbinghaus forgetting curve to know exactly what you know — and when you\'ll forget it.',
      tech: ['Probabilistic models', 'Spaced repetition', 'Real-time updates'],
    },
    {
      icon: Award,
      title: 'Certificates & Achievements',
      description: 'Earn verifiable certificates and unlock achievements as you progress. Share them on LinkedIn or your resume.',
      tech: ['PDF generation', 'Shareable URLs', 'Verifiable credentials'],
    },
  ];

  const techStack = [
    {
      category: 'Frontend',
      items: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Recharts', 'shadcn/ui', 'Framer Motion'],
    },
    {
      category: 'Backend',
      items: ['FastAPI', 'Python 3.11+', 'SQLAlchemy', 'JWT Auth', 'bcrypt', 'Pydantic v2'],
    },
    {
      category: 'AI / ML',
      items: ['PyTorch', 'LangChain', 'OpenAI GPT-4', 'spaCy', 'sentence-transformers', 'Pinecone'],
    },
    {
      category: 'Database',
      items: ['SQLite (dev)', 'PostgreSQL (prod)', 'Redis (cache)', 'Pinecone (vectors)'],
    },
  ];

  const modules = [
    { title: 'Authentication', desc: 'Dual-role JWT auth with bcrypt password hashing' },
    { title: 'Student Portal', desc: 'Dashboard, subjects, planner, progress tracking' },
    { title: 'Teacher Portal', desc: 'Student management, test creation, analytics, anti-cheat monitoring' },
    { title: 'Code Journal', desc: 'Syntax-highlighted code snippets with tags and search' },
    { title: 'Assessment Engine', desc: 'Question bank, randomization, anti-cheat, auto-grading' },
    { title: 'AI Intelligence Layer', desc: 'RL scheduler, learning state tracker, LLM tutor' },
    { title: 'Content Processing', desc: 'PDF parsing, topic extraction, vector embeddings' },
    { title: 'Real-time Notifications', desc: 'Live study tracking, email alerts, in-app notifications' },
  ];

  const stats = [
    { label: 'Lines of code', value: '15K+' },
    { label: 'API endpoints', value: '46' },
    { label: 'Database models', value: '11' },
    { label: 'UI components', value: '50+' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={goHome} className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
              <span className="text-background text-xs font-bold">A</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">AdaptLearn</span>
          </button>

          <button
            onClick={goHome}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center animate-fade-in">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-6 border border-border rounded-full text-[11px] text-muted-foreground bg-muted/30">
          <Sparkles className="w-3 h-3" />
          About AdaptLearn
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 leading-[1.1]">
          The future of learning is
          <br />
          <span className="text-muted-foreground">personalized.</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AdaptLearn is an AI-powered adaptive learning platform built for VTU students.
          Combining reinforcement learning, Bayesian knowledge tracing, and large language models
          to create a study experience that truly adapts to you.
        </p>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border">
          {stats.map((s) => (
            <div key={s.label} className="bg-background p-5 text-center">
              <p className="text-2xl font-semibold tracking-tight mb-0.5">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">The problem</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Traditional education follows a one-size-fits-all model. Every student gets the same
            material, the same schedule, the same assessments. But every student learns differently.
          </p>
          <p>
            VTU students juggle 6+ subjects, scattered notes, last-minute exam prep, and the constant
            anxiety of forgetting what they studied. Existing tools are either too generic (Coursera, YouTube)
            or too rigid (college portals).
          </p>
          <p>
            <span className="text-foreground font-medium">AdaptLearn changes this</span> by using AI
            to understand each student individually and adapting in real-time.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-border">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Core features</h2>
          <p className="text-sm text-muted-foreground">Eight modules working together</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="border border-border rounded-lg p-6 hover:bg-muted/30 transition-colors">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-9 h-9 bg-foreground rounded-md flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-background" />
                  </div>
                  <div>
                    <h3 className="font-semibold tracking-tight mb-1">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 ml-13">
                  {feat.tech.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-border">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">How it works</h2>
          <p className="text-sm text-muted-foreground">Four steps to personalized learning</p>
        </div>

        <div className="space-y-6">
          {[
            { step: '01', title: 'Onboarding', desc: 'Sign up, select your branch and semester. Choose your subjects from the VTU curriculum.' },
            { step: '02', title: 'Initial Assessment', desc: 'Take a diagnostic test. Our system maps your current knowledge against the topic graph.' },
            { step: '03', title: 'Personalized Plan', desc: 'The RL scheduler creates a daily study plan optimized for your goals, schedule, and weak areas.' },
            { step: '04', title: 'Continuous Adaptation', desc: 'Every quiz, journal entry, and study session updates your learning state. The plan adapts daily.' },
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

      {/* Tech Stack */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-border">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Built with modern tools</h2>
          <p className="text-sm text-muted-foreground">A production-grade tech stack</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map((cat) => (
            <div key={cat.category} className="border border-border rounded-lg p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {cat.category}
              </h3>
              <ul className="space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-muted-foreground/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-4xl mx-auto px-6 py-12 border-t border-border">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Eight integrated modules</h2>
          <p className="text-sm text-muted-foreground">Designed to work seamlessly together</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {modules.map((m, i) => (
            <div key={m.title} className="flex gap-3 p-4 border border-border rounded-lg">
              <div className="text-xs font-mono text-muted-foreground/60 shrink-0 w-6">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">{m.title}</h3>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="max-w-3xl mx-auto px-6 py-12 border-t border-border">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-foreground rounded-md flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-background" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight mb-2">Privacy & security</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/50" />
                Passwords are hashed with bcrypt — never stored in plaintext
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/50" />
                JWT-based authentication with role-based access control
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/50" />
                Anti-cheat system with multi-layered detection (tab-switch, copy-paste, dev tools)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/50" />
                Your study data stays yours — we never sell or share student data
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center border-t border-border">
        <h2 className="text-3xl font-semibold tracking-tight mb-3">
          Ready to learn smarter?
        </h2>
        <p className="text-sm text-muted-foreground mb-8">
          Join thousands of students already using AdaptLearn.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {!isAuthenticated ? (
            <>
              <Link
                href="/register"
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
            </>
          ) : (
            <Link
              href={user?.role === 'admin' ? '/admin' : '/dashboard'}
              className="h-10 px-5 inline-flex items-center justify-center gap-1.5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors"
            >
              Back to dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-xs text-muted-foreground">
          <p>© 2026 AdaptLearn. Built for VTU students.</p>
          <div className="flex items-center gap-4">
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
