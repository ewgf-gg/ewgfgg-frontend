"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, Medal, Crown, Award } from 'lucide-react';

interface Donation {
  id: number;
  name: string;
  amount: number;
  date: string;
  message?: string;
}

export default function DonationLeaderboard() {
  // Mock data - in production, this would come from an API
  const topDonations: Donation[] = [
    { id: 1, name: 'KingMain777', amount: 100, date: '2024-01-15', message: 'Love the site! Keep it up!' },
    { id: 2, name: 'BryanFury', amount: 75, date: '2024-01-12', message: 'Thanks for the amazing stats!' },
    { id: 3, name: 'JinPlayer', amount: 50, date: '2024-01-10' },
    { id: 4, name: 'Anonymous', amount: 45, date: '2024-01-08' },
    { id: 5, name: 'TekkenGod', amount: 40, date: '2024-01-05' },
  ];

  const recentDonations: Donation[] = [
    { id: 1, name: 'Anonymous', amount: 10, date: '2024-01-20', message: 'Great work!' },
    { id: 2, name: 'SteveMain', amount: 25, date: '2024-01-19' },
    { id: 3, name: 'Nina_Williams', amount: 15, date: '2024-01-18' },
    { id: 4, name: 'Anonymous', amount: 20, date: '2024-01-17' },
    { id: 5, name: 'PaulPhoenix', amount: 30, date: '2024-01-16', message: 'Thank you for your hard work!' },
  ];

  const [activeTab, setActiveTab] = useState<'top' | 'recent'>('top');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</div>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-900/40 to-amber-900/40 border-yellow-500/30';
      case 2:
        return 'from-gray-700/40 to-gray-800/40 border-gray-400/30';
      case 3:
        return 'from-orange-900/40 to-red-900/40 border-orange-500/30';
      default:
        return 'from-gray-800/40 to-gray-900/40 border-gray-600/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Donations
            </CardTitle>
            <CardDescription className="text-gray-400">
              Thank you to our generous supporters!
            </CardDescription>
          </div>
          
          {/* Tab Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('top')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'top'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Trophy className="w-4 h-4 inline mr-1" />
              Top
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'recent'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              Recent
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {(activeTab === 'top' ? topDonations : recentDonations).map((donation, index) => (
            <motion.div
              key={donation.id}
              variants={itemVariants}
              className={`bg-gradient-to-r ${getRankBackground(index + 1)} border rounded-lg p-4 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0">
                  {getRankIcon(index + 1)}
                </div>

                {/* Name and Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate">
                      {donation.name}
                    </span>
                    {index === 0 && activeTab === 'top' && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                        Top Supporter
                      </span>
                    )}
                    {index === 0 && activeTab === 'recent' && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full animate-pulse">
                        Latest
                      </span>
                    )}
                  </div>
                  {donation.message && (
                    <p className="text-sm text-gray-400 italic mt-1 truncate">
                      "{donation.message}"
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(donation.date)}
                  </p>
                </div>

                {/* Amount */}
                <div className="flex-shrink-0">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      index === 0 ? 'text-yellow-400' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-orange-400' :
                      'text-green-400'
                    }`}>
                      ${donation.amount}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
