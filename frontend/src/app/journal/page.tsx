'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, Code2, Calendar, Star, Filter } from 'lucide-react';

export default function JournalPage() {
  const [search, setSearch] = useState('');

  const entries = [
    {
      id: 1,
      title: 'Binary Search Implementation',
      language: 'Python',
      tags: ['algorithm', 'searching'],
      preview: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2',
      date: 'May 15, 2026',
      starred: true,
    },
    {
      id: 2,
      title: 'Quick Sort Algorithm',
      language: 'JavaScript',
      tags: ['algorithm', 'sorting'],
      preview: 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];',
      date: 'May 14, 2026',
      starred: false,
    },
    {
      id: 3,
      title: 'Linked List Operations',
      language: 'C++',
      tags: ['data-structure'],
      preview: 'class Node {\npublic:\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};',
      date: 'May 13, 2026',
      starred: true,
    },
    {
      id: 4,
      title: 'Database Connection Pool',
      language: 'Java',
      tags: ['database', 'performance'],
      preview: 'public class ConnectionPool {\n    private static final int MAX = 10;\n    private List<Connection> pool;',
      date: 'May 12, 2026',
      starred: false,
    },
    {
      id: 5,
      title: 'React Custom Hooks',
      language: 'TypeScript',
      tags: ['react', 'frontend'],
      preview: 'export function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState(value);',
      date: 'May 11, 2026',
      starred: true,
    },
    {
      id: 6,
      title: 'Graph DFS Traversal',
      language: 'Python',
      tags: ['algorithm', 'graph'],
      preview: 'def dfs(graph, start, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(start)',
      date: 'May 10, 2026',
      starred: false,
    },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">Total Entries</p>
                <p className="text-2xl font-semibold">23</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">This Week</p>
                <p className="text-2xl font-semibold">5</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">Languages</p>
                <p className="text-2xl font-semibold">6</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">Starred</p>
                <p className="text-2xl font-semibold">8</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-3 h-3 mr-1" />
                Filter
              </Button>
              <Button size="sm" className="bg-black hover:bg-gray-800">
                <Plus className="w-3 h-3 mr-1" />
                New Entry
              </Button>
            </div>
          </div>

          {/* Entries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="border shadow-none hover:shadow-sm transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-black rounded flex items-center justify-center shrink-0">
                        <Code2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{entry.title}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          {entry.language}
                        </Badge>
                      </div>
                    </div>
                    <button>
                      <Star className={`w-4 h-4 ${entry.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <pre className="text-[11px] bg-gray-900 text-gray-100 p-2 rounded mb-2 overflow-hidden line-clamp-4 font-mono">
                    {entry.preview}
                  </pre>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </div>
                    <button className="text-gray-700 hover:text-gray-900">View →</button>
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
