'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, ClipboardList, CheckSquare, FileText, Users } from 'lucide-react';
import { getPendingSubmissionsCount } from '@/lib/services/submissions';
import { supabase } from '@/lib/supabase/client';

const navItems = [
  { href: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/teacher/classes', label: 'Classes', icon: Users },
  { href: '/teacher/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/teacher/assignments', label: 'Assignments', icon: ClipboardList },
  { href: '/teacher/tests', label: 'Tests', icon: FileText },
  { href: '/teacher/grading', label: 'Grading', icon: CheckSquare },
];

export function Navigation() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Fetch pending submissions count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        // Use authenticated user ID or fallback to test teacher ID (consistent with other teacher pages)
        const teacherId = user?.id || '5be95487-e1e3-4857-a260-a21b3ef0960a';
        
        if (error || !user) {
          console.warn('No authenticated user found, using test user ID');
        }

        const result = await getPendingSubmissionsCount(teacherId);
        if (result.data !== null) {
          setPendingCount(result.data);
          console.log('Pending submissions count:', result.data);
        } else if (result.error) {
          console.error('Error getting pending count:', result.error);
        }
      } catch (err) {
        // Fail silently - don't show badge on error
        console.error('Error fetching pending count:', err);
        setPendingCount(0);
      }
    };

    fetchPendingCount();
    
    // Refresh count when pathname changes (user navigates)
    // This ensures badge updates after grading submissions
    const interval = setInterval(fetchPendingCount, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <nav className="flex justify-center py-6 px-4">
      <div className="relative inline-flex items-center gap-1 px-2 py-2 rounded-[500px] border border-[#3f3f3f] bg-gradient-to-b from-[#141414] to-[#242424] shadow-[inset_10px_0_10px_rgba(0,0,0,0.5)] overflow-x-auto overflow-y-visible">
        {/* Decorative bubble elements */}
        <div className="absolute -inset-[5px] rounded-[500px] bg-gradient-to-b from-[#3f3f3f] to-[#212121] -z-10" />
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(item.href));
          const isGradingItem = item.href === '/teacher/grading';
          const shouldShowBadge = isGradingItem && pendingCount > 0;
          
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
              <Icon className="w-4 h-4 relative">
                {shouldShowBadge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg z-10">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </Icon>
              <span className="hidden sm:inline">{item.label}</span>
              {shouldShowBadge && (
                <span className="hidden sm:flex ml-1 h-5 w-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
