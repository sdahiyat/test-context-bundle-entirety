'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export interface NavItem {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  isCenter?: boolean;
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 ${active ? 'text-primary-600' : 'text-gray-400'}`}
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ChartBarIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 ${active ? 'text-primary-600' : 'text-gray-400'}`}
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 ${active ? 'text-primary-600' : 'text-gray-400'}`}
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (active) => <HomeIcon active={active} />,
  },
  {
    href: '/log',
    label: 'Log Meal',
    icon: () => <PlusCircleIcon />,
    isCenter: true,
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: (active) => <ChartBarIcon active={active} />,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active) => <UserIcon active={active} />,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-6 md:pb-0">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href) ?? false;

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 flex-1"
                aria-label={item.label}
              >
                <span className="bg-primary-600 rounded-full p-2 -mt-4 shadow-lg block">
                  {item.icon(isActive)}
                </span>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 flex-1 transition-colors"
              aria-label={item.label}
            >
              {item.icon(isActive)}
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
