'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-14 px-6">
        {/* Left: Title or breadcrumb */}
        <div className="flex items-center">
          {title && (
            <div>
              <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button className="relative h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full"></span>
          </button>
          {!isAuthenticated && (
            <Link
              href="/login"
              className="ml-2 h-8 px-3 inline-flex items-center text-xs font-medium rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
