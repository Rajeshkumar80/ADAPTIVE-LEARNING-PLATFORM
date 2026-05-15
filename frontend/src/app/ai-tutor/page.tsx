'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send, Sparkles, BookOpen, Code2, Brain, Lightbulb, Bot, User } from 'lucide-react';

export default function AITutorPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I\'m your AI tutor. I can help you understand complex concepts, debug code, prepare for tests, and answer any questions about your subjects. What would you like to learn today?',
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
      content: 'Binary Search is an efficient algorithm for finding a target value in a **sorted array**. Here\'s how it works:\n\n1. **Compare** the target with the middle element\n2. If equal, you\'ve found it!\n3. If target is **smaller**, search the left half\n4. If target is **larger**, search the right half\n5. **Repeat** until found or array is empty\n\n**Time Complexity:** O(log n) - much faster than linear search O(n)\n\nWould you like me to show you the code implementation?',
      time: '2 mins ago',
    },
  ]);

  const suggestions = [
    { icon: Code2, label: 'Debug my code', prompt: 'Help me debug this code' },
    { icon: BookOpen, label: 'Explain a concept', prompt: 'Explain DBMS normalization' },
    { icon: Brain, label: 'Practice questions', prompt: 'Give me practice problems' },
    { icon: Lightbulb, label: 'Study tips', prompt: 'How to study effectively?' },
  ];

  const recentTopics = [
    { id: 1, topic: 'Binary Search Trees', subject: 'DSA', time: '5 mins ago' },
    { id: 2, topic: 'SQL Joins', subject: 'DBMS', time: '1 hour ago' },
    { id: 3, topic: 'Process Synchronization', subject: 'OS', time: '2 hours ago' },
    { id: 4, topic: 'OSI Model', subject: 'CN', time: 'Yesterday' },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        role: 'user',
        content: message,
        time: 'Just now',
      },
    ]);
    setMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="AI Tutor" description="Your personalized learning assistant" />
        
        <main className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Sidebar - Recent & Quick Actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestions.map((suggestion, idx) => {
                    const Icon = suggestion.icon;
                    return (
                      <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setMessage(suggestion.prompt)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {suggestion.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recentTopics.map((topic) => (
                    <div key={topic.id} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <p className="text-sm font-medium">{topic.topic}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">{topic.subject}</Badge>
                        <span className="text-xs text-gray-500">{topic.time}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <Card className="lg:col-span-3 flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>AI Tutor</CardTitle>
                    <CardDescription>Powered by GPT-4 • Always here to help</CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto py-6 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-100' 
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-900 rounded-tl-none'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything about your subjects..."
                    className="flex-1 px-4 py-2 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                  <Button onClick={handleSend}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI responses may not always be accurate. Verify important information.
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
