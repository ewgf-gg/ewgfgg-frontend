'use client';

import Script from 'next/script';
import { Suspense } from 'react';
import { GA_MEASUREMENT_ID } from '../lib/hooks/useGoogleAnalytics';
import useGoogleAnalytics from '../lib/hooks/useGoogleAnalytics';

function Analytics() {
  useGoogleAnalytics();
  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Suspense>
        <Analytics />
      </Suspense>
    </>
  );
}
