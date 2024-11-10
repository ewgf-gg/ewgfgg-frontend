import { characterIconMap } from '@/atoms/tekkenStatsAtoms';

export const CustomYAxisTick: React.FC<any> = ({ x, y, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <foreignObject x="-140" y="-20" width="140" height="40">
      <div className="flex items-center gap-2 h-full">
        <img
          src={characterIconMap[payload.value]}
          alt={payload.value}
          className="w-8 h-10"
          style={{ overflow: 'visible' }}
        />
        <span className="text-sm whitespace-nowrap">{payload.value}</span>
      </div>
    </foreignObject>
  </g>
);