import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RankSelector } from './RankSelector';
import { ChartProps, RANK_OPTIONS } from '@/app/state/types/tekkenTypes';

interface ChartCardProps extends ChartProps {
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  delay = 0,
  rank,
  onRankChange,
  children
}) => {
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
            <RankSelector value={rank} onValueChange={onRankChange} />
          </div>
          {description && (
            <CardDescription>
              {`${description} ${RANK_OPTIONS.find(opt => opt.value === rank)?.description}`}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="w-full h-[200px]">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};