'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function AdminNotificationsPage() {
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
                <select className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background">
                  <option>All Students</option>
                  <option>Section A</option>
                  <option>Section B</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Title</label>
                <input type="text" placeholder="Notification title" className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground" />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5">Message</label>
                <textarea rows={5} placeholder="Write your message..." className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-foreground" />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Send via Email
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Show in App
                </label>
              </div>
              <Button>
                <Send className="w-3.5 h-3.5" />
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
