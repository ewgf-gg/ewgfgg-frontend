"use client"

import React from 'react';
import { StatPentagonData } from '@/app/state/types/tekkenTypes';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatPentagonTilesProps {
  stats: StatPentagonData;
  className?: string;
}

export const StatPentagonTiles: React.FC<StatPentagonTilesProps> = ({ stats, className }) => {
  const maxValue = 25;

  const formatComponentName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Custom order for each category's components
  const attackOrder = ['attackFrequency', 'heavyDamage', 'aggressiveness', 'dominance'];
  const defenseOrder = ['block', 'evasion', 'throwEscape', 'composure'];
  const techniqueOrder = ['accuracy', 'judgement', 'retaliation', 'stageUse'];
  const spiritOrder = ['closeBattles', 'comeback', 'fightingSpirit', 'concentration'];
  const appealOrder = ['respect', 'ambition', 'fairness', 'versatility'];

  // Function to reorder components based on specified order
  const reorderComponents = (components: Record<string, number>, order: string[]) => {
    const orderedComponents: Record<string, number> = {};
    order.forEach(key => {
      if (key in components) {
        orderedComponents[key] = components[key];
      }
    });
    return orderedComponents;
  };

  const allCategories = [
    { 
      label: 'Attack', 
      components: reorderComponents(stats.attackComponents, attackOrder) 
    },
    { 
      label: 'Defense', 
      components: reorderComponents(stats.defenseComponents, defenseOrder) 
    },
    { 
      label: 'Technique', 
      components: reorderComponents(stats.techniqueComponents, techniqueOrder) 
    },
    { 
      label: 'Spirit', 
      components: reorderComponents(stats.spiritComponents, spiritOrder) 
    },
    { 
      label: 'Appeal', 
      components: reorderComponents(stats.appealComponents, appealOrder) 
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const tileVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={cn("flex flex-wrap gap-2 justify-start", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {allCategories.map(({ label, components }) => (
        <motion.div
          key={label}
          variants={tileVariants}
          className="bg-background border border-border/40 rounded-lg p-3 w-[378px] shadow-md space-y-4"
        >
          <h4 className="font-semibold text-sm flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-2"></span>
            {label} Breakdown
          </h4>
          <div className="space-y-3">
            {Object.entries(components).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{formatComponentName(key)}</span>
                  <span className="font-medium">{value}/25</span>
                </div>
                <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{
                      width: `${(value / maxValue) * 100}%`,
                      boxShadow: value > 12 ? '0 0 8px rgba(99, 102, 241, 0.6)' : 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
