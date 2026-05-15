'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
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
  Award,
  Command,
  Plus,
  Bell,
  LogOut,
  ClipboardList,
  TrendingUp,
  ShieldCheck,
  BookMarked,
  Target,
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // ========= STUDENT MENU =========
  const studentMenu = [
    {
      section: 'Learning',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: BookOpen, label: 'My Subjects', href: '/courses' },
        { icon: Brain, label: 'AI Tutor', href: '/ai-tutor' },
        { icon: Calendar, label: 'Study Planner', href: '/planner' },
      ],
    },
    {
      section: 'Practice',
      items: [
        { icon: GraduationCap, label: 'Tests & Quizzes', href: '/tests' },
        { icon: Code2, label: 'Code Journal', href: '/journal' },
        { icon: Target, label: 'Topic Mastery', href: '/mastery' },
      ],
    },
    {
      section: 'Achievements',
      items: [
        { icon: Award, label: 'Certificates', href: '/certificates' },
        { icon: Trophy, label: 'Achievements', href: '/achievements' },
        { icon: BarChart3, label: 'My Progress', href: '/analytics' },
      ],
    },
  ];

  // ========= ADMIN MENU =========
  const adminMenu = [
    {
      section: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: TrendingUp, label: 'Class Analytics', href: '/admin/analytics' },
      ],
    },
    {
      section: 'Manage Students',
      items: [
        { icon: Users, label: 'All Students', href: '/admin/students' },
        { icon: BookMarked, label: 'Subjects', href: '/admin/subjects' },
        { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
      ],
    },
    {
      section: 'Assessments',
      items: [
        { icon: ClipboardList, label: 'Create Test', href: '/admin/tests/create' },
        { icon: GraduationCap, label: 'All Tests', href: '/admin/tests' },
        { icon: ShieldCheck, label: 'Anti-Cheat Logs', href: '/admin/anti-cheat' },
        { icon: FileText, label: 'Reports', href: '/admin/reports' },
      ],
    },
  ];

  const menuSections = isAdmin ? adminMenu : studentMenu;

  // Color accent based on role
  const accent = isAdmin ? 'red' : 'indigo';
  const gradientFrom = isAdmin ? 'from-red-500' : 'from-indigo-500';
  const gradientTo = isAdmin ? 'to-orange-500' : 'to-purple-600';

  return (
    <aside className="w-64 h-screen border-r border-gray-200 bg-[#fafafa] flex flex-col sticky top-0 shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-br text-white",
            gradientFrom, gradientTo
          )}>
            <Command className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-sm">AdaptLearn</p>
            <p className="text-[10px] text-gray-500">
              {isAdmin ? 'Teacher Portal' : 'Student Hub'}
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Action */}
      <div className="p-3 border-b border-gray-200">
        {isAdmin ? (
          <Link
            href="/admin/tests/create"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-md text-sm font-medium hover:from-red-600 hover:to-orange-600 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Test
          </Link>
        ) : (
          <Link
            href="/journal"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </Link>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {menuSections.map((section) => (
          <div key={section.section}>
            <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-2 text-gray-400">
              {section.section}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-white text-gray-900 font-medium shadow-sm border'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4",
                      isActive && (isAdmin ? 'text-red-600' : 'text-indigo-600')
                    )} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn(
            "w-9 h-9 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 text-white bg-gradient-to-br",
            gradientFrom, gradientTo
          )}>
            {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || (isAdmin ? 'AD' : 'ST')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {user?.full_name || (isAdmin ? 'Admin User' : 'Student')}
            </p>
            <p className="text-[10px] truncate text-gray-500">
              {isAdmin ? user?.employee_id : user?.usn}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors border bg-white hover:bg-gray-100 text-gray-700"
        >
          <LogOut className="w-3 h-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
