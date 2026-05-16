'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Save, CheckCircle2, X } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  marks: number;
}

export default function CreateTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures');
  const [type, setType] = useState('Mid-Term');
  const [duration, setDuration] = useState(60);
  const [marks, setMarks] = useState(100);
  const [passing, setPassing] = useState(40);
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = (publish: boolean) => {
    if (!title.trim()) {
      alert('Please enter a test title');
      return;
    }
    setSavedMessage(publish ? 'Test published successfully' : 'Test saved as draft');
    setTimeout(() => {
      router.push('/admin/tests');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Create Test</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Set up a new assessment</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleSave(false)}>Save Draft</Button>
              <Button size="sm" onClick={() => handleSave(true)}>
                <Save className="w-3.5 h-3.5" />
                Publish
              </Button>
            </div>
          </div>

          {savedMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              <CheckCircle2 className="w-4 h-4" />
              {savedMessage} · Redirecting...
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium block mb-1.5">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. DSA Mid-Term Exam"
                      className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Subject</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background"
                      >
                        <option>Data Structures</option>
                        <option>DBMS</option>
                        <option>Operating Systems</option>
                        <option>Computer Networks</option>
                        <option>Software Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background"
                      >
                        <option>Mid-Term</option>
                        <option>Quiz</option>
                        <option>Assignment</option>
                        <option>Final</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Duration (min)</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full h-9 px-3 border border-border rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Total Marks</label>
                      <input
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(Number(e.target.value))}
                        className="w-full h-9 px-3 border border-border rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Passing</label>
                      <input
                        type="number"
                        value={passing}
                        onChange={(e) => setPassing(Number(e.target.value))}
                        className="w-full h-9 px-3 border border-border rounded-md text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Questions ({questions.length})</CardTitle>
                  <Button size="sm" onClick={() => setShowQuestionForm(true)}>
                    <Plus className="w-3.5 h-3.5" />
                    Add Question
                  </Button>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-12">
                      No questions added yet. Click "Add Question" to start.
                    </p>
                  ) : (
                    <div className="divide-y divide-border">
                      {questions.map((q, i) => (
                        <div key={q.id} className="py-3 flex items-start gap-3">
                          <span className="text-xs text-muted-foreground font-mono w-8">Q{i + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium mb-1">{q.question}</p>
                            <p className="text-xs text-muted-foreground">{q.options.length} options · {q.marks} marks</p>
                          </div>
                          <button
                            onClick={() => setQuestions(prev => prev.filter(qq => qq.id !== q.id))}
                            className="p-1 text-muted-foreground hover:text-red-600 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Anti-Cheat Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Detect tab switching',
                    'Block copy-paste',
                    'Disable right-click',
                    'Auto-submit on violation',
                    'Random question order',
                  ].map((label) => (
                    <label key={label} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm">{label}</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assigned To</CardTitle>
                </CardHeader>
                <CardContent>
                  <select className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background">
                    <option>All Section A</option>
                    <option>All Section B</option>
                    <option>All Sections</option>
                  </select>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {showQuestionForm && (
        <QuestionForm
          onAdd={(q) => {
            setQuestions(prev => [...prev, { ...q, id: Date.now() }]);
            setShowQuestionForm(false);
          }}
          onCancel={() => setShowQuestionForm(false)}
        />
      )}
    </div>
  );
}

function QuestionForm({
  onAdd,
  onCancel,
}: {
  onAdd: (q: Omit<Question, 'id'>) => void;
  onCancel: () => void;
}) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState(0);
  const [marks, setMarks] = useState(2);

  const handleAdd = () => {
    if (!question.trim() || options.some(o => !o.trim())) {
      alert('Please fill in the question and all options');
      return;
    }
    onAdd({ question, options, correct, marks });
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onCancel}>
      <div
        className="bg-background rounded-lg max-w-lg w-full overflow-hidden border border-border max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">Add Question</h2>
          <button onClick={onCancel} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-medium block mb-1.5">Question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              placeholder="What is the time complexity of binary search?"
              className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-2">Options (select correct answer)</label>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="correct"
                    checked={correct === i}
                    onChange={() => setCorrect(i)}
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => setOptions(prev => prev.map((o, idx) => idx === i ? e.target.value : o))}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 h-8 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                  />
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5">Marks</label>
            <input
              type="number"
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className="w-24 h-9 px-3 border border-border rounded-md text-sm"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleAdd}>Add Question</Button>
        </div>
      </div>
    </div>
  );
}
