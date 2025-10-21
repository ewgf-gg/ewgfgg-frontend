import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegionSelectorProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

// Region values match the API response format
const regions = [
  { value: 'global', label: 'Global' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Middle East', label: 'Middle East' },
  { value: 'Oceania', label: 'Oceania' },
  { value: 'Americas', label: 'Americas' },
  { value: 'Europe', label: 'Europe' }
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
