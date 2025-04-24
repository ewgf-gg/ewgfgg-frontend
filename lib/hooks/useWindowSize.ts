'use client';

import { useState, useLayoutEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Custom hook to detect window size and track viewport dimensions
 * @returns Current window dimensions (width and height)
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    // measure & paint before first render
    handleResize();
    window.addEventListener('resize', handleResize);
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
