import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface SimpleChartCardProps {
  title: string;
  description?: string;
  delay?: number;
  children: React.ReactNode;
  action?: React.ReactNode;
  height?: string;
}

export const SimpleChartCard: React.FC<SimpleChartCardProps> = ({
  title,
  description,
  delay = 0,
  children,
  action,
  height = "400px"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="w-full"
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-center sm:flex-row flex-col gap-2">
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <CardDescription>
                  {description}
                </CardDescription>
              )}
            </div>
            {action && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing stats for:</span>
                {action}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full" style={{ height }}>
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
