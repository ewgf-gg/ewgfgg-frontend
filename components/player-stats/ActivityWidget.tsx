"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DailyActivity } from '../../app/state/types/PlayerPageTypes';
import { Calendar } from 'lucide-react';

interface ActivityWidgetProps {
  recentActivity: DailyActivity[];
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({ recentActivity }) => {
  // Create a map for quick lookup
  const activityMap = new Map<string, DailyActivity>();
  recentActivity.forEach(activity => {
    const date = new Date(activity.date).toISOString().split('T')[0];
    activityMap.set(date, activity);
  });

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 89); // 90 days including today

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  const firstDay = new Date(startDate);
  firstDay.setDate(firstDay.getDate() - firstDay.getDay());

  for (let i = 0; i < 98; i++) { // ~14 weeks * 7 days
    const date = new Date(firstDay);
    date.setDate(date.getDate() + i);
    
    // Only include dates up to today
    if (date <= today) {
      currentWeek.push(date);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Get color based on winrate
  const getColor = (activity: DailyActivity | undefined) => {
    if (!activity || (activity.wins === 0 && activity.losses === 0)) {
      return 'bg-gray-800/30 border-gray-700/50';
    }
    
    const totalGames = activity.wins + activity.losses;
    const winrate = (activity.wins / totalGames) * 100;
    
    if (winrate > 50) {
      // Green shades based on intensity
      if (totalGames >= 10) return 'bg-green-500 border-green-400';
      if (totalGames >= 5) return 'bg-green-500/80 border-green-400/80';
      return 'bg-green-500/60 border-green-400/60';
    } else if (winrate < 50) {
      // Red shades based on intensity
      if (totalGames >= 10) return 'bg-red-500 border-red-400';
      if (totalGames >= 5) return 'bg-red-500/80 border-red-400/80';
      return 'bg-red-500/60 border-red-400/60';
    } else {
      // Exactly 50%
      return 'bg-yellow-500/60 border-yellow-400/60';
    }
  };

  // Get tooltip content
  const getTooltip = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const activity = activityMap.get(dateStr);
    
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    if (!activity || (activity.wins === 0 && activity.losses === 0)) {
      return `${formattedDate}\nNo games played`;
    }
    
    const totalGames = activity.wins + activity.losses;
    const winrate = ((activity.wins / totalGames) * 100).toFixed(1);
    
    return `${formattedDate}\n${activity.wins}W - ${activity.losses}L (${winrate}%)`;
  };

  // Month labels
  const getMonthLabel = (weekIndex: number) => {
    if (weeks[weekIndex] && weeks[weekIndex][0]) {
      const firstDayOfWeek = weeks[weekIndex][0];
      const month = firstDayOfWeek.toLocaleDateString('en-US', { month: 'short' });
      
      // Only show if it's the first week of the month or first week overall
      if (weekIndex === 0 || firstDayOfWeek.getDate() <= 7) {
        return month;
      }
    }
    return null;
  };

  return (
    <Card className="h-full bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last 90 days of match activity
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-800/30 border border-gray-700/50" />
              <div className="w-3 h-3 rounded-sm bg-red-500/60 border border-red-400/60" />
              <div className="w-3 h-3 rounded-sm bg-yellow-500/60 border border-yellow-400/60" />
              <div className="w-3 h-3 rounded-sm bg-green-500/60 border border-green-400/60" />
              <div className="w-3 h-3 rounded-sm bg-green-500 border border-green-400" />
            </div>
            <span>More</span>
          </div>

          {/* Activity Grid */}
          <div className="relative overflow-x-auto">
            <div className="inline-flex gap-1 mx-auto justify-center w-full">
              {/* Month labels */}
              <div className="flex flex-col gap-[3px] text-[10px] text-muted-foreground justify-start pt-5">
                <div>Mon</div>
                <div className="h-[11px]" />
                <div>Wed</div>
                <div className="h-[11px]" />
                <div>Fri</div>
                <div className="h-[11px]" />
              </div>

              {/* Grid */}
              <div className="flex flex-col">
                {/* Month labels row */}
                <div className="flex gap-[3px] mb-1 h-4">
                  {weeks.map((week, weekIndex) => {
                    const label = getMonthLabel(weekIndex);
                    return (
                      <div 
                        key={weekIndex} 
                        className="w-[11px] text-[10px] text-muted-foreground"
                      >
                        {label || ''}
                      </div>
                    );
                  })}
                </div>

                {/* Days grid */}
                <div className="flex gap-[3px]">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {week.map((date, dayIndex) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const activity = activityMap.get(dateStr);
                        const color = getColor(activity);
                        const tooltip = getTooltip(date);
                        
                        return (
                          <div
                            key={dayIndex}
                            className={`w-[11px] h-[11px] rounded-sm border ${color} cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:ring-offset-1 hover:ring-offset-background`}
                            title={tooltip}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Winrate Indicators */}
          <div className="flex items-center justify-center gap-4 text-xs">
            <span className="text-green-500">&#9679; &gt;50% WR</span>
            <span className="text-red-500">&#9679; &lt;50% WR</span>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {recentActivity.reduce((sum, day) => sum + day.wins, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Wins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {recentActivity.reduce((sum, day) => sum + day.losses, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Losses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {recentActivity.filter(day => day.wins > 0 || day.losses > 0).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Active Days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
