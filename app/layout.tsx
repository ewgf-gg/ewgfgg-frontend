// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Russo_One } from "next/font/google";
import { Providers } from './providers';
import "./globals.css";
import React from 'react'
import GoogleAnalytics from '../components/GoogleAnalytics';
import UmamiAnalytics from '../components/UmamiAnalytics';
import GlobalStatsProvider from '../components/GlobalStatsProvider';
// Apply global revalidation every 30 seconds
export const revalidate = 30;
export const dynamic = 'force-dynamic'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const russoOne = Russo_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-russo-one",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ewgf.gg - TEKKEN 8 Statistics",
  description: "TEKKEN 8 Character Statistics, Player Profiles, Leaderboards, and Rank Distribution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body 
        suppressHydrationWarning
        className="min-h-screen bg-background font-sans antialiased"
      >
        <Providers>
          <GoogleAnalytics />
          <UmamiAnalytics />
          <GlobalStatsProvider />
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
