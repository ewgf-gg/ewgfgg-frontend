'use client';

import Script from 'next/script';

export default function UmamiAnalytics() {
  return (
    <Script
      src="https://ewgf-analytics.vercel.app/script.js"
      data-website-id="67d0f3d6-9661-4dd4-be85-8fe17dbd4e3c"
      strategy="afterInteractive"
    />
  );
}
