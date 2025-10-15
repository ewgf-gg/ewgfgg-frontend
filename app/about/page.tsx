"use client";

import { Header } from "@/components/ui/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { FaGithub, FaDiscord, FaChartBar, FaServer, FaDatabase, FaExclamationTriangle, FaInfoCircle, FaClock, FaCode, FaHeart, FaLanguage } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { MdLeaderboard } from "react-icons/md";
import React from 'react'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto space-y-12"
        >
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              About ewgf.gg
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A free and open-source tool for deeper Tekken 8 gameplay insights
            </p>
          </div>

          {/* Combined About & Data Sources Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-800/50 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-300 flex items-center gap-3">
                  <FaChartBar className="w-6 h-6" />
                  About ewgf.gg
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Mission */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-300 mb-3">Our Mission</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    <strong className="text-blue-300">ewgf.gg</strong> is designed to provide deeper insights into your Tekken 8 gameplay statistics. 
                    Built and maintained by <strong className="text-blue-300">@the-beef-calculator</strong>, it was inspired by the monthly{' '}
                    <em className="text-cyan-300">State of Tekken 8</em> Reddit posts authored by /u/NotQuiteFactual.
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-500/20"></div>

                {/* Data Sources */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2">
                    <FaDatabase className="w-5 h-5" />
                    Data Sources
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Wavu Wank Source */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <IoStatsChart className="w-6 h-6 text-blue-400" />
                        <h4 className="text-lg font-semibold text-blue-300">Historical Battle Data</h4>
                      </div>
                      <p className="text-gray-300">
                        We pull historical ranked battle data from{' '}
                        <a
                          href="https://wank.wavu.wiki"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline font-semibold transition-colors"
                        >
                          Wavu Wank
                        </a>
                        {' '}for comprehensive statistical analysis.
                      </p>
                    </div>

                    {/* Tekken Servers Source */}
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <FaServer className="w-6 h-6 text-cyan-400" />
                        <h4 className="text-lg font-semibold text-cyan-300">Official Tekken Data</h4>
                      </div>
                      <p className="text-gray-300">
                        Real-time data pulled directly from Tekken&apos;s official servers, including:
                      </p>
                      <ul className="mt-3 space-y-1 text-sm text-gray-400">
                        <li className="flex items-center gap-2">
                          <MdLeaderboard className="w-4 h-4 text-cyan-400" />
                          Leaderboard rankings
                        </li>
                        <li className="flex items-center gap-2">
                          <IoStatsChart className="w-4 h-4 text-cyan-400" />
                          Stat pentagon information
                        </li>
                        <li className="flex items-center gap-2">
                          <FaChartBar className="w-4 h-4 text-cyan-400" />
                          Match history (Quick, Player, Group)
                        </li>
                        <li className="flex items-center gap-2">
                          <FaServer className="w-4 h-4 text-cyan-400" />
                          Player profile data
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-500/20"></div>

                {/* Statistical Analysis Scope */}
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <FaInfoCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-300 mb-2">Statistical Analysis Scope</h3>
                      <p className="text-gray-300">
                        Currently, only <strong className="text-blue-300">ranked battles</strong> are used for statistical analysis.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Refresh Rates Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Card className="bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-cyan-300 flex items-center gap-3">
                  <FaClock className="w-6 h-6" />
                  Data Refresh Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <IoStatsChart className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-semibold text-cyan-300">Stat Pentagon</h4>
                    </div>
                    <p className="text-gray-400 text-sm">Updates every <strong className="text-cyan-300">24 hours</strong></p>
                  </div>
                  
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <MdLeaderboard className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-semibold text-cyan-300">Leaderboards</h4>
                    </div>
                    <p className="text-gray-400 text-sm">Refreshes every <strong className="text-cyan-300">30 minutes</strong></p>
                  </div>
                  
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <FaChartBar className="w-5 h-5 text-cyan-400" />
                      <h4 className="font-semibold text-cyan-300">Character Stats</h4>
                    </div>
                    <p className="text-gray-400 text-sm">Refreshes every <strong className="text-cyan-300">30 minutes</strong></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Limitations Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gray-800/50 border-red-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-red-300 flex items-center gap-3">
                  <FaExclamationTriangle className="w-6 h-6" />
                  Known Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-300 mb-1">Regional Accuracy</h4>
                        <p className="text-gray-300">
                          Player region data may be inaccurate and should be taken with a grain of salt.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-300 mb-1">Match Disconnections</h4>
                        <p className="text-gray-300">
                          Players can disconnect (plug) to avoid losses. These disconnected matches are not recorded in our statistics, which may affect the accuracy of win/loss data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Special Thanks Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Card className="bg-gray-800/50 border-purple-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-300 text-center">
                  Special Thanks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <p className="text-gray-300 text-center text-lg">
                  This project would not have been possible without the support of many amazing people:
                </p>

                {/* Contributors Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <FaCode className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-semibold text-purple-300">Contributors</h3>
                  </div>
                  <div className="grid gap-4">
                    {[
                      {
                        content: <>The MVPs <a href="https://x.com/6weetbix" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">@6weetbix</a> and <a href="https://x.com/kklaraz" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">@klaraz</a> for building the <a href="https://wank.wavu.wiki" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Wavu Wiki</a> and making the API publicly available.</>,
                        icon: "🏆"
                      },
                      {
                        content: 'Gary, my mentor from a previous internship, who helped fuel my enthusiasm for this project and offering technical advice.',
                        icon: "💡"
                      },
                      {
                        content: 'My friends Joe, Michael and Daniel, as well as my other friends, for offering their thoughts and listening to me yap about this project nonstop.',
                        icon: "👥"
                      },
                      {
                        content: 'Members of the ewgf.gg and Tekken Discord/Reddit communities for their feedback and support.',
                        icon: "🎮"
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="bg-gray-900/50 p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">{item.icon}</span>
                          <p className="text-gray-300 leading-relaxed">{item.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-purple-500/20"></div>

                {/* Donators Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <FaHeart className="w-6 h-6 text-pink-400" />
                    <h3 className="text-xl font-semibold text-pink-300">Donators</h3>
                  </div>
                  <div className="bg-gray-900/50 p-6 rounded-lg border border-pink-500/20">
                    <p className="text-gray-300 text-center">
                      Thank you to all our generous supporters on Ko-fi who help keep this project running! 
                      Your contributions make it possible to maintain and improve ewgf.gg. 💖
                    </p>
                    <p className="text-gray-400 text-center text-sm mt-3">
                      Visit the <a href="/support" className="text-pink-400 hover:text-pink-300 underline font-semibold transition-colors">Support page</a> to see our top contributors and monthly goal progress.
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-purple-500/20"></div>

                {/* Translators Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <FaLanguage className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-semibold text-green-300">Translators</h3>
                  </div>
                  <div className="bg-gray-900/50 p-6 rounded-lg border border-green-500/20">
                    <p className="text-gray-300 text-center">
                      We&apos;re looking for volunteers to help translate ewgf.gg into multiple languages! 
                      If you&apos;re interested in making the site accessible to more players worldwide, please reach out via Discord or GitHub. 🌍
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
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-gray-800/50 border-blue-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-300 text-center">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-300 text-center text-lg">
                  Have suggestions or found a bug? Join the Discord, or submit an issue on Github! Your feedback will help make <strong className="text-blue-300">ewgf.gg</strong> better for everyone 🙂
                </p>
                <div className="flex justify-center gap-6">
                  <motion.a
                    href="https://www.github.com/ewgf-gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-500/30 hover:border-blue-500/50 transition-all duration-300">
                      <FaGithub className="w-10 h-10 text-gray-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </motion.a>
                  <motion.a
                    href="https://discord.gg/EUEnH99har"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-500/30 hover:border-blue-500/50 transition-all duration-300">
                      <FaDiscord className="w-10 h-10 text-gray-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </motion.a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
