'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Users, Bell, CheckCircle2 } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [target, setTarget] = useState<'all' | 'section'>('all');
  const [section, setSection] = useState('A');
  const [semester, setSemester] = useState(6);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setResult(null);

    try {
      const token = localStorage.getItem('adaptlearn_token');
      const endpoint = target === 'all'
        ? '/api/notifications/send'
        : '/api/notifications/broadcast';

      const body = target === 'all'
        ? { title, message, type }
        : { title, message, type, section, semester };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(`Sent to ${data.count} student(s)`);
        setTitle('');
        setMessage('');
      } else {
        setResult(`Error: ${data.detail || 'Failed to send'}`);
      }
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Send Notifications" subtitle="Notify students" />
        <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="w-4 h-4" /> Compose Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Target */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Send To</label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={target === 'all' ? 'default' : 'outline'}
                    onClick={() => setTarget('all')}
                  >
                    <Users className="w-3.5 h-3.5 mr-1" /> All Students
                  </Button>
                  <Button
                    size="sm"
                    variant={target === 'section' ? 'default' : 'outline'}
                    onClick={() => setTarget('section')}
                  >
                    Specific Section
                  </Button>
                </div>
              </div>

              {target === 'section' && (
                <div className="flex gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Section</label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="block w-full mt-1 h-8 px-2 border border-border rounded-md text-sm"
                    >
                      {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="block w-full mt-1 h-8 px-2 border border-border rounded-md text-sm"
                    >
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Type */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                <div className="flex gap-2">
                  {['info', 'success', 'warning', 'error'].map(t => (
                    <Button
                      key={t}
                      size="sm"
                      variant={type === t ? 'default' : 'outline'}
                      onClick={() => setType(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title..."
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your notification message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-foreground resize-none"
                />
              </div>

              {/* Send */}
              <div className="flex items-center justify-between">
                <Button onClick={handleSend} disabled={sending || !title.trim() || !message.trim()}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {sending ? 'Sending...' : 'Send Notification'}
                </Button>
                {result && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {result}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
