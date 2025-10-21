"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Coffee, Heart, TrendingUp, DollarSign } from 'lucide-react';
import { MonthlyProgressDto } from '@/app/state/types/SupportPageTypes';

interface HorizontalDonationWidgetProps {
  monthlyProgress: MonthlyProgressDto;
}

export default function HorizontalDonationWidget({ monthlyProgress }: HorizontalDonationWidgetProps) {
  const [currentAmount, setCurrentAmount] = useState(0);
  const { goalAmount, percentage } = monthlyProgress;
  
  // Animate the current amount on mount
  useEffect(() => {
    const targetAmount = monthlyProgress.currentAmount;
    
    let start = 0;
    const duration = 2000;
    const increment = targetAmount / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetAmount) {
        setCurrentAmount(targetAmount);
        clearInterval(timer);
      } else {
        setCurrentAmount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [monthlyProgress.currentAmount]);

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-green-400" />
              Support ewgf.gg
            </CardTitle>
            <CardDescription className="text-gray-400">
              Help us reach our ${goalAmount} monthly goal
            </CardDescription>
          </div>
          
          {/* Ko-fi Button (Desktop) */}
          <div className="hidden md:flex flex-col items-end gap-1">
            <motion.a
              href="https://ko-fi.com/ewgfgg"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#FF5E5B] via-[#FF7F7F] to-[#FF5E5B] text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/50 transition-all duration-300"
            >
              <Coffee className="w-5 h-5" />
              <span>Donate on Ko-fi</span>
              <Heart className="w-4 h-4 text-red-200" />
            </motion.a>
            <p className="text-xs text-gray-400">No account required</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-4">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Current</span>
              </div>
              <motion.div 
                className="text-3xl font-bold text-green-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                ${currentAmount}
              </motion.div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Goal</span>
              </div>
              <div className="text-3xl font-bold text-gray-300">
                ${goalAmount}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-lg p-4 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-400">Remaining</span>
              </div>
              <div className="text-3xl font-bold text-orange-400">
                ${goalAmount - currentAmount}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Progress</span>
              </div>
              <motion.div 
                className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {Math.round(percentage)}%
              </motion.div>
            </div>
          </div>

          {/* Bar Graph */}
          <div className="space-y-3">
            <div className="relative h-16 bg-gray-700/50 rounded-xl overflow-hidden border border-gray-600">
              {/* Background grid lines */}
              <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 border-r border-gray-600/30"
                  />
                ))}
              </div>
              
              {/* Animated progress bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl shadow-lg"
                style={{
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                }}
              />
              
              {/* Amount label on bar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-2xl font-bold text-white drop-shadow-lg z-10"
                >
                  ${currentAmount} / ${goalAmount}
                </motion.span>
              </div>
            </div>

            {/* Milestone markers */}
            <div className="flex justify-between text-xs text-gray-400 px-1">
              <span>$0</span>
              <span>$125</span>
              <span>$250</span>
              <span>$375</span>
              <span>$500</span>
            </div>
          </div>
        </div>

        {/* Ko-fi Button (Mobile) */}
        <div className="md:hidden space-y-2">
          <motion.a
            href="https://ko-fi.com/ewgfgg"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#FF5E5B] via-[#FF7F7F] to-[#FF5E5B] text-white font-bold rounded-xl shadow-lg"
          >
            <Coffee className="w-5 h-5" />
            <span>Donate on Ko-fi</span>
            <Heart className="w-4 h-4 text-red-200" />
          </motion.a>
          <p className="text-xs text-gray-400 text-center">No account required</p>
        </div>

        {/* Why Your Support Matters Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-red-400" />
            <h3 className="text-2xl font-bold text-white">A Message from the Developer</h3>
          </div>
          
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Firstly, I wanted to give a huge thanks to the community and all the kind words everyone has shared. ewgf.gg is my first big personal project and I'm so grateful that you guys have found it useful :)
            </p>
            
            <p>
              Maintaining the website is largely a one man show (although help/suggestions are always welcomed), and between maintaining the website, focusing on my studies at university and finding employment, it's a lot to juggle. I appreciate all the support!
            </p>
            
            <p>
              Up until now, I've been personally covering all the costs of running ewgf.gg, but as the site and traffic continue to grow, so too do the server costs. Your support would help ensure I can keep the site running smoothly without it becoming a financial burden while I'm studying and job hunting.
            </p>
          </div>

          {/* Supporter Benefits */}
          <div className="mt-6 bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-yellow-400" />
              <h4 className="text-lg font-bold text-yellow-400">Supporter Benefits</h4>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">✨</span>
                <span>Get a <strong className="text-yellow-400">special supporter emblem</strong> displayed on your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">✨</span>
                <span>Your name will be featured on the <strong className="text-yellow-400">About page</strong> as a valued supporter</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">✨</span>
                <span>Special 'Donor' role within the Discord</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
