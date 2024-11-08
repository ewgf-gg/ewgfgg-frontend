import {useState, useEffect} from 'react';
import React from 'react'
import { motion } from 'framer-motion';
import { useAtom } from "jotai";
import { characterWinratesAtom, characterPopularityAtom, characterIconMap, isLoadingAtom, errorMessageAtom } from '@/atoms/tekkenStatsAtoms';
import { Bar, BarChart, LabelList, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const winrateChangesData = [
  { character: "Lee", change: 4.2, trend: "increase" },
  { character: "Zafina", change: 3.8, trend: "increase" },
  { character: "Jack-8", change: -3.5, trend: "decrease" },
  { character: "Raven", change: -2.9, trend: "decrease" },
];

interface StatChartProps {
  title: string;
  description?: string;
  delay?: number;
}


const CustomYAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-140" y="-20" width="140" height="40">
        <div className="flex items-center gap-2 h-full">
          <img
            src={characterIconMap[payload.value]}
            alt={payload.value}
            className="w-8 h-10"
            style={{ overflow: 'visible'  }}
          />
          <span className="text-sm whitespace-nowrap">{payload.value}</span>
        </div>
      </foreignObject>
    </g>
  );
};


const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <img
            src={characterIconMap[label]}
            alt={label}
            className="w-6 h-6"
          />
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-sm">
          {payload[0].name}: {payload[0].value.toLocaleString()}
          {payload[0].name === 'Winrate' ? '%' : ''}
        </div>
      </div>
    );
  }
  return null;
};
const PopularityChart: React.FC<StatChartProps> = ({ title, description, delay = 0 }) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, []);

  const [rank, setRank] = React.useState("highRank");
  const [characterPopularity] = useAtom(characterPopularityAtom);

  const getAdjustedData = () => {
    const rankData = characterPopularity[rank as keyof typeof characterPopularity] || {};
    
    return Object.entries(rankData)
      .map(([character, totalBattles]) => ({
        character,
        count: totalBattles,
        originalCount: totalBattles
      }))
      .sort((a, b) => b.originalCount - a.originalCount);
  };

  const data = getAdjustedData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Select value={rank} onValueChange={setRank}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highRank">Tekken King+</SelectItem>
                <SelectItem value="mediumRank">Garyu→Bushin</SelectItem>
                <SelectItem value="lowRank">Eliminator-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {description && (
            <CardDescription>
              {rank === "highRank" 
                ? "Top 5 in Tekken King and above" 
                : rank === "mediumRank"
                ? "Top 5 from Garyu → Bushin"
                : "Top 5 in Eliminator and below"}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="w-full h-[200px]">
            <BarChart
              width={400}
              height={200}
              data={data}
              layout="vertical"
              margin={{ left: 100, right: 58, top: 8, bottom: 8 }}
            >
              <YAxis
                dataKey="character"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={<CustomYAxisTick />}
                width={60}
              />
              <XAxis type="number" hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
                animationBegin={isInitialRender ? 500 : 100}
                animationDuration={1000}
                animationEasing="ease"
              >
                <LabelList
                  dataKey="originalCount"
                  position="right"
                  formatter={(value: number) => value.toLocaleString()}
                />
              </Bar>
            </BarChart>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const WinrateChart: React.FC<StatChartProps> = ({ title, description, delay = 0 }) => {
  const [rank, setRank] = React.useState("highRank");
  const [characterWinrates] = useAtom(characterWinratesAtom);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, []);


  const getAdjustedData = () => {
    const rankData = characterWinrates[rank as keyof typeof characterWinrates] || {};
    
    return Object.entries(rankData)
      .map(([character, winrate]) => ({
        character,
        winrate,
        originalWinrate: winrate
      }))
      .sort((a, b) => b.originalWinrate - a.originalWinrate)
  };

  const data = getAdjustedData();
  
  const minWinrate = Math.floor(Math.min(...data.map(d => d.winrate)));
  const maxWinrate = Math.ceil(Math.max(...data.map(d => d.winrate)));
  
  const domainPadding = (maxWinrate - minWinrate) * 0.05;
  const domainMin = Math.max(0, minWinrate - domainPadding);
  const domainMax = Math.min(100, maxWinrate + domainPadding);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Select value={rank} onValueChange={setRank}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select rank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highRank">Tekken King+</SelectItem>
                <SelectItem value="mediumRank">Garyu→Bushin</SelectItem>
                <SelectItem value="lowRank">Eliminator-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {description && (
            <CardDescription>
              {rank === "highRank" 
                ? "Top 5 in Tekken King and above" 
                : rank === "mediumRank"
                ? "Top 5 from Garyu → Bushin"
                : "Top 5 in Eliminator and below"}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="w-full h-[200px]">
            <BarChart
              width={400}
              height={200}
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
                ticks={Array.from(
                  { length: 5 },
                  (_, i) => domainMin + (domainMax - domainMin) * (i / 4)
                )}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="winrate"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
                animationBegin={isInitialRender ? 750 : 100}
                animationDuration={1000}
                animationEasing="ease"
              >
                <LabelList
                  dataKey="originalWinrate"
                  position="right"
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                />
              </Bar>
            </BarChart>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


const WinrateChangesChart: React.FC<StatChartProps> = ({ title, description, delay = 0 }) => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="w-full h-[200px]">
            <BarChart
              width={400}
              height={200}
              data={winrateChangesData}
              layout="vertical"
              margin={{ left: 80, right: 48, top: 0, bottom: 0 }}
            >
              <YAxis
                dataKey="character"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text x={-10} y={0} dy={4} textAnchor="end" fill="currentColor">
                      {payload.value}
                    </text>
                  </g>
                )}
              />
              <XAxis type="number" hide />
              <Tooltip />
              <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} /> {/* Added center reference line */}
              <Bar
                dataKey="change"
                radius={[0, 4, 4, 0]}
                isAnimationActive={true}
                animationBegin={isInitialRender ? 900 : 100}
                animationDuration={1000}
                animationEasing="ease"
              >
                {winrateChangesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#22c55e' : '#ef4444'} />
                ))}
                <LabelList
                  dataKey="change"
                  position="right"
                  formatter={(value: number) => `${value > 0 ? '+' : ''}${value}%`}
                />
              </Bar>
            </BarChart>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};


export const StatsGrid: React.FC = () => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <PopularityChart
        title="Most Popular Characters"
        description="Top 5 most picked characters"
        delay={0.4}
      />
      <WinrateChart
        title="Highest Win Rates"
        description="Top 5 characters by win rate"
        delay={0.6}
      />
      <WinrateChangesChart
        title="Biggest Win Rate Changes"
        description="Most significant changes since last patch"
        delay={0.8}
      />
    </div>
  );
};

export default StatsGrid;