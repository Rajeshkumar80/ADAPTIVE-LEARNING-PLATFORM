'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        router.push(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent"></div>
    </div>
  );
}
