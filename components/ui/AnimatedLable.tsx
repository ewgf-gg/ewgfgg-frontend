// AnimatedLabel.tsx
import { motion } from 'framer-motion';

interface AnimatedLabelProps {
  x: number;
  y: number;
  value: number;
}

export const AnimatedLabel = ({ x, y, value }: AnimatedLabelProps) => {
  return (
    <motion.text
      x={x}
      y={y}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} // Adjust duration as needed
      textAnchor="middle"
      fill="#000" // Customize the text color
      fontSize="14" // Customize the font size
    >
      {`${value}%`}
    </motion.text>
  );
};
