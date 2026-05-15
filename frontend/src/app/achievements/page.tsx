'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDB, Achievement } from '@/lib/mockdb';
import { useAuth } from '@/contexts/AuthContext';
import { Trophy, Lock, Star, Sparkles } from 'lucide-react';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userAchievements = mockDB.getAchievements(user.id);
      setAchievements(userAchievements);
    }
  }, [user]);

  const lockedAchievements = [
    { title: 'Marathon Runner', description: 'Study 100 hours total', icon: '🏃', rarity: 'rare' },
    { title: 'Genius Mode', description: 'Score 100% on 5 tests', icon: '🧬', rarity: 'epic' },
    { title: 'Course Crusher', description: 'Complete all 8 subjects', icon: '💎', rarity: 'legendary' },
    { title: 'Helping Hand', description: 'Help 10 students in chat', icon: '🤝', rarity: 'common' },
  ];

  const rarityStyles = {
    common: 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100',
    rare: 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100',
    epic: 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100',
    legendary: 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-100',
  };

  const rarityBadgeStyles = {
    common: 'bg-gray-200 text-gray-700',
    rare: 'bg-blue-200 text-blue-700',
    epic: 'bg-purple-200 text-purple-700',
    legendary: 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Achievements" subtitle="Your collection of earned badges and trophies" />
        <main className="flex-1 p-6 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border shadow-none bg-gradient-to-br from-indigo-50 to-purple-50">
              <CardContent className="p-5">
                <Trophy className="w-5 h-5 text-indigo-600 mb-2" />
                <p className="text-2xl font-bold">{achievements.length}</p>
                <p className="text-xs text-gray-600">Total Earned</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Star className="w-5 h-5 text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">{achievements.filter(a => a.rarity === 'legendary').length}</p>
                <p className="text-xs text-gray-600">Legendary</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Sparkles className="w-5 h-5 text-purple-500 mb-2" />
                <p className="text-2xl font-bold">{achievements.filter(a => a.rarity === 'epic').length}</p>
                <p className="text-xs text-gray-600">Epic</p>
              </CardContent>
            </Card>
            <Card className="border shadow-none">
              <CardContent className="p-5">
                <Lock className="w-5 h-5 text-gray-400 mb-2" />
                <p className="text-2xl font-bold">{lockedAchievements.length}</p>
                <p className="text-xs text-gray-600">Locked</p>
              </CardContent>
            </Card>
          </div>

          {/* Earned Achievements */}
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Earned Achievements
              </CardTitle>
              <p className="text-xs text-gray-500">Badges you've unlocked through your journey</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-5 rounded-xl border-2 hover:scale-105 transition-transform ${rarityStyles[ach.rarity]}`}
                  >
                    <div className="text-5xl mb-3 text-center">{ach.icon}</div>
                    <h3 className="font-semibold text-sm text-center mb-1">{ach.title}</h3>
                    <p className="text-xs text-gray-600 text-center mb-3">{ach.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${rarityBadgeStyles[ach.rarity]}`}>
                        {ach.rarity}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(ach.earned_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Locked Achievements */}
          <Card className="border shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                Locked Achievements
              </CardTitle>
              <p className="text-xs text-gray-500">Keep going to unlock these badges</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {lockedAchievements.map((ach, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 opacity-60"
                  >
                    <div className="text-5xl mb-3 text-center grayscale">{ach.icon}</div>
                    <h3 className="font-semibold text-sm text-center mb-1 text-gray-500">{ach.title}</h3>
                    <p className="text-xs text-gray-500 text-center mb-3">{ach.description}</p>
                    <div className="flex items-center justify-center">
                      <Lock className="w-3 h-3 text-gray-400" />
                    </div>
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
