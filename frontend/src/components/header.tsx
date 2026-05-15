'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Settings, Moon, Sun, Github, PanelLeft } from 'lucide-react';

export function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Left: Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button className="p-1.5 hover:bg-gray-100 rounded-md">
            <PanelLeft className="w-4 h-4" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-12 py-1.5 bg-white border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 border rounded">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <Link
            href="/login"
            className="ml-2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
