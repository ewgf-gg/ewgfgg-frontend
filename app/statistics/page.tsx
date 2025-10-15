import React from 'react';
import StatisticsPageContent from '@/app/statistics/StatisticsPageContent';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export const metadata = {
  title: 'Character Statistics | EWGF.gg',
  description: 'Comprehensive character statistics including pick rates, win rates, and trends across all ranks'
};

// Mock data for demonstration - endpoint will be changing
const generateMockData = () => {
  const characters = [
    'Paul', 'Law', 'King', 'Yoshimitsu', 'Hwoarang', 'Xiaoyu', 'Jin', 'Bryan',
    'Kazuya', 'Steve', 'Jack-8', 'Asuka', 'Devil Jin', 'Feng', 'Lili', 'Dragunov',
    'Leo', 'Lars', 'Alisa', 'Claudio', 'Shaheen', 'Nina', 'Lee', 'Reina',
    'Azucena', 'Victor', 'Raven', 'Eddy', 'Lidia', 'Heihachi', 'Clive'
  ];

  const versions = ['50200', '50100', '50000'];
  const regions = ['global', '0', '1', '2', '3', '4'];
  const ranks = ['allRanks', 'masterRanks', 'advancedRanks', 'intermediateRanks', 'beginnerRanks'];

  const mockVersionStats: any = {};

  versions.forEach(version => {
    mockVersionStats[version] = {};
    
    ranks.forEach(rank => {
      const globalStats: any = {};
      const regionalStats: any = {};

      // Generate global stats
      characters.forEach(char => {
        const baseValue = Math.random() * 100000 + 50000;
        globalStats[char] = Math.round(baseValue);
      });

      // Generate regional stats
      regions.filter(r => r !== 'global').forEach(region => {
        regionalStats[region] = {};
        characters.forEach(char => {
          const baseValue = Math.random() * 50000 + 20000;
          regionalStats[region][char] = Math.round(baseValue);
        });
      });

      mockVersionStats[version][rank] = {
        globalStats,
        regionalStats
      };
    });
  });

  return mockVersionStats;
};

const generateMockWinrateData = () => {
  const characters = [
    'Paul', 'Law', 'King', 'Yoshimitsu', 'Hwoarang', 'Xiaoyu', 'Jin', 'Bryan',
    'Kazuya', 'Steve', 'Jack-8', 'Asuka', 'Devil Jin', 'Feng', 'Lili', 'Dragunov',
    'Leo', 'Lars', 'Alisa', 'Claudio', 'Shaheen', 'Nina', 'Lee', 'Reina',
    'Azucena', 'Victor', 'Raven', 'Eddy', 'Lidia', 'Heihachi', 'Clive'
  ];

  const versions = ['50200', '50100', '50000'];
  const regions = ['global', '0', '1', '2', '3', '4'];
  const ranks = ['allRanks', 'masterRanks', 'advancedRanks', 'intermediateRanks', 'beginnerRanks'];

  const mockVersionStats: any = {};

  versions.forEach(version => {
    mockVersionStats[version] = {};
    
    ranks.forEach(rank => {
      const globalStats: any = {};
      const regionalStats: any = {};

      // Generate global stats (winrates between 45-55%)
      characters.forEach(char => {
        const baseValue = 45 + Math.random() * 10;
        globalStats[char] = parseFloat(baseValue.toFixed(2));
      });

      // Generate regional stats
      regions.filter(r => r !== 'global').forEach(region => {
        regionalStats[region] = {};
        characters.forEach(char => {
          const baseValue = 45 + Math.random() * 10;
          regionalStats[region][char] = parseFloat(baseValue.toFixed(2));
        });
      });

      mockVersionStats[version][rank] = {
        globalStats,
        regionalStats
      };
    });
  });

  return mockVersionStats;
};

export default function StatisticsPage() {
  const popularityData = generateMockData();
  const winrateData = generateMockWinrateData();

  return (
    <StatisticsPageContent 
      popularityData={popularityData}
      winrateData={winrateData}
      error={null}
    />
  );
}
