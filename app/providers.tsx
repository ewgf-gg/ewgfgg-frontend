'use client';

import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider } from 'next-themes';
import GlobalStatsProvider from '@/components/GlobalStatsProvider';
import React from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange
      >
        <GlobalStatsProvider />
        {children}
      </ThemeProvider>
    </JotaiProvider>
  );
}
