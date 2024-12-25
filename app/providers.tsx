'use client';

import { ThemeProvider } from "next-themes";
import useGoogleAnalytics from "@/lib/hooks/useGoogleAnalytics";

export function Providers({ children }: { children: React.ReactNode }) {
  useGoogleAnalytics();
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
