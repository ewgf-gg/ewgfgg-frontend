"use client";

import { Header } from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { FaGithub, FaDiscord, FaChartBar, FaServer, FaDatabase, FaExclamationTriangle, FaInfoCircle, FaClock, FaCode, FaHeart, FaLanguage } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";
import React from 'react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Hero Section */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              About ewgf.gg
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              A free and open-source tool for deeper Tekken 8 gameplay insights
            </p>
          </div>

          {/* Two Column Layout - Mission & Data Sources + Refresh Rates & Limitations */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Mission & Data Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gray-800/50 border-blue-500/30 backdrop-blur-sm h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-300 flex items-center gap-2">
                    <FaChartBar className="w-5 h-5" />
                    Mission & Data Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mission */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Our Mission</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      <strong className="text-blue-300">ewgf.gg</strong> provides deeper insights into your Tekken 8 gameplay statistics. 
                      Built and maintained by <strong className="text-blue-300">@the-beef-calculator</strong>, inspired by the monthly{' '}
                      <em className="text-cyan-300">State of Tekken 8</em> Reddit posts by /u/NotQuiteFactual.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-blue-500/20"></div>

                  {/* Data Sources */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <FaDatabase className="w-4 h-4" />
                      Data Sources
                    </h3>
                    <div className="space-y-3">
                      {/* Wavu Wank Source */}
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <IoStatsChart className="w-5 h-5 text-blue-400" />
                          <h4 className="text-sm font-semibold text-blue-300">Historical Battle Data</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Historical ranked data from{' '}
                          <a
                            href="https://wank.wavu.wiki"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline font-semibold transition-colors"
                          >
                            Wavu Wank
                          </a>
                        </p>
                      </div>

                      {/* Tekken Servers Source */}
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <FaServer className="w-5 h-5 text-cyan-400" />
                          <h4 className="text-sm font-semibold text-cyan-300">Official Tekken Data</h4>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">Real-time data from Tekken servers:</p>
                        <ul className="space-y-1 text-xs text-gray-400">
                          <li className="flex items-center gap-2">
                            <MdLeaderboard className="w-3 h-3 text-cyan-400" />
                            Leaderboard rankings
                          </li>
                          <li className="flex items-center gap-2">
                            <IoStatsChart className="w-3 h-3 text-cyan-400" />
                            Stat pentagon
                          </li>
                          <li className="flex items-center gap-2">
                            <FaChartBar className="w-3 h-3 text-cyan-400" />
                            Match history
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Statistical Analysis Scope */}
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <FaInfoCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-blue-300 mb-1">Analysis Scope</h3>
                        <p className="text-gray-300 text-sm">
                          Only <strong className="text-blue-300">ranked battles</strong> are analyzed.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Data Refresh & Limitations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-6"
            >
              {/* Data Refresh Rates Card */}
              <Card className="bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-cyan-300 flex items-center gap-2">
                    <FaClock className="w-5 h-5" />
                    Data Refresh Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <IoStatsChart className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-semibold text-cyan-300 text-sm">Stat Pentagon</h4>
                      </div>
                      <p className="text-gray-400 text-xs">Updates every <strong className="text-cyan-300">24 hours</strong></p>
                    </div>
                    
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <MdLeaderboard className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-semibold text-cyan-300 text-sm">Leaderboards</h4>
                      </div>
                      <p className="text-gray-400 text-xs">Refreshes every <strong className="text-cyan-300">30 minutes</strong></p>
                    </div>
                    
                    <div className="bg-gray-900/50 p-3 rounded-lg border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-1">
                        <FaChartBar className="w-4 h-4 text-cyan-400" />
                        <h4 className="font-semibold text-cyan-300 text-sm">Character Stats</h4>
                      </div>
                      <p className="text-gray-400 text-xs">Refreshes every <strong className="text-cyan-300">30 minutes</strong></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Limitations Card */}
              <Card className="bg-gray-800/50 border-red-500/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-red-300 flex items-center gap-2">
                    <FaExclamationTriangle className="w-5 h-5" />
                    Known Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <FaExclamationTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-300 mb-1 text-sm">Regional Accuracy</h4>
                          <p className="text-gray-300 text-xs">
                            Tekken's regional assignment could be better. If you're in the wrong region, let me know and I'll change it.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <FaExclamationTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-300 mb-1 text-sm">Match Disconnections</h4>
                          <p className="text-gray-300 text-xs">
                            Players can disconnect to avoid losses. Disconnected matches won't appear in match history or stats.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Special Thanks Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-purple-300 flex items-center justify-center gap-2">
                  <FaHeart className="w-5 h-5" />
                  Special Thanks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-center text-sm">
                  This project wouldn't be possible without amazing community support:
                </p>

                {/* Three Column Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Contributors */}
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <FaCode className="w-5 h-5 text-purple-400" />
                      <h3 className="text-base font-semibold text-purple-300">Contributors</h3>
                    </div>
                    <div className="space-y-3 text-xs text-gray-300">
                      <p>
                        🏆 MVPs <a href="https://x.com/6weetbix" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold">@6weetbix</a> and <a href="https://x.com/kklaraz" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold">@klaraz</a> for <a href="https://wank.wavu.wiki" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold">Wavu Wiki</a>
                      </p>
                      <p>💡 Gary, my mentor, for technical guidance and support</p>
                      <p>👥 Friends Joe, Michael, Daniel, and others for feedback</p>
                      <p>🎮 ewgf.gg and Tekken communities for ongoing support</p>
                    </div>
                  </div>

                  {/* Donators */}
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-pink-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <FaHeart className="w-5 h-5 text-pink-400" />
                      <h3 className="text-base font-semibold text-pink-300">Donators</h3>
                    </div>
                    <p className="text-gray-300 text-xs mb-2">
                      Thank you to all Ko-fi supporters who help keep this project running! 💖
                    </p>
                    <p className="text-gray-400 text-xs">
                      Visit the <a href="/donate" className="text-pink-400 hover:text-pink-300 underline font-semibold">Donate page</a> to see top contributors.
                    </p>
                  </div>

                  {/* Translators */}
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <FaLanguage className="w-5 h-5 text-green-400" />
                      <h3 className="text-base font-semibold text-green-300">Translators</h3>
                    </div>
                    <p className="text-gray-300 text-xs">
                      Looking for volunteers to help translate ewgf.gg! 🌍 Reach out via Discord or GitHub if interested.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Card className="bg-gray-800/50 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-blue-300 text-center">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-center text-sm">
                  Have suggestions or found a bug? Join Discord or submit a GitHub issue!
                </p>
                <div className="flex justify-center gap-4">
                  <motion.a
                    href="https://www.github.com/ewgf-gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-500/30 hover:border-blue-500/50 transition-all duration-300">
                      <FaGithub className="w-8 h-8 text-gray-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </motion.a>
                  <motion.a
                    href="https://discord.gg/EUEnH99har"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-500/30 hover:border-blue-500/50 transition-all duration-300">
                      <FaDiscord className="w-8 h-8 text-gray-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </motion.a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
