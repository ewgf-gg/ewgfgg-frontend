"use client"

import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';
import { AnimatedStatCard } from '@/components/AnimatedStatCard';
import { AnimatedCard } from '@/components/AnimatedCard';
import { AnimatedProgress } from '@/components/AnimatedProgress';
import {
  totalReplaysAtom,
  totalPlayersAtom,
  mostPopularCharacterAtom,
  rankDistributionAtom
} from '@/atoms/tekkenStatsAtoms';

export default function HomePage() {
  const [totalReplays] = useAtom(totalReplaysAtom);
  const [totalPlayers] = useAtom(totalPlayersAtom);
  const [mostPopularCharacter] = useAtom(mostPopularCharacterAtom);
  const [rankDistribution] = useAtom(rankDistributionAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1 
          className="text-5xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tekken Stats Aggregator
        </motion.h1>
        
        <motion.div 
          className="max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSearch} className="flex items-center">
            <Input 
              type="text" 
              placeholder="Search player name..." 
              className="flex-grow mr-2 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <AnimatedStatCard title="Total Replays" value={totalReplays.toLocaleString()} delay={0.4} />
          <AnimatedStatCard title="Total Players" value={totalPlayers.toLocaleString()} delay={0.6} />
          <AnimatedStatCard title="Most Popular Character" value={mostPopularCharacter} delay={0.8} />
        </div>

        <AnimatedCard delay={1}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Rank Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rankDistribution.map((rank, index) => (
                <div key={rank.rank} className="flex items-center">
                  <span className="w-32 text-sm">{rank.rank}</span>
                  <AnimatedProgress 
                    value={rank.percentage} 
                    className="flex-grow mr-4 bg-gray-700" 
                    indicatorClassName="bg-blue-500"
                    delay={1.2 + index * 0.1}
                  />
                  <span className="text-sm font-medium w-12 text-right">{rank.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>
      </main>
      <Footer />
    </div>
  );
}