// StatsGrid.tsx
import { useAtom } from 'jotai';
import { AnimatedStatCard } from '@/components/AnimatedStatCard';
import {
  totalReplaysAtom,
  totalPlayersAtom,
  mostPopularCharacterAtom
} from '@/atoms/tekkenStatsAtoms';

export const StatsGrid: React.FC = () => {
  const [totalReplays] = useAtom(totalReplaysAtom);
  const [totalPlayers] = useAtom(totalPlayersAtom);
  const [mostPopularCharacter] = useAtom(mostPopularCharacterAtom);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <AnimatedStatCard title="Total Replays" value={totalReplays.toLocaleString()} delay={0.4} />
      <AnimatedStatCard title="Total Unique Players" value={totalPlayers.toLocaleString()} delay={0.6} />
      <AnimatedStatCard title="Most Popular Character" value={mostPopularCharacter} delay={0.8} />
    </div>
  );
};