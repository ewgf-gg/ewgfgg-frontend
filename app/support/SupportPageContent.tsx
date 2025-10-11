"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Trophy, Clock, Target } from 'lucide-react';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import DonationLeaderboard from '@/components/support/DonationLeaderboard';
import HorizontalDonationWidget from '@/components/support/HorizontalDonationWidget';

export default function SupportPageContent() {
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
            Help us keep the lights on and continue providing the best Tekken 8 statistics platform for the community
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Donation Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <DonationLeaderboard />
          </motion.div>

          {/* Right Column - Why Support */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Why Your Support Matters */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-400" />
                  Why Your Support Matters
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Every contribution helps us grow and improve
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  Running ewgf.gg isn't free. Your donations help us cover essential costs and keep the platform running smoothly for everyone in the Tekken community.
                </p>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-white text-lg">What Your Donations Cover:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong className="text-white">Server Hosting:</strong> Keeping the site fast and reliable 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong className="text-white">Database Costs:</strong> Storing millions of match replays and player statistics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong className="text-white">API Infrastructure:</strong> Processing real-time data from Tekken 8</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong className="text-white">Development:</strong> Adding new features and improvements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span><strong className="text-white">Maintenance:</strong> Bug fixes and optimization</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-4 mt-6">
                  <p className="text-sm text-gray-300 italic">
                    "We're a community-driven project, and we want to keep ewgf.gg free and accessible to all Tekken players. Your support makes that possible!" 
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Horizontal Donation Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <HorizontalDonationWidget />
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
                Every donation, no matter the size, helps us continue serving the Tekken community
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
