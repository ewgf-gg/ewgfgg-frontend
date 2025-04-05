import { TooltipProps } from "recharts";
import { characterIconMap } from '@/app/state/types/tekkenTypes';
import React from 'react';
import Image from 'next/image';

interface CustomTooltipPayload {
  name: string;
  value: number;
}

interface CustomTooltipProps extends Omit<TooltipProps<number, string>, 'payload'> {
  payload?: CustomTooltipPayload[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <Image
            src={characterIconMap[label]}
            alt={label}
            width={24}
            height={24}
            className="w-6 h-6"
            unoptimized
          />
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-sm">
          {payload[0].name}: {payload[0].value > 0 ? '+' : ''}{payload[0].value.toFixed(2)}%
        </div>
      </div>
    );
  }
  return null;
};
