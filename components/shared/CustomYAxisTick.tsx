import { characterIconMap } from '../../app/state/types/tekkenTypes';
import React from 'react';
import Image from 'next/image';

interface CustomYAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

export const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({ x = 0, y = 0, payload }) => {
  if (!payload) return null;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-140" y="-20" width="140" height="40">
        <div className="flex items-center gap-2 h-full">
          <Image
            src={characterIconMap[payload.value] || ''}
            alt={payload.value}
            width={32}
            height={40}
            className="w-8 h-10"
            style={{ overflow: 'visible' }}
            unoptimized
          />
          <span className="text-sm whitespace-nowrap">{payload.value}</span>
        </div>
      </foreignObject>
    </g>
  );
};

export default CustomYAxisTick;
