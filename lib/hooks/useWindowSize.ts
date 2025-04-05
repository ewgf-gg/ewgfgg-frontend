'use client';

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Custom hook to detect window size and track viewport dimensions
 * @returns Current window dimensions (width and height)
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Helper function to determine if the current viewport is mobile-sized
 * @param width Current window width
 * @param breakpoint Breakpoint for mobile devices (default: 768px)
 * @returns Boolean indicating if the viewport is mobile-sized
 */
export function isMobileView(width: number, breakpoint = 768): boolean {
  return width < breakpoint;
}

export default useWindowSize;
