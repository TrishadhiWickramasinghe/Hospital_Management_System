'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Calendar,
  Stethoscope,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { role, logout, user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      {
        label: 'Dashboard',
        href: `/${role?.toLowerCase()}`,
        icon: LayoutDashboard,
        visible: true,
      },
    ];

    const roleSpecificItems: Record<string, any[]> = {
      ADMIN: [
        {
          label: 'Users',
          href: '/admin/users',
          icon: Users,
          visible: true,
        },
        {
          label: 'Departments',
          href: '/admin/departments',
          icon: Stethoscope,
          visible: true,
        },
        {
          label: 'Reports',
          href: '/admin/reports',
          icon: FileText,
          visible: true,
        },
        {
          label: 'Settings',
          href: '/admin/settings',
          icon: Settings,
          visible: true,
        },
      ],
      DOCTOR: [
        {
          label: 'Patients',
          href: '/doctor/patients',
          icon: Users,
          visible: true,
        },
        {
          label: 'Appointments',
          href: '/doctor/appointments',
          icon: Calendar,
          visible: true,
        },
        {
          label: 'Medical Records',
          href: '/doctor/records',
          icon: FileText,
          visible: true,
        },
      ],
      NURSE: [
        {
          label: 'Patients',
          href: '/nurse/patients',
          icon: Users,
          visible: true,
        },
        {
          label: 'Tasks',
          href: '/nurse/tasks',
          icon: Calendar,
          visible: true,
        },
      ],
      RECEPTIONIST: [
        {
          label: 'Appointments',
          href: '/receptionist/appointments',
          icon: Calendar,
          visible: true,
        },
        {
          label: 'Patients',
          href: '/receptionist/patients',
          icon: Users,
          visible: true,
        },
      ],
    };

    return [...baseItems, ...(roleSpecificItems[role || ''] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">HMS</h1>
        <p className="text-sm text-slate-400 mt-1">
          {role ? role.charAt(0) + role.slice(1).toLowerCase() : 'User'} Portal
        </p>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={20} />
          <span className="ml-2">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
