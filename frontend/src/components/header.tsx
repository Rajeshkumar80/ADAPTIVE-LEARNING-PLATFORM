'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationDialog } from '@/components/notification-dialog';

interface HeaderProps {
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-14 pl-12 pr-6 md:px-6">
        <div className="flex items-center">
          {title && (
            <div>
              <h1 className="text-base font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <NotificationDialog />
          {!isAuthenticated && (
            <Link
              href="/login"
              className="ml-2 h-8 px-3 inline-flex items-center text-xs font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
