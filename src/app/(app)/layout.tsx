'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
