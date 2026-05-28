'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Question {
  id: number;
  question_text: string;
  options: Record<string, string>;
  marks: number;
}

export default function TakeTestPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ score: number; total: number; percentage: number } | null>(null);

  // Sample test questions (in production, fetch from /api/tests/{id}/start)
  const testInfo = {
    title: 'Cloud Computing Mid-Term',
    subject: 'BCS601 - Cloud Computing',
    duration: 90,
    totalMarks: 20,
  };

  const questions: Question[] = [
    { id: 1, question_text: 'Which of the following is NOT a cloud service model?', options: { a: 'IaaS', b: 'PaaS', c: 'SaaS', d: 'DaaS' }, marks: 2 },
    { id: 2, question_text: 'What type of hypervisor runs directly on hardware?', options: { a: 'Type 1', b: 'Type 2', c: 'Type 3', d: 'Hosted' }, marks: 2 },
    { id: 3, question_text: 'Which cloud deployment model is shared among multiple organizations?', options: { a: 'Public', b: 'Private', c: 'Community', d: 'Hybrid' }, marks: 2 },
    { id: 4, question_text: 'MapReduce is primarily used for?', options: { a: 'Real-time processing', b: 'Batch processing', c: 'Stream processing', d: 'Transaction processing' }, marks: 2 },
    { id: 5, question_text: 'Which AWS service provides serverless computing?', options: { a: 'EC2', b: 'Lambda', c: 'S3', d: 'RDS' }, marks: 2 },
    { id: 6, question_text: 'Docker is an example of?', options: { a: 'Hypervisor', b: 'Container platform', c: 'Cloud provider', d: 'Database' }, marks: 2 },
    { id: 7, question_text: 'What does auto-scaling do in cloud computing?', options: { a: 'Reduces cost manually', b: 'Automatically adjusts resources based on demand', c: 'Backs up data', d: 'Encrypts data' }, marks: 2 },
    { id: 8, question_text: 'Which protocol is used for secure cloud communication?', options: { a: 'HTTP', b: 'FTP', c: 'TLS/SSL', d: 'SMTP' }, marks: 2 },
    { id: 9, question_text: 'Kubernetes is used for?', options: { a: 'Container orchestration', b: 'Database management', c: 'Email service', d: 'File storage' }, marks: 2 },
    { id: 10, question_text: 'Which is a characteristic of cloud computing?', options: { a: 'Fixed resources', b: 'On-demand self-service', c: 'Single tenant', d: 'Manual scaling' }, marks: 2 },
  ];

  const correctAnswers: Record<string, string> = {
    '1': 'd', '2': 'a', '3': 'c', '4': 'b', '5': 'b',
    '6': 'b', '7': 'b', '8': 'c', '9': 'a', '10': 'b',
  };

  // Timer
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

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[String(q.id)] === correctAnswers[String(q.id)]) correct++;
    });
    const totalMarks = correct * 2;
    setScore({ score: totalMarks, total: 20, percentage: Math.round((totalMarks / 20) * 100) });
    setSubmitted(true);
  };

  // Pre-test screen
  if (!started) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <Header title="Take Test" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold">{testInfo.title}</h2>
                <p className="text-sm text-muted-foreground">{testInfo.subject}</p>
                <div className="flex justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {testInfo.duration} min</span>
                  <span>{questions.length} questions</span>
                  <span>{testInfo.totalMarks} marks</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Once started, the timer cannot be paused. Tab switching will be monitored.</span>
                </div>
                <Button onClick={() => setStarted(true)} className="w-full">Start Test</Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Results screen
  if (submitted && score) {
    const passed = score.percentage >= 40;
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-auto">
          <Header title="Test Result" />
          <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-6">
            {/* Score card */}
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${passed ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <CheckCircle2 className={`w-8 h-8 ${passed ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
                <h2 className="text-xl font-semibold">{passed ? 'Congratulations!' : 'Keep Trying!'}</h2>
                <Badge className={passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                  {passed ? 'PASSED' : 'FAILED'}
                </Badge>
                <div className="text-4xl font-bold">{score.score}/{score.total}</div>
                <p className="text-sm text-muted-foreground">{score.percentage}% · {Object.keys(answers).length}/{questions.length} answered</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <p className="font-semibold text-emerald-700">{score.score / 2}</p>
                    <p className="text-xs text-emerald-600">Correct</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-semibold text-red-700">{questions.length - score.score / 2}</p>
                    <p className="text-xs text-red-600">Wrong</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review answers — question + options + correct + explanation */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Review Answers</h3>
              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const userAnswer = answers[String(q.id)] || '';
                  const correct = correctAnswers[String(q.id)];
                  const isCorrect = userAnswer === correct;
                  const explanations: Record<string, string> = {
                    '1': 'DaaS (Desktop as a Service) is sometimes mentioned but the three standard cloud service models are IaaS, PaaS, and SaaS.',
                    '2': 'Type 1 (bare-metal) hypervisors run directly on hardware without a host OS. Examples: VMware ESXi, Microsoft Hyper-V.',
                    '3': 'Community cloud is shared among organizations with common concerns (security, compliance). It\'s managed by one or more of the organizations or a third party.',
                    '4': 'MapReduce is designed for batch processing of large datasets across distributed clusters. It processes data in two phases: Map and Reduce.',
                    '5': 'AWS Lambda is a serverless compute service that runs code in response to events without provisioning servers.',
                    '6': 'Docker is a container platform that packages applications with their dependencies into lightweight, portable containers.',
                    '7': 'Auto-scaling automatically adjusts compute resources (instances) based on current demand to maintain performance and minimize cost.',
                    '8': 'TLS/SSL provides encrypted communication between client and server, ensuring data confidentiality and integrity in cloud.',
                    '9': 'Kubernetes is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.',
                    '10': 'On-demand self-service is a key characteristic of cloud computing — users can provision resources without human interaction with the provider.',
                  };

                  return (
                    <Card key={q.id} className={`overflow-hidden ${isCorrect ? 'border-emerald-200' : 'border-red-200'}`}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium">Q{idx + 1}. {q.question_text}</p>
                          <Badge className={`shrink-0 ml-2 ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {isCorrect ? '✓ Correct' : '✗ Wrong'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(q.options).map(([key, value]) => {
                            const isUserPick = userAnswer === key;
                            const isCorrectOption = correct === key;
                            let optionStyle = 'border-border bg-transparent';
                            if (isCorrectOption) optionStyle = 'border-emerald-300 bg-emerald-50';
                            else if (isUserPick && !isCorrect) optionStyle = 'border-red-300 bg-red-50';

                            return (
                              <div key={key} className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${optionStyle}`}>
                                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                                  isCorrectOption ? 'border-emerald-500 bg-emerald-500 text-white' :
                                  isUserPick && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                                  'border-border'
                                }`}>{key.toUpperCase()}</span>
                                <span>{value}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="p-2.5 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Explanation:</span> {explanations[String(q.id)] || 'No explanation available.'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <Button onClick={() => router.push('/tests')} className="w-full">Back to Tests</Button>
          </main>
        </div>
      </div>
    );
  }

  // Test taking screen
  const q = questions[currentQ];
  const answered = Object.keys(answers).length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Test header with timer */}
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

        <main className="flex-1 p-6 max-w-3xl w-full mx-auto">
          {/* Question */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="mb-3 text-[10px]">Q{currentQ + 1} · {q.marks} marks</Badge>
                  <p className="text-base font-medium leading-relaxed">{q.question_text}</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {Object.entries(q.options).map(([key, value]) => {
                  const isSelected = answers[String(q.id)] === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswer(q.id, key)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-foreground bg-muted'
                          : 'border-border hover:border-muted-foreground hover:bg-muted/30'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-semibold shrink-0 ${
                        isSelected ? 'border-foreground bg-foreground text-background' : 'border-border'
                      }`}>
                        {key.toUpperCase()}
                      </span>
                      <span className="text-sm">{value}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                  disabled={currentQ === 0}
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>

                {currentQ === questions.length - 1 ? (
                  <Button size="sm" onClick={handleSubmit}>
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))}
                  >
                    Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
              </div>

              {/* Question dots */}
              <div className="flex gap-1.5 justify-center pt-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i === currentQ ? 'bg-foreground' :
                      answers[String(questions[i].id)] ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
