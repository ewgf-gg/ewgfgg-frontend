import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RankCategory = 'highRank' | 'mediumRank' | 'lowRank';

interface RankSelectorProps {
  selectedRank: RankCategory;
  onRankChange: (rank: RankCategory) => void;
}

const ranks = [
  { value: 'highRank' as RankCategory, label: 'Tekken King↑' },
  { value: 'mediumRank' as RankCategory, label: 'Garyu→Bushin' },
  { value: 'lowRank' as RankCategory, label: 'Eliminator↓' }
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
