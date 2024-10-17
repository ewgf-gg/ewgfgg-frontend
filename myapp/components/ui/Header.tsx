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
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-2">
        <div className="flex flex-col items-center space-y-2">
          <ul className="flex space-x-8">
            <li>
              <Link href="/" className="text-white hover:text-blue-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/statistics" className="text-white hover:text-blue-400 transition-colors">
                All Statistics
              </Link>
            </li>
            <li>
              <Link href="/#" className="text-white hover:text-blue-400 transition-colors">
                About
              </Link>
            </li>
          </ul>
          <form onSubmit={handleSearch} className="flex items-center w-full max-w-sm">
            <Input
              type="text"
              placeholder="Search player..."
              className="flex-grow mr-2 h-7 text-xs bg-gray-700 text-white border-gray-600 focus:border-blue-500 px-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </nav>
    </header>
  );
}