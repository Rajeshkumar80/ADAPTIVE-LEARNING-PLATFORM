'use client';

import { Search, Bell, Moon, Sun, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Title */}
        <div>
          {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Maximize2 className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
