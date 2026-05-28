'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDB, Achievement } from '@/lib/mockdb';
import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const mockAch = user ? mockDB.getAchievements(user.id) : [];
    if (mockAch.length > 0) {
      setAchievements(mockAch);
    } else {
      // Dummy achievements to show how it looks
      setAchievements([
        { id: 1, user_id: 1, title: '7-Day Streak', description: 'Studied for 7 consecutive days', icon: '🔥', rarity: 'common', earned_date: '2026-05-25T10:00:00Z' },
        { id: 2, user_id: 1, title: 'Perfect Score', description: 'Got 100% on a test', icon: '⭐', rarity: 'rare', earned_date: '2026-05-20T10:00:00Z' },
        { id: 3, user_id: 1, title: 'Quiz Master', description: 'Completed 10 quizzes', icon: '🧠', rarity: 'common', earned_date: '2026-05-18T10:00:00Z' },
        { id: 4, user_id: 1, title: 'Night Owl', description: 'Studied past midnight', icon: '🌙', rarity: 'common', earned_date: '2026-05-15T10:00:00Z' },
        { id: 5, user_id: 1, title: 'Speed Demon', description: 'Finished test in record time', icon: '⚡', rarity: 'rare', earned_date: '2026-05-10T10:00:00Z' },
        { id: 6, user_id: 1, title: 'Code Warrior', description: 'Solved 20 coding problems', icon: '⚔️', rarity: 'epic', earned_date: '2026-04-28T10:00:00Z' },
        { id: 7, user_id: 1, title: 'Top of Class', description: 'Ranked #1 in semester', icon: '🏆', rarity: 'legendary', earned_date: '2026-04-15T10:00:00Z' },
        { id: 8, user_id: 1, title: 'AI Whisperer', description: 'Asked AI 50+ questions', icon: '🤖', rarity: 'epic', earned_date: '2026-04-01T10:00:00Z' },
        { id: 9, user_id: 1, title: 'Early Bird', description: 'Started studying before 6 AM', icon: '🌅', rarity: 'common', earned_date: '2026-03-20T10:00:00Z' },
        { id: 10, user_id: 1, title: 'Dedicated Learner', description: '10+ hours of total study', icon: '📚', rarity: 'common', earned_date: '2026-03-10T10:00:00Z' },
      ]);
    }
  }, [user]);

  const locked = [
    { title: 'Marathon Runner', description: 'Study 100 hours total', icon: '🏃', rarity: 'rare' },
    { title: 'Genius Mode', description: 'Score 100% on 5 tests', icon: '🧬', rarity: 'epic' },
    { title: 'Course Crusher', description: 'Complete all 8 subjects', icon: '💎', rarity: 'legendary' },
    { title: 'Helping Hand', description: 'Help 10 students', icon: '🤝', rarity: 'common' },
  ];

  const rarityLabels = {
    common: { label: 'Common', class: 'bg-muted text-foreground' },
    rare: { label: 'Rare', class: 'bg-blue-50 text-blue-700' },
    epic: { label: 'Epic', class: 'bg-purple-50 text-purple-700' },
    legendary: { label: 'Legendary', class: 'bg-amber-50 text-amber-700' },
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Achievements</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your collection of badges and trophies
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Earned</p><p className="text-2xl font-semibold tracking-tight">{achievements.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Legendary</p><p className="text-2xl font-semibold tracking-tight">{achievements.filter(a => a.rarity === 'legendary').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Epic</p><p className="text-2xl font-semibold tracking-tight">{achievements.filter(a => a.rarity === 'epic').length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground mb-1">Locked</p><p className="text-2xl font-semibold tracking-tight">{locked.length}</p></CardContent></Card>
          </div>

          {/* Earned */}
          <div>
            <h2 className="text-sm font-semibold tracking-tight mb-3">Earned</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {achievements.map((ach) => {
                const bgColors: Record<string, string> = {
                  common: 'bg-gradient-to-br from-slate-50 to-gray-50',
                  rare: 'bg-gradient-to-br from-blue-50 to-sky-50',
                  epic: 'bg-gradient-to-br from-violet-50 to-purple-50',
                  legendary: 'bg-gradient-to-br from-amber-50 to-yellow-50',
                };
                return (
                  <Card key={ach.id} className={`hover:border-foreground transition-colors hover-lift overflow-hidden`}>
                    <CardContent className={`p-5 text-center ${bgColors[ach.rarity] || ''}`}>
                      <div className="text-4xl mb-3">{ach.icon}</div>
                      <p className="text-sm font-semibold mb-1">{ach.title}</p>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ach.description}</p>
                      <Badge variant="outline" className={`text-[10px] ${rarityLabels[ach.rarity].class}`}>
                        {rarityLabels[ach.rarity].label}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Locked */}
          <div>
            <h2 className="text-sm font-semibold tracking-tight mb-3 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              Locked
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {locked.map((ach, idx) => (
                <Card key={idx} className="bg-muted/30">
                  <CardContent className="p-5 text-center opacity-60">
                    <div className="text-4xl mb-3 grayscale">{ach.icon}</div>
                    <p className="text-sm font-semibold mb-1">{ach.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ach.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
