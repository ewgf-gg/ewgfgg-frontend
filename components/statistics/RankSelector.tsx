import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type RankCategory = 'allRanks' | 'masterRanks' | 'advancedRanks' | 'intermediateRanks' | 'beginnerRanks';

interface RankSelectorProps {
  selectedRank: RankCategory;
  onRankChange: (rank: RankCategory) => void;
}

const ranks = [
  { value: 'allRanks' as RankCategory, label: 'All Ranks' },
  { value: 'masterRanks' as RankCategory, label: 'Tekken God↑'},
  { value: 'advancedRanks' as RankCategory, label: 'Fujin→Tekken King' },
  { value: 'intermediateRanks' as RankCategory, label: 'Garyu→Battle Ruler' },
  { value: 'beginnerRanks' as RankCategory, label: 'Eliminator↓' }
];

export function RankSelector({ selectedRank, onRankChange }: RankSelectorProps) {
  return (
    <Select value={selectedRank} onValueChange={onRankChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select rank" />
      </SelectTrigger>
      <SelectContent>
        {ranks.map((rank) => (
          <SelectItem key={rank.value} value={rank.value}>
            {rank.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
