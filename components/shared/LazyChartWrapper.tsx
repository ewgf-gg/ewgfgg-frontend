'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChartSkeleton } from './ChartSkeleton';

interface LazyChartWrapperProps {
  children: React.ReactNode;
  height?: string;
  rootMargin?: string;
}

export const LazyChartWrapper: React.FC<LazyChartWrapperProps> = ({ 
  children, 
  height = '400px',
  rootMargin = '100px' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin, // Load slightly before element enters viewport
        threshold: 0.01
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? children : <ChartSkeleton height={height} />}
    </div>
  );
};
