'use client';

import { Suspense } from 'react';
import useGoogleAnalytics from '../lib/hooks/useGoogleAnalytics';

function GoogleAnalyticsInner() {
  useGoogleAnalytics();
  return null;
}

export default function GoogleAnalytics() {
  return (
    <Suspense>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}
