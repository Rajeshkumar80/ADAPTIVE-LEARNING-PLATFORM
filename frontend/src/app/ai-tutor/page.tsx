'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, BookOpen, Code2, Brain, Lightbulb, Bot, User } from 'lucide-react';

export default function AITutorPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI tutor. I can help you understand complex concepts, debug code, prepare for tests, and answer any questions about your subjects. What would you like to learn today?",
      time: 'Just now',
    },
    {
      id: 2,
      role: 'user',
      content: 'Can you explain how Binary Search works?',
      time: '2 mins ago',
    },
    {
      id: 3,
      role: 'assistant',
      content: "Binary Search is an efficient algorithm for finding a target value in a **sorted array**.\n\nHere's how it works:\n1. Compare the target with the middle element\n2. If equal, you've found it!\n3. If target is smaller, search the left half\n4. If target is larger, search the right half\n5. Repeat until found or array is empty\n\n**Time Complexity:** O(log n) - much faster than linear search O(n)",
      time: '2 mins ago',
    },
  ]);

  const suggestions = [
    { icon: Code2, label: 'Debug my code', prompt: 'Help me debug this code' },
    { icon: BookOpen, label: 'Explain concept', prompt: 'Explain DBMS normalization' },
    { icon: Brain, label: 'Practice questions', prompt: 'Give me practice problems' },
    { icon: Lightbulb, label: 'Study tips', prompt: 'How to study effectively?' },
  ];

  const recent = [
    { id: 1, topic: 'Binary Search Trees', subject: 'DSA', time: '5m ago' },
    { id: 2, topic: 'SQL Joins', subject: 'DBMS', time: '1h ago' },
    { id: 3, topic: 'Process Synchronization', subject: 'OS', time: '2h ago' },
    { id: 4, topic: 'OSI Model', subject: 'CN', time: 'Yesterday' },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, role: 'user', content: message, time: 'Just now' },
    ]);
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
            <div className="space-y-4">
              <Card className="border shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {suggestions.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => setMessage(s.prompt)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 text-left"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {s.label}
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Recent Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {recent.map((r) => (
                    <div key={r.id} className="p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <p className="text-sm font-medium">{r.topic}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-[10px]">{r.subject}</Badge>
                        <span className="text-[10px] text-gray-500">{r.time}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="lg:col-span-3 flex flex-col border shadow-none">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">AI Tutor</CardTitle>
                    <p className="text-xs text-gray-500">Powered by GPT-4 • Always here to help</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-gray-100' : 'bg-black'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-gray-700" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-black text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-900 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>

              <div className="border-t p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  <Button onClick={handleSend} className="bg-black hover:bg-gray-800">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
