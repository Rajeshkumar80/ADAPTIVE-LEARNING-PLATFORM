'use client';

import { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Send, Sparkles, Bot, User, Loader2, RotateCcw } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

function formatTime(ts: number): string {
  const date = new Date(ts);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function AITutorPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your AI tutor. Ask me anything about your subjects — DSA, DBMS, OS, Networks, or any programming topic. I'm here to help you learn!",
      timestamp: Date.now(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    'Explain DBMS normalization',
    'How does binary search work?',
    'What is process scheduling?',
    'Difference between TCP and UDP',
    'Explain sorting algorithms',
    'What is a binary search tree?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (text?: string) => {
    const query = (text || message).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    const newHistory = [...chatHistory, { role: 'user', content: query }];
    setChatHistory(newHistory);

    try {
      let response: string;

      try {
        const data = await api.chatAI(query, newHistory);
        response = data.response || data.answer || 'I could not generate a response. Please try again.';
      } catch {
        const data = await api.askAI(query);
        response = data.response || data.answer || 'I could not generate a response. Please try again.';
      }

      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }]);
    } catch (err) {
      const errorMsg = 'Sorry, I encountered an error. Please try again or ask your teacher for help.';
      setChatHistory(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorMsg,
        timestamp: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: "Chat cleared. How can I help you today?",
      timestamp: Date.now(),
    }]);
    setChatHistory([]);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full max-w-7xl mx-auto">
            {/* Sidebar */}
            <div className="space-y-3 hidden lg:block">
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
              <Button variant="outline" size="sm" className="w-full" onClick={handleClear} disabled={loading}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear Chat
              </Button>
            </div>

            {/* Chat */}
            <Card className="lg:col-span-3 flex flex-col overflow-hidden">
              <div className="border-b border-border px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-background" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">AI Tutor</p>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClear} disabled={loading} className="lg:hidden">
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Mobile suggestions - shown on small screens */}
              <div className="lg:hidden border-b border-border px-4 py-2 flex gap-2 overflow-x-auto">
                {suggestions.slice(0, 3).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    disabled={loading}
                    className="shrink-0 text-xs px-2.5 py-1.5 border border-border rounded-full hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
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
                      <p className="text-[10px] text-muted-foreground mt-1 px-1">
                        {formatTime(msg.timestamp)}
                      </p>
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
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
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
