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
  Bell,
  Settings,
  Users,
  FileText,
  BarChart3,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const studentMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '/courses' },
    { icon: Code2, label: 'Code Journal', href: '/journal' },
    { icon: GraduationCap, label: 'Tests', href: '/tests' },
    { icon: Calendar, label: 'Study Planner', href: '/planner' },
    { icon: Brain, label: 'AI Tutor', href: '/ai-tutor' },
    { icon: Trophy, label: 'Achievements', href: '/achievements' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: Users, label: 'Students', href: '/admin/students' },
    { icon: BookOpen, label: 'Subjects', href: '/admin/subjects' },
    { icon: GraduationCap, label: 'Tests', href: '/admin/tests' },
    { icon: FileText, label: 'Reports', href: '/admin/reports' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 sticky top-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">AdaptLearn</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold text-gray-400 uppercase px-3 py-2">
            {isAdmin ? 'Administration' : 'Main Menu'}
          </p>
        )}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <div className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold shrink-0',
            isAdmin ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
          )}>
            {isAdmin ? 'AD' : 'TS'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {isAdmin ? 'Admin User' : 'Test Student'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {isAdmin ? 'admin@vtu.edu' : 'student@vtu.edu'}
              </p>
            </div>
          )}
          {!collapsed && <Settings className="w-4 h-4 text-gray-400" />}
        </Link>
      </div>
    </aside>
  );
}
