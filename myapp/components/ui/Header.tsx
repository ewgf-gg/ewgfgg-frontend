"use client"
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* First, add the Google Font in your layout.tsx or appropriate head section */}
      <link href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap" rel="stylesheet" />
      
      <header className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm shadow-lg z-50">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and left-side navigation */}
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="font-['Russo_One'] text-2xl text-white"
              >
                ewgf<span className="text-blue-400">.gg</span>
              </Link>
              <div className="flex space-x-6">
                <Link 
                  href="/statistics" 
                  className="text-gray-300 hover:text-white transition-colors text-sm font-semibold"
                >
                  All Statistics
                </Link>
                <Link 
                  href="/#" 
                  className="text-gray-300 hover:text-white transition-colors text-sm font-semibold"
                >
                  About
                </Link>
              </div>
            </div>

            {/* Centered search bar */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Search player... (Polaris-ID, name)"
                    className="w-full h-10 pl-10 pr-4 text-sm bg-gray-700/50 text-white border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all hover:bg-gray-700/70"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </form>
            </div>
          </div>
        </nav>
      </header>
      <div className="h-16"></div> {/* Adjusted spacer height */}
    </>
  );
}