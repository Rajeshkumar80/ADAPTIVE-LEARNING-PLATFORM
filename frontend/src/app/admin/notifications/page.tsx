'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle2 } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [recipients, setRecipients] = useState('All Students');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [showInApp, setShowInApp] = useState(true);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      alert('Please fill in title and message');
      return;
    }
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin />
        <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Send Notification</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Communicate with students via email or in-app</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1.5">Recipients</label>
                <select
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background"
                >
                  <option>All Students</option>
                  <option>Section A</option>
                  <option>Section B</option>
                  <option>Section C</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                  className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-foreground"
                />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="rounded"
                  />
                  Send via Email
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInApp}
                    onChange={(e) => setShowInApp(e.target.checked)}
                    className="rounded"
                  />
                  Show in App
                </label>
              </div>

              {sent && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  Notification sent to {recipients}
                </div>
              )}

              <Button onClick={handleSend} disabled={sent}>
                <Send className="w-3.5 h-3.5" />
                {sent ? 'Sent' : 'Send Notification'}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
