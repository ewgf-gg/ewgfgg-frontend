// components/charts/WinrateChart.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { characterWinratesAtom, characterColors } from '../../app/state/atoms/tekkenStatsAtoms';
import { ChartCard } from '../shared/ChartCard';
import { CustomYAxisTick } from '../shared/CustomYAxisTick';
import { CustomTooltip } from '../shared/CustomTooltip';
import { ChartProps } from '../../app/state/types/tekkenTypes';
import { characterIdMap } from '../../app/state/types/tekkenTypes';

export const WinrateChart: React.FC<Omit<ChartProps, 'rank' | 'onRankChange'>> = (props) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [rank, setRank] = useState("masterRanks");
  const [characterWinrates] = useAtom(characterWinratesAtom);
  const colors = useAtomValue(characterColors);

  useEffect(() => {
    if (isInitialRender) setIsInitialRender(false);
  }, []);

  const { data, domainMin, domainMax } = useMemo(() => {
    const rankData = characterWinrates[rank as keyof typeof characterWinrates]?.globalStats || {};
    
    const chartData = Object.entries(rankData)
      .map(([character, winrate]) => {
        // Find character ID by looking up the character name in the values
        const characterId = Object.entries(characterIdMap)
        // eslint-disable-next-line
          .find(([_, name]) => name === character)?.[0];
        return {
          character,
          characterId: characterId ? parseInt(characterId) : -1,
          winrate,
          originalWinrate: winrate
        };
      })
      .sort((a, b) => b.originalWinrate - a.originalWinrate);
    
    const minWinrate = Math.floor(Math.min(...chartData.map(d => d.winrate)));
    const maxWinrate = Math.ceil(Math.max(...chartData.map(d => d.winrate)));
    const domainPadding = (maxWinrate - minWinrate) * 0.05;
    
    return {
      data: chartData,
      domainMin: Math.max(0, minWinrate - domainPadding),
      domainMax: Math.min(100, maxWinrate + domainPadding)
    };
  }, [characterWinrates, rank]);

  const ticks = useMemo(() => {
    return Array.from(
      { length: 5 },
      (_, i) => domainMin + (domainMax - domainMin) * (i / 4)
    );
  }, [domainMin, domainMax]);

  return (
    <ChartCard {...props} rank={rank} onRankChange={setRank}>
      <div className="w-full" style={{ minHeight: "200px" }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 100, right: 58, top: 2, bottom: -12 }}
      >
        <YAxis
          dataKey="character"
          type="category"
          axisLine={false}
          tickLine={false}
          tick={<CustomYAxisTick />}
          width={60}
        />
        <XAxis
          type="number"
          domain={[domainMin, domainMax]}
          tickFormatter={(value) => `${value.toFixed(1)}%`}
          ticks={ticks}
          axisLine={false}
          tickLine={false}
          tick={false}
        />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={false}
          />
        <Bar
          dataKey="winrate"
          radius={[0, 4, 4, 0]}
          isAnimationActive={true}
          animationBegin={isInitialRender ? 750 : 100}
          animationDuration={1000}
          animationEasing="ease"
        >
          {data.map((entry) => {
            const colorMapping = entry.characterId !== -1 
              ? colors.find(c => c.id === entry.characterId.toString()) 
              : null;
            return (
              <Cell 
                key={`cell-${entry.character}`} 
                fill={colorMapping?.color || 'hsl(var(--primary))'}
              />
            );
          })}
          <LabelList
            dataKey="originalWinrate"
            position="right"
            formatter={(value: number) => `${value.toFixed(2)}%`}
            style={{ fontSize: '14px' }}
          />
        </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
