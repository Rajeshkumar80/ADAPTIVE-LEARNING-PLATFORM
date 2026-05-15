'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Save, ShieldCheck } from 'lucide-react';

export default function CreateTestPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col">
        <Header isAdmin title="Create Test" subtitle="Set up a new assessment" />
        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border shadow-none bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Test Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Test Title</label>
                    <input type="text" placeholder="e.g. DSA Mid-Term Exam" className="w-full px-3 py-2 border rounded-md text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Subject</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm">
                        <option>Data Structures</option>
                        <option>DBMS</option>
                        <option>Operating Systems</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Test Type</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm">
                        <option>Mid-Term</option>
                        <option>Quiz</option>
                        <option>Assignment</option>
                        <option>Final Exam</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Duration (min)</label>
                      <input type="number" defaultValue="60" className="w-full px-3 py-2 border rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Total Marks</label>
                      <input type="number" defaultValue="100" className="w-full px-3 py-2 border rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Passing Marks</label>
                      <input type="number" defaultValue="40" className="w-full px-3 py-2 border rounded-md text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">Start Date</label>
                      <input type="datetime-local" className="w-full px-3 py-2 border rounded-md text-sm" />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">End Date</label>
                      <input type="datetime-local" className="w-full px-3 py-2 border rounded-md text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Description</label>
                    <textarea rows={3} placeholder="Test description..." className="w-full px-3 py-2 border rounded-md text-sm"></textarea>
                  </div>
                </CardContent>
              </Card>

              <Card className="border shadow-none bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">Questions</CardTitle>
                  <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Question
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 text-center py-8">No questions added yet. Click "Add Question" to start.</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border shadow-none bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                    Anti-Cheat Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Detect tab switching</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Block copy-paste</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Disable right-click</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Auto-submit on violation</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Random question order</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                </CardContent>
              </Card>

              <Card className="border shadow-none bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Assigned To</CardTitle>
                </CardHeader>
                <CardContent>
                  <select className="w-full px-3 py-2 border rounded-md text-sm">
                    <option>All Section A</option>
                    <option>All Section B</option>
                    <option>All Sections</option>
                    <option>Custom Selection</option>
                  </select>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save & Publish
                </Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
