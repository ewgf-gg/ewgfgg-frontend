"use client"

import React, { useState } from 'react';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white py-2 px-4 text-center relative">
      <div className="container mx-auto">
        <p className="font-medium">
          <span className="font-bold">⚠️ Website Upgrade in Progress:</span> Rolling out a new feature!! Should be live in 2-3 hours. Battle updates will be paused! 
        </p>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Close announcement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
