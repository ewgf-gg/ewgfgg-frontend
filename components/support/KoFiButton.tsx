"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart } from 'lucide-react';

export default function KoFiButton() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Ko-fi Link */}
      <motion.a
        href="https://ko-fi.com/ewgfgg"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF5E5B] via-[#FF7F7F] to-[#FF5E5B] text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 overflow-hidden group"
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

      {/* Ko-fi Widget Embed (Alternative) */}
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <p className="text-sm text-gray-400 text-center mb-4">
            Or use the Ko-fi widget below:
          </p>
          
          {/* Ko-fi Widget Iframe */}
          <div className="flex justify-center">
            <iframe
              id="kofiframe"
              src="https://ko-fi.com/ewgfgg/?hidefeed=true&widget=true&embed=true&preview=true"
              style={{
                border: 'none',
                width: '100%',
                padding: '4px',
                background: '#1a1a1a',
                borderRadius: '8px'
              }}
              height="712"
              title="ewgfgg"
            />
          </div>
        </div>
      </div>

      {/* Info text */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-400">
          Ko-fi accepts credit cards, PayPal, and more
        </p>
        <p className="text-xs text-gray-500">
          No account required to donate!
        </p>
      </div>
    </div>
  );
}
