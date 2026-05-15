'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Users, Bell, Mail, MessageSquare } from 'lucide-react';

export default function AdminNotificationsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin title="Send Notifications" subtitle="Communicate with students" />
        <main className="flex-1 p-6 space-y-6">
          <Card className="border shadow-none bg-white">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Send New Notification</CardTitle>
              <p className="text-xs text-gray-500">Reach students via email or in-app</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Recipients</label>
                <select className="w-full px-3 py-2 border rounded-md text-sm">
                  <option>All Students</option>
                  <option>Section A</option>
                  <option>Section B</option>
                  <option>Specific Students</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="Notification title"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Message</label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full px-3 py-2 border rounded-md text-sm"
                ></textarea>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Send via Email
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" defaultChecked />
                  Show in App
                </label>
              </div>
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Bell className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-gray-600">Sent This Month</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Mail className="w-5 h-5 text-green-600 mb-2" />
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-gray-600">Open Rate</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Users className="w-5 h-5 text-purple-600 mb-2" />
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-gray-600">Total Recipients</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
