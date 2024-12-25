import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import React from 'react'

interface AnimatedCardProps {
  children: React.ReactNode;
  delay: number;
}

export function AnimatedCard({ children, delay }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="bg-gray-800 border-gray-700">
        {children}
      </Card>
    </motion.div>
  );
}