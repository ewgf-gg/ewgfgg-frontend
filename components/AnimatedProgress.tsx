import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
  delay: number;
}

export function AnimatedProgress({ value, className, indicatorClassName, delay }: AnimatedProgressProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ width: `${value}%`, transition: { duration: 1, delay } });
  }, [controls, value, delay]);

  return (
    <div className={`relative h-4 w-full overflow-hidden rounded-full ${className}`}>
      <motion.div
        {...{className: `h-full ${indicatorClassName}`}}
        initial={{ width: 0 }}
        animate={controls}
      />
    </div>
  );
}