'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, ClipboardList, CheckSquare } from 'lucide-react';

const navItems = [
  { href: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/teacher/grading', label: 'Grading', icon: CheckSquare },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-center py-6 px-4">
      <div className="relative inline-flex items-center gap-1 px-2 py-2 rounded-[500px] border border-[#3f3f3f] bg-gradient-to-b from-[#141414] to-[#242424] shadow-[inset_10px_0_10px_rgba(0,0,0,0.5)] overflow-x-auto">
        {/* Decorative bubble elements */}
        <div className="absolute -inset-[5px] rounded-[500px] bg-gradient-to-b from-[#3f3f3f] to-[#212121] -z-10" />
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-4 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                'flex items-center gap-2 whitespace-nowrap',
                isActive
                  ? 'bg-white text-[#1f1f1f] shadow-sm'
                  : 'text-white hover:text-white/90'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
