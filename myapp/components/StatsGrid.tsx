import React from 'react';
import { motion } from 'framer-motion';
import { useAtom } from "jotai";
import { characterWinratesAtom, isLoadingAtom, errorMessageAtom } from '@/atoms/tekkenStatsAtoms';
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
import { useStatisticsData } from '@/hooks/useStatisticsData';

// Mock data (same as before)
const characterPopularityData = {
  high: [
    { character: "Jin", count: 2500 },
    { character: "Kazuya", count: 2200 },
    { character: "Bryan", count: 1800 },
    { character: "Law", count: 1600 },
    { character: "Paul", count: 1400 },
  ],
  low: [
    { character: "Law", count: 3000 },
    { character: "Paul", count: 2800 },
    { character: "Jin", count: 2000 },
    { character: "Hwoarang", count: 1900 },
    { character: "King", count: 1700 },
  ],
};



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

const PopularityChart: React.FC<StatChartProps> = ({ title, description, delay = 0 }) => {
  const [rank, setRank] = React.useState("high");

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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Tekken King+</SelectItem>
                <SelectItem value="low">Garyu-Bushin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="w-full h-[200px]">
            <BarChart
              width={400}
              height={200}
              data={characterPopularityData[rank as keyof typeof characterPopularityData]}
              layout="vertical"
              margin={{ left: 80, right: 48, top: 0, bottom: 0 }}
            >
              <YAxis
                dataKey="character"
                type="category"
                axisLine={false}
                tickLine={false}
              />
              <XAxis type="number" hide />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="count"
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

  const getAdjustedData = () => {
    const rankData = characterWinrates[rank as keyof typeof characterWinrates] || {};
    
    return Object.entries(rankData)
      .map(([character, winrate]) => ({
        character,
        winrate,
        originalWinrate: winrate
      }))
      .sort((a, b) => b.originalWinrate - a.originalWinrate);
  };

  const data = getAdjustedData();
  
  // Calculate the domain dynamically
  const minWinrate = Math.floor(Math.min(...data.map(d => d.winrate)));
  const maxWinrate = Math.ceil(Math.max(...data.map(d => d.winrate)));
  
  // Add some padding to the domain (5% on each side)
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
                <SelectItem value="lowRank">Bushin-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {description && (
            <CardDescription>
              {rank === "highRank" 
                ? "Top 5 in Tekken King and above" 
                : "Top 5 in Bushin and under"}
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
              margin={{ left: 80, right: 48, top: 0, bottom: 0 }}
            >
              <YAxis
                dataKey="character"
                type="category"
                axisLine={false}
                tickLine={false}
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
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Winrate']}
              />
              <Bar
                dataKey="winrate"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
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