"use client"

import React from 'react';
import { TooltipContent } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { StatPentagonData } from '@/app/state/types/tekkenTypes';

interface StatPentagonTooltipProps {
  category: string;
  stats: StatPentagonData;
  className?: string;
}

export const StatPentagonTooltip: React.FC<StatPentagonTooltipProps> = ({ 
  category, 
  stats,
  className 
}) => {
  // Get the appropriate component data based on the category
  const getComponentsForCategory = () => {
    switch(category) {
      case 'Attack':
        return Object.entries(stats.attackComponents).map(([key, value]) => ({
          name: formatComponentName(key),
          value,
          key
        }));
      case 'Defense':
        return Object.entries(stats.defenseComponents).map(([key, value]) => ({
          name: formatComponentName(key),
          value,
          key
        }));
      case 'Technique':
        return Object.entries(stats.techniqueComponents).map(([key, value]) => ({
          name: formatComponentName(key),
          value,
          key
        }));
      case 'Spirit':
        return Object.entries(stats.spiritComponents).map(([key, value]) => ({
          name: formatComponentName(key),
          value,
          key
        }));
      case 'Appeal':
        return Object.entries(stats.appealComponents).map(([key, value]) => ({
          name: formatComponentName(key),
          value,
          key
        }));
      default:
        return [];
    }
  };

  // Format component names for display (e.g., "heavyDamage" -> "Heavy Damage")
  const formatComponentName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  const subcategories = getComponentsForCategory();
  // The data is on a 0-100 scale, but we want to scale the bars to 0-25
  const maxValue = 25; // Maximum value for scaling the bars

  return (
    <TooltipContent 
      className={cn(
        "bg-background/95 backdrop-blur-sm border border-border/40 text-foreground p-4 w-72 shadow-xl rounded-xl",
        className
      )}
      sideOffset={5}
    >
      <div className="space-y-4">
        <h4 className="font-semibold text-sm flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-2"></span>
          {category} Breakdown
        </h4>
        <div className="space-y-3">
          {subcategories.map((subcategory) => (
            <div key={subcategory.key} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{subcategory.name}</span>
                <span className="font-medium">{subcategory.value}/25</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                  style={{ 
                    width: `${(subcategory.value / maxValue) * 100}%`,
                    boxShadow: subcategory.value > 12 ? '0 0 8px rgba(99, 102, 241, 0.6)' : 'none'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipContent>
  );
};
