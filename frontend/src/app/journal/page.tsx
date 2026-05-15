'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Search, Star, Filter, MoreHorizontal } from 'lucide-react';

export default function JournalPage() {
  const [search, setSearch] = useState('');

  const entries = [
    { id: 1, title: 'Binary Search Implementation', language: 'Python', tags: ['algorithm', 'searching'], date: 'May 15', starred: true, lines: 28 },
    { id: 2, title: 'Quick Sort Algorithm', language: 'JavaScript', tags: ['algorithm', 'sorting'], date: 'May 14', starred: false, lines: 35 },
    { id: 3, title: 'Linked List Operations', language: 'C++', tags: ['data-structure'], date: 'May 13', starred: true, lines: 67 },
    { id: 4, title: 'Database Connection Pool', language: 'Java', tags: ['database'], date: 'May 12', starred: false, lines: 92 },
    { id: 5, title: 'React Custom Hooks', language: 'TypeScript', tags: ['react', 'hooks'], date: 'May 11', starred: true, lines: 45 },
    { id: 6, title: 'Graph DFS Traversal', language: 'Python', tags: ['algorithm', 'graph'], date: 'May 10', starred: false, lines: 24 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Code Journal</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Document your coding journey
              </p>
            </div>
            <Button size="sm">
              <Plus className="w-3.5 h-3.5" />
              New entry
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Total entries</p><p className="text-2xl font-semibold tracking-tight">{entries.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">This week</p><p className="text-2xl font-semibold tracking-tight">5</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Languages</p><p className="text-2xl font-semibold tracking-tight">5</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Starred</p><p className="text-2xl font-semibold tracking-tight">{entries.filter(e => e.starred).length}</p></CardContent></Card>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search entries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-9 pr-3 border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-3 h-3" />
              Filter
            </Button>
          </div>

          {/* Entries Table */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {entries.map((entry) => (
                  <div key={entry.id} className="group flex items-center px-6 py-3 hover:bg-muted/40 transition-colors cursor-pointer">
                    <button className="mr-3">
                      <Star className={`w-4 h-4 ${entry.starred ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{entry.title}</p>
                        <Badge variant="outline" className="text-[10px]">{entry.language}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {entry.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono ml-4 hidden sm:block">{entry.lines} lines</span>
                    <span className="text-xs text-muted-foreground ml-4 w-12 text-right">{entry.date}</span>
                    <button className="ml-3 p-1 text-muted-foreground hover:text-foreground rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
