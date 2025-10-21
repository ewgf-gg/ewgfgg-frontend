"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { DonationDTO } from '@/app/state/types/SupportPageTypes';

interface TopDonationsWidgetProps {
  donations: DonationDTO[];
}

export default function TopDonationsWidget({ donations }: TopDonationsWidgetProps) {

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

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
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
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl h-full">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Top Donations
        </CardTitle>
        <CardDescription className="text-gray-400">
          Our most generous supporters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {donations.map((donation, index) => (
            <motion.div
              key={index}
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
                      {donation.fromName}
                    </span>
                    {index === 0 && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                        Top Supporter
                      </span>
                    )}
                  </div>
                  {donation.message && donation.isPublic && (
                    <p className="text-sm text-gray-400 italic mt-1 truncate">
                      "{donation.message}"
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(donation.timestamp)}
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
                      ${donation.amount.toFixed(0)}
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
