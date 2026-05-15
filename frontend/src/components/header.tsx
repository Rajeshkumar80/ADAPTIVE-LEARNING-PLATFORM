'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Settings, Bell, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
}

export function Header({ isAdmin = false, title, subtitle }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-white border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Title or Search */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          {title ? (
            <div>
              <h1 className="text-base font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          ) : (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder={isAdmin ? "Search students, tests, reports..." : "Search lessons, tests, journal..."}
                className="w-full pl-9 pr-12 py-1.5 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 border border-gray-200 rounded">
                ⌘ K
              </kbd>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600">
            <Settings className="w-4 h-4" />
          </button>

          {!isAuthenticated ? (
            <Link
              href="/login"
              className={cn(
                "ml-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-white",
                isAdmin
                  ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              )}
            >
              Sign In
            </Link>
          ) : (
            <div className="ml-2 flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white bg-gradient-to-br",
                isAdmin ? 'from-red-500 to-orange-500' : 'from-indigo-500 to-purple-600'
              )}>
                {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <span className="text-xs font-medium pr-1">
                {user?.full_name?.split(' ')[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
