import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NutriTrack - AI-Powered Nutrition Tracking',
  description:
    'Track your nutrition with AI-powered meal logging, macro tracking, and personalized insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-gray-900`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
