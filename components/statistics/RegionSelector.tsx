import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Regions } from '@/app/state/types/tekkenTypes';

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

// Map numeric region IDs to their string values, excluding N/A (-1)
const regions = [
  { value: 'global', label: 'Global' },
  ...Object.entries(Regions)
    .filter(([key]) => key !== '-1')
    .map(([key, value]) => ({
      value: key,
      label: value
    }))
];

export function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  return (
    <Select value={selectedRegion} onValueChange={onRegionChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select region" />
      </SelectTrigger>
      <SelectContent>
        {regions.map((region) => (
          <SelectItem key={region.value} value={region.value}>
            {region.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
