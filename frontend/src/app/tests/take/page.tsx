'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: Record<string, string>;
  marks: number;
}

function TakeTestInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');

  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; percentage: number; passed: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [testInfo, setTestInfo] = useState({ title: '', subject: '', duration: 90, totalMarks: 100 });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (testId) loadTest();
    else setLoading(false);
  }, [testId]);

  async function loadTest() {
    try {
      const data = await api.startTest(Number(testId));
      setAttemptId(data.attempt_id);
      setQuestions(data.questions || []);
      setTestInfo({
        title: `Test #${testId}`,
        subject: '',
        duration: data.duration_minutes || 90,
        totalMarks: data.questions?.reduce((s: number, q: Question) => s + (q.marks || 1), 0) || 100,
      });
      setTimeLeft((data.duration_minutes || 90) * 60);
    } catch (err: any) { setError(err?.message || 'Failed to load test'); }
    setLoading(false);
  }

  useEffect(() => {
    if (!started || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [String(questionId)]: option }));
  };

  async function handleSubmit() {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.submitTest(attemptId, answers);
      setResult({ score: res.score, total: res.total_marks, percentage: res.percentage, passed: res.passed });
      setSubmitted(true);
    } catch (err: any) { setError(err?.message || 'Failed to submit test'); }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={() => router.push('/tests')}>Back to Tests</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!testId || questions.length === 0) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <Header title="Take Test" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center space-y-4">
                <h2 className="text-xl font-semibold">No Test Selected</h2>
                <p className="text-sm text-muted-foreground">Go to Tests page and select a test to take.</p>
                <Button onClick={() => router.push('/tests')}>Back to Tests</Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (submitted && result) {
    const passed = result.passed;
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <Header title="Test Result" />
          <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-6">
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <CheckCircle2 className={`w-8 h-8 ${passed ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
                <h2 className="text-xl font-semibold">{passed ? 'Congratulations!' : 'Keep Trying!'}</h2>
                <Badge className={passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>{passed ? 'PASSED' : 'FAILED'}</Badge>
                <div className="text-4xl font-bold">{result.score}/{result.total}</div>
                <p className="text-sm text-muted-foreground">{result.percentage}%</p>
              </CardContent>
            </Card>
            <Button onClick={() => router.push('/tests')} className="w-full">Back to Tests</Button>
          </main>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const answered = Object.keys(answers).length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="sticky top-0 z-40 border-b border-border bg-background px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{testInfo.title}</p>
            <p className="text-xs text-muted-foreground">Question {currentQ + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">{answered}/{questions.length} answered</Badge>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-semibold ${timeLeft < 300 ? 'bg-red-50 text-red-700' : 'bg-muted'}`}>
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <main id="main-content" className="flex-1 p-6 max-w-3xl w-full mx-auto">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-3 text-[10px]">Q{currentQ + 1} · {q.marks} marks</Badge>
                  <p className="text-base font-medium leading-relaxed">{q.question_text}</p>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(q.options).map(([key, value]) => {
                  const isSelected = answers[String(q.id)] === key;
                  return (
                    <button key={key} onClick={() => handleAnswer(q.id, key)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${isSelected ? 'border-foreground bg-muted' : 'border-border hover:border-muted-foreground hover:bg-muted/30'}`}>
                      <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold shrink-0 ${isSelected ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{key.toUpperCase()}</span>
                      <span className="text-sm">{value}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))} disabled={currentQ === 0}>
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>
                {currentQ === questions.length - 1 ? (
                  <Button size="sm" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null} Submit Test
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))}>
                    Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>

              <div className="flex gap-1.5 justify-center pt-2">
                {questions.map((_, i) => (
                  <button key={i} onClick={() => setCurrentQ(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentQ ? 'bg-foreground' : answers[String(questions[i].id)] ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default function TakeTestPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>}>
      <TakeTestInner />
    </Suspense>
  );
}
