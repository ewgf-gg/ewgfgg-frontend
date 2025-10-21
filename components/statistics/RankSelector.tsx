import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllRanksInOrder } from '@/lib/statistics-utils';

interface RankSelectorProps {
  selectedRank: string;
  onRankChange: (rank: string) => void;
}

export function RankSelector({ selectedRank, onRankChange }: RankSelectorProps) {
  const ranks = [
    { value: 'allRanks', label: 'All Ranks', order: -1 },
    ...getAllRanksInOrder()
  ];

  return (
    <Select value={selectedRank} onValueChange={onRankChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select rank" />
      </SelectTrigger>
      <SelectContent>
        {ranks.map((rank) => (
          <SelectItem key={rank.value} value={rank.value}>
            {rank.value === 'allRanks' ? rank.label : `${rank.label}+`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
