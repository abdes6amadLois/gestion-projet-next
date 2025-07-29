'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { hasPermission } from '@/utils/permissions';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Settings, 
  Calendar,
  BarChart3,
  Shield 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }, // accessible à tous
  { name: 'Projects', href: '/projects', icon: FolderOpen, permission: 'voir projets' },
  { name: 'Team', href: '/team', icon: Users, permission: 'voir users' },
  { name: 'Roles', href: '/role', icon: Shield, permission: 'voir roles' },
  { name: 'Calendar', href: '/calendar', icon: Calendar, permission: 'voir calendar' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, permission: 'voir analytics' },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [filteredNav, setFilteredNav] = useState<typeof navigation>([]);

  useEffect(() => {
    const filtered = navigation.filter(item =>
      !item.permission || hasPermission(item.permission)
    );
    console.log(hasPermission('voir users'));
    setFilteredNav(filtered);
  }, []);

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50">
      <div className="flex h-full flex-col pt-5">
        <nav className="flex-1 space-y-1 px-2 pb-4">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-primary-foreground' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};