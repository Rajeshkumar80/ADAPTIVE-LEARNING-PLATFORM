'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  GraduationCap,
  Calendar,
  Brain,
  Users,
  FileText,
  BarChart3,
  Trophy,
  Mail,
  MessageSquare,
  CalendarDays,
  Layers,
  Receipt,
  UserCircle,
  Shield,
  Plus,
  Command,
  Inbox,
  Sparkles,
  ChevronDown,
  MoreHorizontal,
  X,
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  const dashboardItems = isAdmin ? [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: Users, label: 'Students', href: '/admin/students' },
    { icon: GraduationCap, label: 'Tests', href: '/admin/tests' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: BookOpen, label: 'Subjects', href: '/admin/subjects' },
    { icon: FileText, label: 'Reports', href: '/admin/reports' },
    { icon: Shield, label: 'Permissions', href: '/admin/permissions', soon: true },
  ] : [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'Courses', href: '/courses' },
    { icon: Code2, label: 'Code Journal', href: '/journal' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: GraduationCap, label: 'Tests', href: '/tests' },
    { icon: Calendar, label: 'Planner', href: '/planner' },
    { icon: Trophy, label: 'Achievements', href: '/achievements', soon: true },
  ];

  const pageItems = [
    { icon: Mail, label: 'Email', href: '/email', soon: true },
    { icon: MessageSquare, label: 'Chat', href: '/chat', soon: true },
    { icon: CalendarDays, label: 'Calendar', href: '/calendar', soon: true },
    { icon: Layers, label: 'Kanban', href: '/kanban', soon: true },
    { icon: Receipt, label: 'Invoice', href: '/invoice', soon: true },
    { icon: UserCircle, label: 'Users', href: '/users', soon: true },
    { icon: Shield, label: 'Roles', href: '/roles', soon: true },
  ];

  return (
    <aside className="w-64 h-screen bg-[#fafafa] border-r border-gray-200 flex flex-col sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <Command className="w-5 h-5" />
          <span className="font-semibold text-sm">AdaptLearn {isAdmin ? 'Admin' : 'Studio'}</span>
        </Link>
      </div>

      {/* Quick Create */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
            Quick Create
          </button>
          <button className="p-2 border rounded-md hover:bg-gray-100 transition-colors">
            <Inbox className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Dashboards */}
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">
            Dashboards
          </p>
          <div className="space-y-0.5">
            {dashboardItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.soon ? '#' : item.href}
                  className={cn(
                    'flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors group',
                    isActive
                      ? 'bg-white text-gray-900 font-medium shadow-sm border'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    item.soon && 'cursor-not-allowed opacity-60'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.soon && (
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pages */}
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">
            Pages
          </p>
          <div className="space-y-0.5">
            {pageItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href="#"
                  className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-not-allowed opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Promo Card */}
      <div className="p-3">
        <div className="bg-gray-100 rounded-lg p-3 relative">
          <button className="absolute top-2 right-2 p-0.5 hover:bg-gray-200 rounded">
            <X className="w-3 h-3" />
          </button>
          <p className="text-xs font-medium mb-1">Looking for something more?</p>
          <p className="text-xs text-gray-600">
            Open an issue or do reach out to me on X.
          </p>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
            {isAdmin ? 'AD' : 'TS'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {isAdmin ? 'Admin User' : 'Test Student'}
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              {isAdmin ? 'admin@vtu.edu' : 'student@vtu.edu'}
            </p>
          </div>
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </aside>
  );
}
