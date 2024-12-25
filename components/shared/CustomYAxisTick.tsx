import { characterIconMap } from '../../app/state/types/tekkenTypes';
import React from 'react';

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
          <img
            src={characterIconMap[payload.value] || ''}
            alt={payload.value}
            className="w-8 h-10"
            style={{ overflow: 'visible' }}
          />
          <span className="text-sm whitespace-nowrap">{payload.value}</span>
        </div>
      </foreignObject>
    </g>
  );
};

export default CustomYAxisTick;
