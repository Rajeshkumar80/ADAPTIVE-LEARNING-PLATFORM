'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Calendar,
  Brain,
  Users,
  FileText,
  BarChart3,
  Trophy,
  Award,
  ClipboardList,
  ShieldCheck,
  Target,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const studentMenu = [
    {
      section: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: BarChart3, label: 'Progress', href: '/analytics' },
      ],
    },
    {
      section: 'Learn',
      items: [
        { icon: BookOpen, label: 'Subjects', href: '/courses' },
        { icon: Brain, label: 'AI Tutor', href: '/ai-tutor' },
        { icon: Calendar, label: 'Planner', href: '/planner' },
        { icon: Target, label: 'Mastery', href: '/mastery' },
        { icon: GraduationCap, label: 'VTU Subjects', href: '/vtu-subjects' },
      ],
    },
    {
      section: 'Practice',
      items: [
        { icon: GraduationCap, label: 'Tests', href: '/tests' },
      ],
    },
    {
      section: 'Achievements',
      items: [
        { icon: Award, label: 'Certificates', href: '/certificates' },
        { icon: Trophy, label: 'Badges', href: '/achievements' },
      ],
    },
    {
      section: 'Account',
      items: [
        { icon: Users, label: 'Profile', href: '/profile' },
      ],
    },
  ];

  const adminMenu = [
    {
      section: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
      ],
    },
    {
      section: 'Manage',
      items: [
        { icon: Users, label: 'Students', href: '/admin/students' },
        { icon: BookOpen, label: 'Subjects', href: '/admin/subjects' },
      ],
    },
    {
      section: 'Assess',
      items: [
        { icon: ClipboardList, label: 'Create Test', href: '/admin/tests/create' },
        { icon: GraduationCap, label: 'All Tests', href: '/admin/tests' },
        { icon: ShieldCheck, label: 'Anti-Cheat', href: '/admin/anti-cheat' },
        { icon: FileText, label: 'Reports', href: '/admin/reports' },
      ],
    },
    {
      section: 'Communicate',
      items: [
        { icon: Award, label: 'Notifications', href: '/admin/notifications' },
      ],
    },
  ];

  const menuSections = isAdmin ? adminMenu : studentMenu;

  return (
    <aside className="w-60 h-screen border-r border-border bg-background flex flex-col sticky top-0 shrink-0" suppressHydrationWarning>
      {/* Brand */}
      <div className="px-5 h-14 flex items-center border-b border-border">
        <Link href={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">A</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-sm tracking-tight">AdaptLearn</span>
            <span className="text-[10px] text-muted-foreground">
              {isAdmin ? '/ admin' : '/ student'}
            </span>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuSections.map((section) => (
          <div key={section.section}>
            <p className="px-2 mb-1.5 text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
              {section.section}
            </p>
            <div className="space-y-px">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      'flex items-center gap-2.5 px-2 h-8 rounded-md text-sm transition-all duration-150 press-effect',
                      isActive
                        ? 'bg-primary/10 text-foreground font-medium border-l-2 border-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground"
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
      <div className="border-t border-border p-3">
        <div className="group flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-md bg-primary/20 text-primary flex items-center justify-center text-[10px] font-semibold shrink-0">
            {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || (isAdmin ? 'AD' : 'ST')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate leading-tight">
              {user?.full_name || (isAdmin ? 'Admin' : 'Student')}
            </p>
            <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
              {isAdmin ? user?.employee_id : user?.usn}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground"
            title="Sign out"
            suppressHydrationWarning
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
