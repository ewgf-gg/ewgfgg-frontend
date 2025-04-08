import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastAccessed: number;
}

interface RateLimitStore {
  [ip: string]: RateLimitEntry;
}

const rateLimitStore: RateLimitStore = {};

const RATE_LIMIT_MAX = process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 50;
const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 1000 : 60 * 1000; 
const MAX_STORE_SIZE = process.env.RATE_LIMIT_MAX_STORE_SIZE ? parseInt(process.env.RATE_LIMIT_MAX_STORE_SIZE, 10) : 10000;

let lastCleanupTime = Date.now();
const CLEANUP_INTERVAL = process.env.RATE_LIMIT_CLEANUP_INTERVAL ? parseInt(process.env.RATE_LIMIT_CLEANUP_INTERVAL, 10) * 1000 : 10 * 60 * 1000; // 10 minutes in milliseconds


function cleanupExpiredEntries(now: number): void {
  for (const ip in rateLimitStore) {
    if (now > rateLimitStore[ip].resetTime) {
      delete rateLimitStore[ip];
    }
  }
}


function enforceStoreSize(): void {
  const storeSize = Object.keys(rateLimitStore).length;
  if (storeSize <= MAX_STORE_SIZE) return;

  const sortedIPs = Object.entries(rateLimitStore)
    .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)
    .map(([ip]) => ip);

  // Remove oldest entries until we're under the limit
  const entriesToRemove = storeSize - MAX_STORE_SIZE;
  for (let i = 0; i < entriesToRemove; i++) {
    delete rateLimitStore[sortedIPs[i]];
  }
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/player')) {
    return NextResponse.next();
  }

  const ip = request.ip || 'unknown';
  const now = Date.now();
  
  // Periodically clean up expired entries
  if (now - lastCleanupTime > CLEANUP_INTERVAL) {
    cleanupExpiredEntries(now);
    enforceStoreSize();
    lastCleanupTime = now;
  }
  
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
      lastAccessed: now
    };
  }
  
  if (now > rateLimitStore[ip].resetTime) {
    rateLimitStore[ip] = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
      lastAccessed: now
    };
  } else {
    // Update last accessed time
    rateLimitStore[ip].lastAccessed = now;
  }
  
  rateLimitStore[ip].count++;
  
  if (rateLimitStore[ip].count > RATE_LIMIT_MAX) {
    
    return new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: `Too many requests, please try again later`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    '/player/:path*',
  ],
};
