"use client";

import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaDiscord } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useAtom } from 'jotai'
import { totalPlayersAtom, totalReplaysAtom } from '@/app/state/atoms/tekkenStatsAtoms'

export default function Footer() {
  const [totalPlayers] = useAtom(totalPlayersAtom);
  const [totalReplays] = useAtom(totalReplaysAtom);
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg mt-8 border-t border-gray-700">
      <div className="container mx-auto px-6 py-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Image 
              src="/static/EWGF_ICON@2x.png" 
              alt="EWGF.GG Logo" 
              width={40} 
              height={40} 
              className="mr-3"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              EWGF.GG
            </span>
          </div>
          
          <div className="flex space-x-6">
            <Link href="https://www.github.com/ewgf-gg" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-110" aria-label="Github">
              <FaGithub className="w-6 h-6" />
            </Link>
            <Link href="https://discord.gg/EUEnH99har" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-110" aria-label="Discord">
              <FaDiscord className="w-6 h-6" />
            </Link>
            <Link href="https://x.com/ewgf_gg" className="text-gray-300 hover:text-white transition-colors duration-300 transform hover:scale-110" aria-label="X (Twitter)">
              <FaXTwitter className="w-6 h-6" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 md:col-span-2 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-blue-400">Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/statistics" className="text-gray-300 hover:text-white transition-colors">Statistics</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-blue-400">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="http://www.wavu.wiki" className="text-gray-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Wavu Wiki</a></li>
                <li><a href="https://www.bandainamcoent.com/games/tekken-8" className="text-gray-300 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Official Site</a></li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-blue-400">About</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              ewgf.gg is an open-source fan-made website and is not affiliated with, endorsed, or sponsored by Bandai Namco Entertainment Inc. or any of its subsidiaries.
              All trademarks are property of their respective owners.
            </p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
          <div className="flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-2 sm:space-y-0 mb-2">
            <div>
              <span className="font-semibold text-blue-400">Total Players:</span> {totalPlayers.toLocaleString()}
            </div>
            <div>
              <span className="font-semibold text-blue-400">Total Replays:</span> {totalReplays.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
