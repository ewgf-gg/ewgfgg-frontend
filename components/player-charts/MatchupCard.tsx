import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { characterIconMap } from '@/app/state/types/tekkenTypes';

interface MatchupCardProps {
  characterName: string;
  winRate: number;
  title: string;
  description?: string;
}

const MatchupCard: React.FC<MatchupCardProps> = ({
  characterName,
  winRate,
  title,
  description
}) => {
  const iconPath = characterIconMap[characterName] || `/static/character-icons/${characterName.replace(/[\s-]/g, '')}T8.png`;
  
  return (
    <Card className="flex flex-col items-center">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-24 h-24 mb-2">
          <Image
            src={iconPath}
            alt={characterName}
            fill
            className="object-contain"
          />
        </div>
        <div className="text-lg font-semibold">{characterName}</div>
        <div className={`text-2xl font-bold mt-1 ${winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
          {winRate.toFixed(1)}%
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchupCard;
