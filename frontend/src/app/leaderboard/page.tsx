'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Trophy, Medal, TrendingUp, Crown, Award } from 'lucide-react';

interface LeaderboardEntry {
  usn: string;
  name: string;
  avg_score: number;
  section: string;
  cgpa?: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [byScore, setByScore] = useState<LeaderboardEntry[]>([]);
  const [byCgpa, setByCgpa] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'score' | 'cgpa'>('score');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard();
      setByScore(data.by_test_score || []);
      setByCgpa(data.by_cgpa || []);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const entries = tab === 'score' ? byScore : byCgpa;
  const myRank = entries.findIndex(e => e.usn === user?.usn) + 1;

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header title="Leaderboard" subtitle="See how you rank among peers" />
        <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Crown className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
                <p className="text-lg font-semibold">{entries.length > 0 ? entries[0].name : '-'}</p>
                <p className="text-xs text-muted-foreground">Top Performer</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Medal className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-lg font-semibold">{myRank > 0 ? `#${myRank}` : 'N/A'}</p>
                <p className="text-xs text-muted-foreground">Your Rank</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-5 h-5 mx-auto text-green-500 mb-1" />
                <p className="text-lg font-semibold">{entries.length}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setTab('score')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'score' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              By Test Score
            </button>
            <button
              onClick={() => setTab('cgpa')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'cgpa' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              By CGPA
            </button>
          </div>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {tab === 'score' ? 'Test Score Rankings' : 'CGPA Rankings'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No data available</p>
              ) : (
                <div className="divide-y divide-border">
                  {entries.map((entry, i) => {
                    const rank = i + 1;
                    const isMe = entry.usn === user?.usn;
                    return (
                      <div
                        key={entry.usn}
                        className={`flex items-center px-6 py-3 transition-colors ${isMe ? 'bg-muted/50' : 'hover:bg-muted/30'}`}
                      >
                        <div className={`w-10 text-center font-bold ${getMedalColor(rank)}`}>
                          {getMedalIcon(rank)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${isMe ? 'text-foreground' : ''}`}>{entry.name}</p>
                            {isMe && <Badge variant="outline" className="text-[10px]">You</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{entry.usn} · Section {entry.section}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{tab === 'score' ? `${entry.avg_score}%` : entry.cgpa?.toFixed(2) || '-'}</p>
                          <p className="text-[10px] text-muted-foreground">{tab === 'score' ? 'avg score' : 'cgpa'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
