import React from 'react';

interface ChartSkeletonProps {
  height?: string;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ height = '400px' }) => {
  return (
    <div 
      className="w-full bg-gray-800/50 rounded-lg border border-gray-700 animate-pulse"
      style={{ height }}
    >
      <div className="p-6 space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        
        {/* Chart area skeleton */}
        <div className="flex items-end justify-between gap-2 mt-8 h-48">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="bg-gray-700 rounded-t w-full"
              style={{ 
                height: `${30 + Math.random() * 70}%`,
                animationDelay: `${i * 0.1}s` 
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
