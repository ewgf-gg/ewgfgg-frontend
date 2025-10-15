import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type RankCategory = 
  | 'allRanks'
  | 'tekkenGodPlus'
  | 'tekkenKingPlus'
  | 'bushinPlus'
  | 'kishinPlus'
  | 'raijinPlus'
  | 'fujinPlus'
  | 'battleRulerPlus'
  | 'flameRulerPlus'
  | 'mightyRulerPlus'
  | 'tenryuPlus'
  | 'shinryuPlus'
  | 'garyuPlus'
  | 'eliminatorPlus'
  | 'destroyerPlus'
  | 'vanquisherPlus'
  | 'dominatorPlus'
  | 'assailantPlus'
  | 'warriorPlus'
  | 'cavalryPlus'
  | 'rangerPlus'
  | 'brawlerPlus'
  | 'combatantPlus'
  | 'strategistPlus'
  | 'fighterPlus';

interface RankSelectorProps {
  selectedRank: RankCategory;
  onRankChange: (rank: RankCategory) => void;
}

const ranks = [
  { value: 'allRanks' as RankCategory, label: 'All Ranks' },
  { value: 'tekkenGodPlus' as RankCategory, label: 'Tekken God+' },
  { value: 'tekkenKingPlus' as RankCategory, label: 'Tekken King+' },
  { value: 'bushinPlus' as RankCategory, label: 'Bushin+' },
  { value: 'kishinPlus' as RankCategory, label: 'Kishin+' },
  { value: 'raijinPlus' as RankCategory, label: 'Raijin+' },
  { value: 'fujinPlus' as RankCategory, label: 'Fujin+' },
  { value: 'battleRulerPlus' as RankCategory, label: 'Battle Ruler+' },
  { value: 'flameRulerPlus' as RankCategory, label: 'Flame Ruler+' },
  { value: 'mightyRulerPlus' as RankCategory, label: 'Mighty Ruler+' },
  { value: 'tenryuPlus' as RankCategory, label: 'Tenryu+' },
  { value: 'shinryuPlus' as RankCategory, label: 'Shinryu+' },
  { value: 'garyuPlus' as RankCategory, label: 'Garyu+' },
  { value: 'eliminatorPlus' as RankCategory, label: 'Eliminator+' },
  { value: 'destroyerPlus' as RankCategory, label: 'Destroyer+' },
  { value: 'vanquisherPlus' as RankCategory, label: 'Vanquisher+' },
  { value: 'dominatorPlus' as RankCategory, label: 'Dominator+' },
  { value: 'assailantPlus' as RankCategory, label: 'Assailant+' },
  { value: 'warriorPlus' as RankCategory, label: 'Warrior+' },
  { value: 'cavalryPlus' as RankCategory, label: 'Cavalry+' },
  { value: 'rangerPlus' as RankCategory, label: 'Ranger+' },
  { value: 'brawlerPlus' as RankCategory, label: 'Brawler+' },
  { value: 'combatantPlus' as RankCategory, label: 'Combatant+' },
  { value: 'strategistPlus' as RankCategory, label: 'Strategist+' },
  { value: 'fighterPlus' as RankCategory, label: 'Fighter+' },
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
