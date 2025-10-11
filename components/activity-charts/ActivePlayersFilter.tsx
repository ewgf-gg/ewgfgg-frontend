'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { rankOrderMap, Regions } from '@/app/state/types/tekkenTypes';
import { ActivePlayersFilters } from '@/app/state/types/ActivityPageTypes';

interface ActivePlayersFilterProps {
  filters: ActivePlayersFilters;
  onFilterChange: (filters: ActivePlayersFilters) => void;
}

export const ActivePlayersFilter: React.FC<ActivePlayersFilterProps> = ({ filters, onFilterChange }) => {
  const handleRankChange = (rank: string) => {
    onFilterChange({ ...filters, rank });
  };

  const handleRegionChange = (region: string) => {
    onFilterChange({ ...filters, region });
  };

  // Create rank options from rankOrderMap
  const rankOptions = Object.entries(rankOrderMap)
    .filter(([key]) => {
      const numKey = parseInt(key);
      return numKey >= 0 && numKey <= 37; // Filter valid ranks only
    })
    .map(([key, value]) => ({
      value: key,
      label: value
    }));

  // Create region options from Regions
  const regionOptions = Object.entries(Regions)
    .filter(([key]) => parseInt(key) >= 0) // Filter out N/A
    .map(([key, value]) => ({
      value: key,
      label: value
    }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filter Active Players</CardTitle>
          <CardDescription className="text-gray-400">View players currently active by rank and region</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Rank</label>
            <Select value={filters.rank} onValueChange={handleRankChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">All Ranks</SelectItem>
                {rankOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Region</label>
            <Select value={filters.region} onValueChange={handleRegionChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};
