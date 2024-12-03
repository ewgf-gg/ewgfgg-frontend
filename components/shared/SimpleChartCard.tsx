import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SimpleChartCardProps {
  title: string;
  description?: string;
  delay?: number;
  children: React.ReactNode;
}

export const SimpleChartCard: React.FC<SimpleChartCardProps> = ({
  title,
  description,
  delay = 0,
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
          </div>
          {description && (
            <CardDescription>
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
