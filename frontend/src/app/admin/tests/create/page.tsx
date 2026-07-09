'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Plus, Save, CheckCircle2, X, Loader2 } from 'lucide-react';

export default function CreateTestPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(1);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(40);
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [antiCheat, setAntiCheat] = useState({ tabSwitch: true, copyPaste: true, randomOrder: true });

  useEffect(() => {
    api.getAdminSubjects().then(setSubjects).catch(() => {});
  }, []);

  async function handleSave() {
    if (!title.trim()) { alert('Please enter a test title'); return; }
    setSaving(true);
    try {
      await api.createTest({
        title, description, subject_id: subjectId,
        duration_minutes: duration, total_marks: totalMarks, passing_marks: passingMarks,
        anti_cheat_enabled: antiCheat.tabSwitch || antiCheat.copyPaste || antiCheat.randomOrder,
        questions: questions.map(q => ({
          question_text: q.question,
          question_type: 'mcq',
          options: Object.fromEntries(q.options.map((o: string, i: number) => [String.fromCharCode(97 + i), o])),
          correct_answer: String.fromCharCode(97 + q.correct),
          marks: q.marks,
        })),
      });
      setSavedMessage('Test created successfully');
      setTimeout(() => router.push('/admin/tests'), 1500);
    } catch { alert('Failed to create test'); }
    setSaving(false);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div><h1 className="text-2xl font-semibold tracking-tight">Create Test</h1></div>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5" />} Publish
            </Button>
          </div>
          {savedMessage && <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700"><CheckCircle2 className="w-4 h-4" />{savedMessage}</div>}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card><CardHeader><CardTitle>Test Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div><label className="text-xs font-medium block mb-1.5">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. DSA Mid-Term" className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium block mb-1.5">Subject</label>
                      <select value={subjectId} onChange={e => setSubjectId(Number(e.target.value))} className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background">
                        {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs font-medium block mb-1.5">Duration (min)</label><input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full h-9 px-3 border border-border rounded-md text-sm" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium block mb-1.5">Total Marks</label><input type="number" value={totalMarks} onChange={e => setTotalMarks(Number(e.target.value))} className="w-full h-9 px-3 border border-border rounded-md text-sm" /></div>
                    <div><label className="text-xs font-medium block mb-1.5">Passing Marks</label><input type="number" value={passingMarks} onChange={e => setPassingMarks(Number(e.target.value))} className="w-full h-9 px-3 border border-border rounded-md text-sm" /></div>
                  </div>
                  <div><label className="text-xs font-medium block mb-1.5">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-border rounded-md text-sm" /></div>
                </CardContent>
              </Card>
              <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Questions ({questions.length})</CardTitle><Button size="sm" onClick={() => setShowQuestionForm(true)}><Plus className="w-3.5 h-3.5" /> Add</Button></CardHeader>
                <CardContent>
                  {questions.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">No questions yet</p> : (
                    <div className="divide-y divide-border">
                      {questions.map((q, i) => (
                        <div key={i} className="py-3 flex items-center gap-3">
                          <span className="text-xs text-muted-foreground font-mono">Q{i + 1}.</span>
                          <div className="flex-1"><p className="text-sm font-medium">{q.question}</p><p className="text-xs text-muted-foreground">{q.options.length} options · {q.marks}m</p></div>
                          <button onClick={() => setQuestions(prev => prev.filter((_, idx) => idx !== i))} className="p-1 text-muted-foreground hover:text-red-600"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div><Card><CardHeader><CardTitle>Anti-Cheat</CardTitle></CardHeader><CardContent className="space-y-3">
              {([
                ['tabSwitch', 'Detect tab switching'],
                ['copyPaste', 'Block copy-paste'],
                ['randomOrder', 'Random question order'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer"><span className="text-sm">{label}</span><input type="checkbox" checked={antiCheat[key]} onChange={e => setAntiCheat(prev => ({ ...prev, [key]: e.target.checked }))} className="rounded" /></label>
              ))}
            </CardContent></Card></div>
          </div>
        </main>
      </div>
      {showQuestionForm && (
        <QuestionForm onAdd={q => { setQuestions(prev => [...prev, q]); setShowQuestionForm(false); }} onCancel={() => setShowQuestionForm(false)} />
      )}
    </div>
  );
}

function QuestionForm({ onAdd, onCancel }: { onAdd: (q: any) => void; onCancel: () => void }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correct, setCorrect] = useState(0);
  const [marks, setMarks] = useState(2);

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-background rounded-lg max-w-lg w-full border border-border max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between"><h2 className="text-base font-semibold">Add Question</h2><button onClick={onCancel}><X className="w-4 h-4" /></button></div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div><label className="text-xs font-medium block mb-1.5">Question</label><textarea value={question} onChange={e => setQuestion(e.target.value)} rows={2} className="w-full px-3 py-2 border border-border rounded-md text-sm" /></div>
          <div><label className="text-xs font-medium block mb-2">Options (select correct)</label>
            <div className="space-y-2">{options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2"><input type="radio" name="correct" checked={correct === i} onChange={() => setCorrect(i)} />
                <input type="text" value={opt} onChange={e => setOptions(prev => prev.map((o, idx) => idx === i ? e.target.value : o))} placeholder={`Option ${String.fromCharCode(65 + i)}`} className="flex-1 h-8 px-3 border border-border rounded-md text-sm" />
              </label>
            ))}</div>
          </div>
          <div><label className="text-xs font-medium block mb-1.5">Marks</label><input type="number" value={marks} onChange={e => setMarks(Number(e.target.value))} className="w-24 h-9 px-3 border border-border rounded-md text-sm" /></div>
        </div>
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => { if (question.trim() && options.every(o => o.trim())) onAdd({ question, options, correct, marks }); }}>Add</Button>
        </div>
      </div>
    </div>
  );
}
