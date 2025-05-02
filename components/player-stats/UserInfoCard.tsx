"use client"

import React from 'react'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { rankIconMap, circularCharacterIconMap, Regions, MainCharacterAndRank } from '../../app/state/types/tekkenTypes'
import { CalendarIcon, MapPinIcon } from 'lucide-react'

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
      <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-md">
        <CardContent className="p-6 relative">
          {/* Dan Rank in top right */}
          <div className="absolute top-4 right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <div className="flex-shrink-0">
                    <Image
                      src={rankIconMap[mainCharacterAndRank.danRank]}
                      alt={`${mainCharacterAndRank.danRank} rank icon`}
                      width={32}
                      height={32}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span>{mainCharacterAndRank.danRank}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Highest rank</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Left side - Avatar only */}
            <div className="flex justify-center items-center">
              <Avatar className="size-36 flex justify-center items-center overflow-visible">
                <AvatarImage 
                  src={circularCharacterIconMap[mainCharacterAndRank.characterName]} 
                  alt={mainCharacterAndRank.characterName} 
                  className="object-contain w-auto h-full scale-110"
                />
                <AvatarFallback className="flex justify-center items-center">
                  {username[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Right side - Player info */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {/* Name and ID */}
              <div>
                <h2 className="text-2xl font-bold">{username}</h2>
                <p className="text-sm text-muted-foreground">{formatPolarisId(polarisId)}</p>
              </div>
              
              {/* Location and Last Seen */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{Regions[regionId]}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span>{formatTimestamp(latestBattle)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
