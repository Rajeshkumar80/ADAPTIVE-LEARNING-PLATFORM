'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Lock, Loader2 } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStudentAchievements().then(setAchievements).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const rarityLabels: Record<string, { label: string; class: string }> = {
    common: { label: 'Common', class: 'bg-muted text-foreground' },
    rare: { label: 'Rare', class: 'bg-blue-50 text-blue-700' },
    epic: { label: 'Epic', class: 'bg-purple-50 text-purple-700' },
    legendary: { label: 'Legendary', class: 'bg-amber-50 text-amber-700' },
  };

  if (loading) return <div className="flex min-h-screen bg-background"><Sidebar /><div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div></div>;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Achievements</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your collection of badges and trophies</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Earned</p><p className="text-2xl font-semibold tracking-tight">{achievements.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Legendary</p><p className="text-2xl font-semibold tracking-tight">{achievements.filter(a => a.rarity === 'legendary').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Epic</p><p className="text-2xl font-semibold tracking-tight">{achievements.filter(a => a.rarity === 'epic').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Rare</p><p className="text-2xl font-semibold tracking-tight">{achievements.filter(a => a.rarity === 'rare').length}</p></CardContent></Card>
          </div>
          {achievements.length === 0 ? (
            <Card><CardContent className="p-12 text-center"><p className="text-sm text-muted-foreground">No achievements yet. Complete tests and study sessions to earn badges!</p></CardContent></Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {achievements.map((ach) => {
                const bgColors: Record<string, string> = { common: 'bg-gradient-to-br from-slate-50 to-gray-50', rare: 'bg-gradient-to-br from-blue-50 to-sky-50', epic: 'bg-gradient-to-br from-violet-50 to-purple-50', legendary: 'bg-gradient-to-br from-amber-50 to-yellow-50' };
                return (
                  <Card key={ach.id} className="hover:border-foreground transition-colors hover-lift overflow-hidden">
                    <CardContent className={`p-5 text-center ${bgColors[ach.rarity] || ''}`}>
                      <div className="text-4xl mb-3">{ach.icon || '🏆'}</div>
                      <p className="text-sm font-semibold mb-1">{ach.title}</p>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ach.description}</p>
                      <Badge variant="outline" className={`text-[10px] ${(rarityLabels[ach.rarity] || rarityLabels.common).class}`}>{(rarityLabels[ach.rarity] || rarityLabels.common).label}</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
