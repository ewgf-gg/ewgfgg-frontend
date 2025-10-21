"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { DonationDTO } from '@/app/state/types/SupportPageTypes';

interface RecentDonationsWidgetProps {
  donations: DonationDTO[];
}

export default function RecentDonationsWidget({ donations }: RecentDonationsWidgetProps) {

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
          <Clock className="w-6 h-6 text-blue-400" />
          Recent Donations
        </CardTitle>
        <CardDescription className="text-gray-400">
          Latest contributions from our supporters
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
              className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 border border-gray-600/20 rounded-lg p-4 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-4">
                {/* Time indicator */}
                <div className="flex-shrink-0">
                  <Clock className={`w-5 h-5 ${index === 0 ? 'text-green-400' : 'text-gray-400'}`} />
                </div>

                {/* Name and Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white truncate">
                      {donation.fromName}
                    </span>
                    {index === 0 && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full animate-pulse">
                        Latest
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
                    <div className="text-2xl font-bold text-green-400">
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
