"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Trophy, Clock, Target } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import TopDonationsWidget from '@/components/support/TopDonationsWidget';
import RecentDonationsWidget from '@/components/support/RecentDonationsWidget';
import HorizontalDonationWidget from '@/components/support/HorizontalDonationWidget';
import { DonorPageResponse } from '@/app/state/types/SupportPageTypes';

interface SupportPageContentProps {
  donorData: DonorPageResponse;
}

export default function SupportPageContent({ donorData }: SupportPageContentProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
            Support ewgf.gg
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Help us keep the lights on and continue providing the best ad-free Tekken 8 statistics platform for the community
          </p>
        </motion.div>

        {/* Donation Leaderboards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Donations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <TopDonationsWidget donations={donorData.topDonations} />
          </motion.div>

          {/* Recent Donations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <RecentDonationsWidget donations={donorData.recentDonations} />
          </motion.div>
        </div>

        {/* Horizontal Donation Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <HorizontalDonationWidget monthlyProgress={donorData.monthlyProgress} />
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-red-900/20 border-pink-500/30 shadow-xl">
            <CardContent className="py-8">
              <p className="text-center text-2xl font-semibold text-white mb-2">
                Thank You for Your Support! ❤️
              </p>
              <p className="text-center text-gray-300">
                Your donations help cover server costs, database hosting, and most importantly, keep ewgf.gg completely ad-free and accessible for everyone. 
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
