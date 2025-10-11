"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, DollarSign, Coffee, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DonationWidget() {
  // Mock data - in production, this would come from an API
  const [currentAmount, setCurrentAmount] = useState(0);
  const monthlyGoal = 500; // $500 monthly goal
  const percentage = Math.min((currentAmount / monthlyGoal) * 100, 100);
  
  // Animate the current amount on mount
  useEffect(() => {
    // In production, fetch this from your backend
    const targetAmount = 287; // Example: $287 raised this month
    
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
  }, []);

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-green-400" />
          Support Us
        </CardTitle>
        <CardDescription className="text-gray-400">
          Help us reach our monthly goal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Circular Progress Indicator */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 88 * (1 - percentage / 100)
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {Math.round(percentage)}%
                </div>
                <div className="text-sm text-gray-400 mt-1">Complete</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Amount Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Current:</span>
            <motion.span 
              className="text-2xl font-bold text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ${currentAmount}
            </motion.span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Goal:</span>
            <span className="text-2xl font-bold text-gray-300">
              ${monthlyGoal}
            </span>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Remaining:</span>
              <span className="text-lg font-semibold text-orange-400">
                ${monthlyGoal - currentAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Alternative */}
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-3 bg-gray-700"
          />
        </div>

        {/* Monthly Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Donations</span>
            </div>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-xs text-gray-500">This month</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Average</span>
            </div>
            <div className="text-2xl font-bold text-white">${Math.round(currentAmount / 12)}</div>
            <div className="text-xs text-gray-500">Per donation</div>
          </div>
        </div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-lg p-4"
        >
          <p className="text-sm text-center text-gray-300">
            {percentage >= 100 ? (
              <>🎉 Goal reached! Thank you! 🎉</>
            ) : percentage >= 75 ? (
              <>Almost there! Just ${monthlyGoal - currentAmount} to go! 💪</>
            ) : percentage >= 50 ? (
              <>Halfway there! Thank you for your support! ❤️</>
            ) : percentage >= 25 ? (
              <>Great start! Every contribution helps! 🚀</>
            ) : (
              <>Help us reach our goal this month! 🎯</>
            )}
          </p>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-xl font-bold text-white text-center mb-4">Make a Donation</h3>
          
          {/* Ko-fi Button */}
          <div className="flex flex-col items-center gap-4">
            <motion.a
              href="https://ko-fi.com/ewgfgg"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF5E5B] via-[#FF7F7F] to-[#FF5E5B] text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 overflow-hidden group w-full"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7F7F] via-[#FF5E5B] to-[#FF7F7F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative flex items-center gap-3">
                <Coffee className="w-6 h-6 animate-bounce" />
                <span>Support on Ko-fi</span>
                <Heart className="w-5 h-5 text-red-200" />
              </div>
            </motion.a>

            <div className="text-center space-y-1">
              <p className="text-sm text-gray-400">
                Ko-fi accepts credit cards, PayPal, and more
              </p>
              <p className="text-xs text-gray-500">
                No account required to donate!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
