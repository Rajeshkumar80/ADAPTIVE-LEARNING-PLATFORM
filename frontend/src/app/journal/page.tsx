'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, Code2, Calendar, Tag, Star, MoreVertical, Filter } from 'lucide-react';

export default function JournalPage() {
  const [search, setSearch] = useState('');

  const entries = [
    {
      id: 1,
      title: 'Binary Search Implementation',
      language: 'Python',
      tags: ['algorithm', 'searching'],
      preview: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:...',
      date: 'May 15, 2026',
      starred: true,
    },
    {
      id: 2,
      title: 'Quick Sort Algorithm',
      language: 'JavaScript',
      tags: ['algorithm', 'sorting'],
      preview: 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];...',
      date: 'May 14, 2026',
      starred: false,
    },
    {
      id: 3,
      title: 'Linked List Operations',
      language: 'C++',
      tags: ['data-structure', 'linked-list'],
      preview: 'class Node {\npublic:\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};',
      date: 'May 13, 2026',
      starred: true,
    },
    {
      id: 4,
      title: 'Database Connection Pool',
      language: 'Java',
      tags: ['database', 'java', 'performance'],
      preview: 'public class ConnectionPool {\n    private static final int MAX_CONNECTIONS = 10;\n    private List<Connection> pool;...',
      date: 'May 12, 2026',
      starred: false,
    },
    {
      id: 5,
      title: 'React Custom Hooks',
      language: 'TypeScript',
      tags: ['react', 'hooks', 'frontend'],
      preview: 'export function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);...',
      date: 'May 11, 2026',
      starred: true,
    },
    {
      id: 6,
      title: 'Graph DFS Traversal',
      language: 'Python',
      tags: ['algorithm', 'graph', 'dfs'],
      preview: 'def dfs(graph, start, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(start)...',
      date: 'May 10, 2026',
      starred: false,
    },
  ];

  const languageColors: Record<string, string> = {
    Python: 'bg-blue-100 text-blue-800',
    JavaScript: 'bg-yellow-100 text-yellow-800',
    'C++': 'bg-purple-100 text-purple-800',
    Java: 'bg-red-100 text-red-800',
    TypeScript: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Code Journal"
          description="Document and organize your coding journey"
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search entries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold">23</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold">5</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Languages</p>
                <p className="text-2xl font-bold">6</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Starred</p>
                <p className="text-2xl font-bold">8</p>
              </CardContent>
            </Card>
          </div>

          {/* Entries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                        <Code2 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{entry.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={languageColors[entry.language] || 'bg-gray-100 text-gray-800'}>
                            {entry.language}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      {entry.starred ? (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-md overflow-hidden mb-3 line-clamp-4">
                    {entry.preview}
                  </pre>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
