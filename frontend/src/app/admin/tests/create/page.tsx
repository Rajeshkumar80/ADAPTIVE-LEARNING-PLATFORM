'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';

export default function CreateTestPage() {
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
              <Button variant="outline" size="sm">Save Draft</Button>
              <Button size="sm">
                <Save className="w-3.5 h-3.5" />
                Publish
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium block mb-1.5">Title</label>
                    <input type="text" placeholder="e.g. DSA Mid-Term Exam" className="w-full h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Subject</label>
                      <select className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background">
                        <option>Data Structures</option>
                        <option>DBMS</option>
                        <option>Operating Systems</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Type</label>
                      <select className="w-full h-9 px-3 border border-border rounded-md text-sm bg-background">
                        <option>Mid-Term</option>
                        <option>Quiz</option>
                        <option>Assignment</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Duration (min)</label>
                      <input type="number" defaultValue={60} className="w-full h-9 px-3 border border-border rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Total Marks</label>
                      <input type="number" defaultValue={100} className="w-full h-9 px-3 border border-border rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1.5">Passing</label>
                      <input type="number" defaultValue={40} className="w-full h-9 px-3 border border-border rounded-md text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1.5">Description</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Questions</CardTitle>
                  <Button size="sm">
                    <Plus className="w-3.5 h-3.5" />
                    Add Question
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center py-12">
                    No questions added yet. Click "Add Question" to start.
                  </p>
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
    </div>
  );
}
