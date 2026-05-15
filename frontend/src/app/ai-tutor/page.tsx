'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Bot, User } from 'lucide-react';

export default function AITutorPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: "Hi! I'm your AI tutor. Ask me anything about your subjects, debug code, or get study tips.", time: 'Just now' },
    { id: 2, role: 'user', content: 'Can you explain how Binary Search works?', time: '2m ago' },
    { id: 3, role: 'assistant', content: "Binary Search is an efficient algorithm for finding a target value in a sorted array.\n\nHere's how it works:\n\n1. Compare the target with the middle element\n2. If equal, you've found it\n3. If target is smaller, search the left half\n4. If target is larger, search the right half\n5. Repeat until found or array is empty\n\nTime Complexity: O(log n) — much faster than linear search O(n)", time: '2m ago' },
  ]);

  const suggestions = [
    'Explain DBMS normalization',
    'Help me debug this code',
    'Give me practice problems',
    'How to study effectively?',
  ];

  const recent = [
    { id: 1, topic: 'Binary Search Trees', subject: 'DSA' },
    { id: 2, topic: 'SQL Joins', subject: 'DBMS' },
    { id: 3, topic: 'Process Synchronization', subject: 'OS' },
    { id: 4, topic: 'OSI Model', subject: 'CN' },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: messages.length + 1, role: 'user', content: message, time: 'Just now' }]);
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full max-w-7xl mx-auto">
            {/* Sidebar */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">Quick Start</p>
                <div className="space-y-1">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setMessage(s)}
                      className="w-full text-left px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-6">Recent</p>
                <div className="space-y-1">
                  {recent.map((r) => (
                    <button key={r.id} className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors">
                      <p className="text-sm font-medium truncate">{r.topic}</p>
                      <p className="text-xs text-muted-foreground">{r.subject}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat */}
            <Card className="lg:col-span-3 flex flex-col overflow-hidden">
              <div className="border-b border-border px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-background" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Tutor</p>
                  <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-muted' : 'bg-foreground'
                    }`}>
                      {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-background" />}
                    </div>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`px-3.5 py-2.5 rounded-lg text-sm whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-foreground text-background'
                          : 'bg-muted text-foreground'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="flex-1 h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                  />
                  <Button onClick={handleSend} size="icon">
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
