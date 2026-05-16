'use client';

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

export default function AITutorPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI tutor. Ask me anything about your subjects, debug code, or get study tips.",
      time: 'Just now',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Explain DBMS normalization',
    'How does binary search work?',
    'What is process scheduling?',
    'Tips for studying effectively',
  ];

  const recent = [
    { id: 1, topic: 'Binary Search Trees', subject: 'DSA' },
    { id: 2, topic: 'SQL Joins', subject: 'DBMS' },
    { id: 3, topic: 'Process Synchronization', subject: 'OS' },
    { id: 4, topic: 'OSI Model', subject: 'CN' },
  ];

  const fallbackResponses: Record<string, string> = {
    binary: "Binary Search is an efficient algorithm for finding a target value in a sorted array.\n\n1. Compare target with middle element\n2. If equal, you've found it\n3. If target is smaller, search left half\n4. If larger, search right half\n5. Repeat until found\n\nTime Complexity: O(log n)",
    sort: "Common sorting algorithms:\n\n• Bubble Sort — O(n²), simple\n• Quick Sort — O(n log n) avg\n• Merge Sort — O(n log n), stable\n• Heap Sort — O(n log n), in-place",
    normal: "Database normalization reduces redundancy.\n\n• 1NF — atomic values\n• 2NF — 1NF + no partial dependencies\n• 3NF — 2NF + no transitive dependencies\n• BCNF — stricter 3NF",
    process: "Process scheduling determines which process runs next on the CPU.\n\nCommon algorithms:\n• FCFS (First Come First Served)\n• SJF (Shortest Job First)\n• Round Robin\n• Priority Scheduling\n• Multilevel Queue",
    osi: "The OSI Model has 7 layers:\n\n7. Application — User interface\n6. Presentation — Data format/encryption\n5. Session — Connections\n4. Transport — TCP/UDP\n3. Network — Routing (IP)\n2. Data Link — Frames (MAC)\n1. Physical — Bits over wire",
  };

  const generateFallback = (query: string): string => {
    const q = query.toLowerCase();
    for (const [key, response] of Object.entries(fallbackResponses)) {
      if (q.includes(key)) return response;
    }
    return `That's an interesting question about "${query}".\n\nI'm currently running in offline mode. To get full AI responses, the backend needs to be configured with an OpenAI API key. I can still help with common topics like binary search, sorting, normalization, process scheduling, and the OSI model.`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const query = (text || message).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: query,
      time: 'Just now',
    };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const response = await api.askAI(query);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.response || generateFallback(query),
        time: 'Just now',
      }]);
    } catch {
      // Fallback when backend unavailable
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: generateFallback(query),
        time: 'Just now',
      }]);
    } finally {
      setLoading(false);
    }
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
                      onClick={() => handleSend(s)}
                      disabled={loading}
                      className="w-full text-left px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
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
                    <button
                      key={r.id}
                      onClick={() => handleSend(`Tell me about ${r.topic}`)}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors"
                    >
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
                        msg.role === 'user' ? 'bg-foreground text-background' : 'bg-muted text-foreground'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 px-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-background" />
                    </div>
                    <div className="px-3.5 py-2.5 rounded-lg bg-muted">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    disabled={loading}
                    className="flex-1 h-9 px-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
                  />
                  <Button onClick={() => handleSend()} size="icon" disabled={loading || !message.trim()}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
