import React from 'react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { TopBar } from '@/components/navigation/TopBar';

export interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  hideBottomNav?: boolean;
  hideTopBar?: boolean;
}

export function AppShell({
  children,
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
  hideBottomNav = false,
  hideTopBar = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideTopBar && (
        <TopBar
          title={title}
          subtitle={subtitle}
          showBack={showBack}
          onBack={onBack}
          rightAction={rightAction}
        />
      )}

      <main className="flex-1 overflow-y-auto pb-20 max-w-lg mx-auto w-full">
        {children}
      </main>

      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

export default AppShell;
