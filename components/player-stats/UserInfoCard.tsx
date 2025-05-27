"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Battle, rankIconMap, circularCharacterIconMap, Regions, MainCharacterAndRank, StatPentagonData } from '../../app/state/types/tekkenTypes'
// BadgeCheck
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { usePolarisId } from '@/lib/hooks/usePolarisId'

interface UserInfoCardProps {
  username: string
  regionId: number
  polarisId: string
  latestBattle: number
  mainCharacterAndRank: MainCharacterAndRank
  battles: Battle[]
  stats: StatPentagonData
}

const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return 'No date available'
  const date = new Date(timestamp * 1000)
  if (date.toString() === 'Invalid Date') return 'Invalid date'
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `about ${diffInSeconds} seconds ago`
  if (diffInSeconds < 3600) return `about ${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `about ${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `about ${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `about ${Math.floor(diffInSeconds / 2592000)} months ago`
  return `about ${Math.floor(diffInSeconds / 31536000)} years ago`
}

const formatPolarisId = (id: string): string => id ? `${id.slice(0, 4)}-${id.slice(4, 8)}-${id.slice(8)}` : id

const calculateStreaks = (battles: Battle[], polarisId: string) => {
  let maxWinStreak = 0, maxLossStreak = 0
  let currentWinStreak = 0, currentLossStreak = 0

  for (const battle of battles) {
    const isPlayer1 = battle.player1PolarisId === polarisId
    const didWin = (isPlayer1 && battle.winner === 1) || (!isPlayer1 && battle.winner === 2)

    if (didWin) {
      currentWinStreak++
      currentLossStreak = 0
      maxWinStreak = Math.max(maxWinStreak, currentWinStreak)
    } else {
      currentLossStreak++
      currentWinStreak = 0
      maxLossStreak = Math.max(maxLossStreak, currentLossStreak)
    }
  }

  return { maxWinStreak, maxLossStreak }
}

const tekkenSubstatSummaries = {
  attackComponents: {
    "attackFrequency": { positive: "Hits often", negative: "Rarely engages" },
    "heavyDamage": { positive: "Big punishes", negative: "Weak damage output" },
    "aggressiveness": { positive: "Constant pressure", negative: "Too passive" },
    "dominance": { positive: "Overwhelms foes", negative: "Easily bullied" }
  },
  defenseComponents: {
    "block": { positive: "Guards reliably", negative: "Leaves guard open" },
    "evasion": { positive: "Slips attacks", negative: "Eats every hit" },
    "throwEscape": { positive: "Breaks throws", negative: "Free throw target" },
    "composure": { positive: "Stays patient", negative: "Panics under pressure" }
  },
  techniqueComponents: {
    "accuracy": { positive: "Lands clean hits", negative: "Whiffs constantly" },
    "judgement": { positive: "Punishes mistakes", negative: "Misses punishes" },
    "retaliation": { positive: "Counters well", negative: "Fails to counter" },
    "stageUse": { positive: "Walls smartly", negative: "Wastes stage tools" }
  },
  spiritComponents: {
    "closeBattles": { positive: "Clutch finisher", negative: "Chokes late rounds" },
    "comeback": { positive: "Rallies hard", negative: "Gives up early" },
    "fightingSpirit": { positive: "Never backs down", negative: "Lacks fire" },
    "concentration": { positive: "Calm and focused", negative: "Easily distracted" }
  },
  appealComponents: {
    "respect": { positive: "Plays fair", negative: "Ragequits often" },
    "ambition": { positive: "Always improving", negative: "Plays on autopilot" },
    "fairness": { positive: "No cheap shots", negative: "Cheap tactics" },
    "versatility": { positive: "Diverse style", negative: "Repeats same moves" }
  }
}

function getSummaryBoxes(stats: StatPentagonData) {
  const entries = [];

  for (const category in stats) {
    for (const substat in stats[category]) {
      const value = stats[category][substat as keyof typeof stats[typeof category]];
      const summary = tekkenSubstatSummaries[category]?.[substat] || {
        positive: `${substat}`,
        negative: `${substat}`
      };
      entries.push({
        substat,
        value,
        ...summary // includes positive & negative
      });
    }
    console.log('this is the category and stats', category,stats, stats[category]);
  }

  const sortedByLow = [...entries].sort((a, b) => a.value - b.value).slice(0, 2);
  const sortedByHigh = [...entries].sort((a, b) => b.value - a.value).slice(0, 2);

  return {
    negative: sortedByLow,
    positive: sortedByHigh
  };
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  username,
  regionId,
  polarisId,
  latestBattle,
  mainCharacterAndRank,
  battles,
  stats
}) => {
  const { polarisId: currentPolarisId, setPolarisId } = usePolarisId()
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const following = JSON.parse(localStorage.getItem('following') || '[]')
    setIsFollowing(following.includes(polarisId))
  }, [polarisId])

  const isProfile = currentPolarisId === polarisId
  const handleProfileToggle = () => setPolarisId(isProfile ? null : polarisId)
  const { maxWinStreak } = useMemo(() => calculateStreaks(battles, polarisId), [battles, polarisId])
  const { negative, positive } = useMemo(() => getSummaryBoxes(stats), [stats])

  return (
    <TooltipProvider>
      <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-md">
        <CardContent className="p-6 relative">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex flex-col justify-center items-center gap-5">
              <Avatar className="size-36 flex justify-center items-center overflow-visible">
                <AvatarImage
                  src={circularCharacterIconMap[mainCharacterAndRank.characterName]}
                  alt={mainCharacterAndRank.characterName}
                  className="object-contain w-auto h-full scale-110"
                />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
              <Image
                src={rankIconMap[mainCharacterAndRank.danRank]}
                alt={`${mainCharacterAndRank.danRank} rank icon`}
                width={80}
                height={80}
                className="object-contain"
                unoptimized
              />
              {/* <div className="flex flex-col gap-2 items-center mt-2">
                <span className="px-3 py-1 rounded-md text-md font-medium border border-blue-400 text-blue-300 bg-blue-900/20 backdrop-blur-md shadow-sm">
                  🌟 Contributor
                </span>
                <span className="px-4 py-1 rounded-md text-sm font-bold text-white bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 border-2 border-white shadow-md tracking-wider uppercase">
                💎 Patreon Elite
              </span>
              </div> */}
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{username}</h2>
                {/* <BadgeCheck
                  className="text-sky-400 w-6 h-6 drop-shadow-sm"
                  strokeWidth={2.4}
                  title="Verified"
                /> */}
              </div>
                <p className="text-sm text-muted-foreground">{formatPolarisId(polarisId)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{Regions[regionId]}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{formatTimestamp(latestBattle)}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-green-600 font-medium">
                    🔥 Max Win Streak: {maxWinStreak}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {negative.map((item, i) => (
                    <span
                      key={`neg-${i}`}
                      className="border border-red-200 text-red-700 bg-red-50 px-3 py-1 rounded-sm text-sm font-semibold shadow-sm"
                    >
                      {item.negative}
                    </span>
                  ))}
                  {positive.map((item, i) => (
                    <span
                      key={`pos-${i}`}
                      className="border border-green-200 text-green-700 bg-green-50 px-3 py-1 rounded-sm text-sm font-semibold shadow-sm"
                    >
                      {item.positive}
                    </span>
                  ))}
                </div>
              </div>

              <div className="gap-2 flex mt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleProfileToggle}
                      className="border-2 border-purple-500 px-4 py-2 rounded-lg text-muted-foreground"
                    >
                      {isProfile ? 'Remove as Profile' : 'Set as Profile'}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isProfile ? 'Remove this user from your Profile' : 'Set this user as your Profile user'}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}