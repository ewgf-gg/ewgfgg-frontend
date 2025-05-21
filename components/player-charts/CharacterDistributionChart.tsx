// Optimized character distribution chart with full-width desktop and 348px max-width mobile
'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import useWindowSize, { isMobileView } from '../../lib/hooks/useWindowSize';
import {
  Battle,
  characterIdMap,
  characterIconMap
} from '../../app/state/types/tekkenTypes';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { characterColors } from '../../app/state/atoms/tekkenStatsAtoms';

interface CharacterDistributionChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
  polarisId: string;
}

interface DistributionData {
  characterName: string;
  characterId: number;
  totalMatches: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: DistributionData;
    value: number;
    name: string;
    dataKey: string;
  }>;
  label?: string;
}

interface CustomAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  isMobile: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const iconPath = characterIconMap[data.characterName];

    return (
      <div className="bg-background border border-border p-1 rounded-md text-xs">
        <div className="flex items-center gap-1 mb-1">
          {iconPath && (
            <Image
              src={iconPath}
              alt={data.characterName}
              width={16}
              height={16}
              style={{ objectFit: 'contain' }}
            />
          )}
          <p className="font-semibold">{data.characterName}</p>
        </div>
        <p>Total Matches: {data.totalMatches}</p>
      </div>
    );
  }
  return null;
};

const CustomAxisTick: React.FC<CustomAxisTickProps> = ({ x = 0, y = 0, payload, isMobile }) => {
  if (!payload) return null;
  const label = payload.value;
  const iconPath = characterIconMap[label];

  if (!isMobile && iconPath) {
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject width={28} height={28} x={-14} y={0}>
          <div className="flex items-center justify-center w-full h-full">
            <Image src={iconPath} alt={label} width={24} height={24} unoptimized />
          </div>
        </foreignObject>
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-5}
        y={0}
        dy={4}
        textAnchor="end"
        fill="currentColor"
        fontSize={12}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
};

const CharacterDistributionChart: React.FC<CharacterDistributionChartProps> = ({
  battles,
  selectedCharacterId,
  polarisId
}) => {
  const colors = useAtomValue(characterColors);
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);

  const { chartData, maxMatches, yAxisTicks } = useMemo(() => {
    if (selectedCharacterId === null || selectedCharacterId === undefined) {
      return { chartData: [], maxMatches: 10, yAxisTicks: [0, 2, 4, 6, 8, 10] };
    }

    const characterBattles = battles.filter(battle => {
      const isPlayer1 = battle.player1PolarisId === polarisId;
      return isPlayer1
        ? battle.player1CharacterId === selectedCharacterId
        : battle.player2CharacterId === selectedCharacterId;
    });

    const distributionData = characterBattles.reduce<Record<string, DistributionData>>(
      (acc, battle) => {
        const isPlayer1 = battle.player1PolarisId === polarisId;
        const opponentCharId = isPlayer1 ? battle.player2CharacterId : battle.player1CharacterId;
        const characterName = characterIdMap[opponentCharId] || `Character ${opponentCharId}`;

        if (!acc[characterName]) {
          acc[characterName] = {
            characterName,
            characterId: opponentCharId,
            totalMatches: 0
          };
        }

        acc[characterName].totalMatches++;
        return acc;
      },
      {}
    );

    const sortedData = Object.values(distributionData).sort(
      (a, b) => b.totalMatches - a.totalMatches
    );
    const max =
      sortedData.length > 0
        ? Math.ceil(Math.max(...sortedData.map(d => d.totalMatches)) / 5) * 5
        : 10;
    const ticks = Array.from({ length: 6 }, (_, i) => Math.round((max / 5) * i));

    return { chartData: sortedData, maxMatches: max, yAxisTicks: ticks };
  }, [battles, selectedCharacterId, polarisId]);

  if (selectedCharacterId === null || selectedCharacterId === undefined || chartData.length === 0) {
    return (
      <div className="h-[360px] flex items-center justify-center text-muted-foreground text-sm">
        No matches found
      </div>
    );
  }

  return (
    <div className={`h-[360px] ${isMobile ? 'max-w-[348px] overflow-hidden w-full' : 'w-full'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout={isMobile ? 'vertical' : 'horizontal'}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {isMobile ? (
            <>
              <XAxis
                type="number"
                domain={[0, maxMatches]}
                ticks={yAxisTicks}
                fontSize={12}
                stroke="#666"
              />
              <YAxis
                dataKey="characterName"
                type="category"
                width={90}
                tick={<CustomAxisTick isMobile={true} />}
                tickLine={false}
                axisLine={false}
                interval={0}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="characterName"
                height={40}
                tick={<CustomAxisTick isMobile={false} />}
                interval={0}
              />
              <YAxis
                domain={[0, maxMatches]}
                ticks={yAxisTicks}
                fontSize={12}
                stroke="#666"
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="totalMatches" radius={isMobile ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
            {chartData.map(entry => {
              const colorMapping = colors.find(c => c.id === entry.characterId.toString());
              return (
                <Cell
                  key={`cell-${entry.characterName}`}
                  fill={colorMapping?.color || '#718096'}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(CharacterDistributionChart);