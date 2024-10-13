'use client'

import { Search, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { atom, useAtom } from 'jotai'
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
import { useState } from 'react'

// Atoms for general statistics
const totalReplaysAtom = atom(1234567)
const totalPlayersAtom = atom(98765)
const mostPopularCharacterAtom = atom('Lee Chaolan')

// Atom for rank distribution
const rankDistributionAtom = atom([
  { rank: 'God of Destruction', percentage: 1 },
  { rank: 'Tekken God', percentage: 2 },
  { rank: 'Tekken Supreme', percentage: 3 },
  { rank: 'Bushin', percentage: 5 },
  { rank: 'Fujin', percentage: 10 },
  { rank: 'Raijin', percentage: 15 },
  { rank: '1st Dan', percentage: 20 },
  { rank: 'Garyu', percentage: 25 },
  { rank: 'Destroyer', percentage: 19 },
])

export default function HomePage() {
  const [totalReplays] = useAtom(totalReplaysAtom)
  const [totalPlayers] = useAtom(totalPlayersAtom)
  const [mostPopularCharacter] = useAtom(mostPopularCharacterAtom)
  const [rankDistribution] = useAtom(rankDistributionAtom)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate error for demonstration (remove in production)
      if (searchQuery.toLowerCase() === 'error') {
        throw new Error('Player not found')
      }

      // Handle successful search here
      console.log('Search completed for:', searchQuery)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center mb-12">Tekken Stats Aggregator</h1>
        
        <div className="max-w-xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="flex items-center">
            <Input 
              type="text" 
              placeholder="Search player name..." 
              className="flex-grow mr-2 bg-gray-700 text-white border-gray-600 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </form>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard title="Total Replays" value={totalReplays.toLocaleString()} />
          <StatCard title="Total Players" value={totalPlayers.toLocaleString()} />
          <StatCard title="Most Popular Character" value={mostPopularCharacter} />
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Rank Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rankDistribution.map((rank) => (
                <div key={rank.rank} className="flex items-center">
                  <span className="w-32 text-sm">{rank.rank}</span>
                  <Progress 
                    value={rank.percentage} 
                    className="flex-grow mr-4 bg-gray-700" 
                    indicatorClassName="bg-blue-500"
                  />
                  <span className="text-sm font-medium w-12 text-right">{rank.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex justify-center space-x-8">
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
        </ul>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-800 shadow-md mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-white">
        <p>This website is a fan-made project and is not affiliated or endorsed by Bandai Namco Inc. or any of its subsidiaries.</p>
        <p className="mt-2">Suggestions? Join our <a href="#" className="text-blue-400 hover:underline">Discord</a>!</p>
      </div>
    </footer>
  )
}

function StatCard({ title, value }: { title: string, value: string }) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-300">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}