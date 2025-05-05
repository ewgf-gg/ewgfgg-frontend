import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { circularCharacterIconMap } from '../../app/state/types/tekkenTypes';

interface MatchupCardProps {
  characterName: string;
  winRate: number;
  title: string;
  description?: string;
  hasLimitedData?: boolean;
}

const MatchupCard: React.FC<MatchupCardProps> = ({
  characterName,
  winRate,
  title,
  description,
  hasLimitedData
}) => {
  const iconPath = circularCharacterIconMap[characterName] || `/static/character-icons/${characterName.replace(/[\s-]/g, '')}T8.png`;
  
  return (
    <Card className="flex flex-col items-center">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-40 h-40 mb-2">
          <Image
            src={iconPath}
            alt={characterName}
            fill
            sizes="96px"
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="text-lg font-semibold">{characterName}</div>
        <div className={`text-2xl font-bold mt-1 ${winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
          {winRate.toFixed(2)}%
        </div>
        {hasLimitedData && (
          <div className="text-xs text-amber-400 mt-2 italic">* limited match data</div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchupCard;
