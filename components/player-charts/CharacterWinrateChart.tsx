// Modified winrate chart to reduce padding and height to 300px
/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import useWindowSize, { isMobileView } from '../../lib/hooks/useWindowSize';
import { SimpleChartCard } from '../shared/SimpleChartCard';
import { Battle, characterIdMap, characterIconMap, PlayedCharacter } from '../../app/state/types/tekkenTypes';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { characterColors } from '../../app/state/atoms/tekkenStatsAtoms';

interface CharacterWinrateChartProps {
  battles: Battle[];
  selectedCharacterId: number;
  playerName: string;
  polarisId: string;
  playedCharacters?: Record<string, PlayedCharacter>;
}

interface WinrateData {
  characterName: string;
  characterId: number;
  wins: number;
  losses: number;
  winRate: number;
  totalMatches: number;
}

interface CustomTooltipPayload {
  payload: WinrateData;
  value: number;
  name: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}

const CustomTooltip = React.memo<CustomTooltipProps>(({ active, payload }) => {
  if (active && payload?.[0]) {
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
              loading="lazy"
            />
          )}
          <p className="font-semibold">{data.characterName}</p>
        </div>
        <p>Wins: {data.wins}</p>
        <p>Losses: {data.losses}</p>
        <p>Winrate: {data.winRate.toFixed(1)}%</p>
        <p>Total: {data.totalMatches}</p>
        {data.totalMatches < 20 && (
          <p className="text-yellow-500 text-xs mt-1">* Limited data</p>
        )}
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

const CustomAxisTick: React.FC<any & { isMobile: boolean }> = ({ x = 0, y = 0, payload, isMobile }) => {
  if (!payload) return null;
  const iconPath = characterIconMap[payload.value];

  if (isMobile || !iconPath) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="currentColor" fontSize={10}>
          {payload.value}
        </text>
      </g>
    );
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject width={24} height={24} x={-12} y={0}>
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image src={iconPath} alt={payload.value} width={20} height={20} style={{ objectFit: 'contain' }} />
        </div>
      </foreignObject>
    </g>
  );
};

const getBarColor = (winrate: number): string => {
  if (winrate > 52) return '#4ade80';
  if (winrate >= 48) return '#facc15';
  return '#ef4444';
};

const WinrateLegend = () => (
  <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground mt-1">
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-[#4ade80]"></div>
      <span>&gt;52%</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-[#facc15]"></div>
      <span>48-52%</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-[#ef4444]"></div>
      <span>&lt;48%</span>
    </div>
  </div>
);

const CharacterWinrateChart: React.FC<CharacterWinrateChartProps> = ({ selectedCharacterId, playedCharacters }) => {
  const { width } = useWindowSize();
  const isMobile = isMobileView(width);
  const selectedCharName = characterIdMap[selectedCharacterId] || `Character ${selectedCharacterId}`;

  const chartData = useMemo(() => {
    const character = playedCharacters?.[selectedCharName];
    if (!character?.matchups) return [];
    return Object.entries(character.matchups).map(([opponentName, matchup]) => ({
      characterName: opponentName,
      characterId: Object.entries(characterIdMap).find(([_, name]) => name === opponentName)?.[0] || 0,
      wins: matchup.wins,
      losses: matchup.losses,
      winRate: matchup.winRate,
      totalMatches: matchup.totalMatches
    })).sort((a, b) => b.winRate - a.winRate);
  }, [selectedCharName, playedCharacters]);

  if (chartData.length === 0) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>;
  }

  return (
    <div className="h-[385px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout={isMobile ? 'vertical' : 'horizontal'}
          margin={isMobile ? { top: 5, right: 10, left: 10, bottom: 5 } : { top: 5, right: 10, left: 10, bottom: 25 }}
        >
          {isMobile ? (
            <>
              <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} fontSize={10} />
              <YAxis dataKey="characterName" type="category" width={35} tick={<CustomAxisTick isMobile={true} />} />
              <ReferenceLine x={50} stroke="#666" strokeDasharray="3 3" strokeWidth={1} />
            </>
          ) : (
            <>
              <XAxis dataKey="characterName" height={35} tick={<CustomAxisTick isMobile={false} />} interval={0} />
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `${v}%`} fontSize={10} />
              <ReferenceLine y={50} stroke="#666" strokeDasharray="3 3" strokeWidth={1} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="winRate" radius={isMobile ? [0, 4, 4, 0] : [4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.winRate)} opacity={entry.totalMatches < 20 ? 0.5 : 1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* <WinrateLegend /> */}
    </div>
  );
};

export default React.memo(CharacterWinrateChart);