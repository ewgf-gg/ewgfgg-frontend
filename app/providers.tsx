'use client';

import { ThemeProvider } from "next-themes";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GoogleAnalytics />
      {children}
    </ThemeProvider>
  );
}
