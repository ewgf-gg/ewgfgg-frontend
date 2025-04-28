"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { rankIconMap, characterIconMap, Regions, MainCharacterAndRank } from '../../app/state/types/tekkenTypes'
import { CalendarIcon, MapPinIcon, UserIcon } from 'lucide-react'

interface UserInfoCardProps {
  username: string
  regionId: number
  polarisId: string
  latestBattle: number
  mainCharacterAndRank: MainCharacterAndRank
}

const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return 'No date available'
  
  const date = new Date(timestamp * 1000)
  if (date.toString() === 'Invalid Date') {
    console.error('Invalid timestamp:', timestamp)
    return 'Invalid date'
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPolarisId = (id: string): string => {
  if (!id) return id
  return `${id.slice(0, 4)}-${id.slice(4, 8)}-${id.slice(8)}`
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  username,
  regionId,
  polarisId,
  latestBattle,
  mainCharacterAndRank,
}) => {
  return (
    <TooltipProvider>
      <Card className="w-full max-w-md mx-auto overflow-hidden">
        <CardContent className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center space-y-4"
          >
            <Avatar className="w-24 h-24">
              <AvatarImage src={characterIconMap[mainCharacterAndRank.characterName]} alt={mainCharacterAndRank.characterName} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{username}</h2>
              <p className="text-sm text-muted-foreground">{formatPolarisId(polarisId)}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 grid grid-cols-2 gap-4 text-sm"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{Regions[regionId]}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Player&apos;s region</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{formatTimestamp(latestBattle)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Latest battle timestamp</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{mainCharacterAndRank.characterName}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Main character</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Image
                    src={rankIconMap[mainCharacterAndRank.danRank]}
                    alt={`${mainCharacterAndRank.danRank} rank icon`}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                  <span>{mainCharacterAndRank.danRank}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Highest rank</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
