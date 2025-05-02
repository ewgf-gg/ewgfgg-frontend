"use client"

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { TooltipProvider, Tooltip, TooltipTrigger } from '../ui/tooltip';
import { ChartContainer } from '../ui/chart';
import { StatPentagonTooltip } from './StatPentagonTooltip';
import { StatPentagonData } from '@/app/state/types/tekkenTypes';


interface StatPentagonChartProps {
  stats: StatPentagonData;
  isLoading?: boolean;
}

export const StatPentagonChart: React.FC<StatPentagonChartProps> = ({ stats }) => {
  // Transform stats into the format needed for the radar chart
  const chartData = useMemo(() => [
    { subject: 'Attack', value: stats.attack, fullMark: 100 },
    { subject: 'Technique', value: stats.technique, fullMark: 100 },
    { subject: 'Spirit', value: stats.spirit, fullMark: 100 },
    { subject: 'Appeal', value: stats.appeal, fullMark: 100 },
    { subject: 'Defense', value: stats.defense, fullMark: 100 },
  ], [stats]);

  // Custom chart config for styling with modern gradient colors
  const chartConfig = {
    radar: {
      label: "Radar",
      color: "url(#statGradient)" // Using gradient defined in defs
    },
    grid: {
      label: "Grid",
      color: "hsl(var(--border) / 40%)" // More visible grid lines
    },
    axis: {
      label: "Axis",
      color: "hsl(var(--muted-foreground))"
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md mx-auto overflow-visible h-full max-h-[350px] flex flex-col relative">
        <CardHeader className="pb-0 pt-1">
          <CardTitle className="text-base">Stat Pentagon</CardTitle>
          <p className="text-xs text-muted-foreground">Hover to see breakdown</p>
        </CardHeader>
        <CardContent className="p-2 pt-0 pb-2 flex-grow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center h-full"
          >
            <div className="w-full h-full relative">
              
              <ChartContainer config={chartConfig} className="!aspect-square relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="35%" 
                    outerRadius="50%" 
                    data={chartData}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    {/* Define gradient for the radar fill */}
                    <defs>
                      <linearGradient id="statGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.7} />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    <PolarGrid stroke="var(--color-grid)" strokeWidth={1} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={(props) => {
                        const { x, y, payload, fill } = props;
                        const category = payload.value;
                        const value = chartData.find(item => item.subject === category)?.value || 0;
                        
                        const index = chartData.findIndex(item => item.subject === category);
                        const angleInDegrees = (index * 72) - 90; 
                        const angleInRadians = (angleInDegrees * Math.PI) / 180;
                        
                        const offsetDistance = 20; // Increase this value to move text further out
                        const offsetX = Math.cos(angleInRadians) * offsetDistance;
                        const offsetY = Math.sin(angleInRadians) * offsetDistance;
                        
                        return (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <g transform={`translate(${x},${y})`} style={{ cursor: 'pointer' }}>
                                <text
                                  x={offsetX}
                                  y={offsetY}
                                  dy={0}
                                  textAnchor="middle"
                                  fill={fill || "var(--color-axis)"}
                                  fontSize={14}
                                >
                                  {category}
                                </text>
                                <text
                                  x={offsetX}
                                  y={offsetY}
                                  dy={20}
                                  textAnchor="middle"
                                  fill={fill || "var(--color-axis)"}
                                  fontSize={16}
                                  fontWeight="bold"
                                >
                                  {value}
                                </text>
                              </g>
                            </TooltipTrigger>
                            <StatPentagonTooltip category={category} stats={stats} />
                          </Tooltip>
                        );
                      }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={false}
                      axisLine={false}
                    />
                    {/* Reference pentagon (max value outline) */}
                    <Radar
                      name="MaxReference"
                      dataKey="fullMark"
                      stroke="hsl(var(--border))"
                      strokeWidth={1}
                      fill="none"
                    />
                    
                    {/* Background radar for glow effect */}
                    <Radar
                      name="StatsGlow"
                      dataKey="value"
                      stroke="none"
                      fill="var(--color-radar)"
                      fillOpacity={0.15}
                      style={{ filter: 'url(#glow)' }}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    
                    {/* Main radar */}
                    <Radar
                      name="Stats"
                      dataKey="value"
                      stroke="var(--color-radar)"
                      strokeWidth={2}
                      fill="var(--color-radar)"
                      fillOpacity={0.6}
                      animationDuration={1000}
                      animationEasing="ease-in-out"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
