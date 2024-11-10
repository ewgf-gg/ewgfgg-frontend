import { characterIconMap } from '@/atoms/tekkenStatsAtoms';

export const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-2">
          <img
            src={characterIconMap[label]}
            alt={label}
            className="w-6 h-6"
          />
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-sm">
          {payload[0].name}: {payload[0].value > 0 ? '+' : ''}{payload[0].value.toFixed(2)}%
        </div>
      </div>
    );
  }
  return null;
};