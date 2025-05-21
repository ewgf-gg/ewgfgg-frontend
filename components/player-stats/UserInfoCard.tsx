"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { rankIconMap, circularCharacterIconMap, Regions, MainCharacterAndRank } from '../../app/state/types/tekkenTypes'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { usePolarisId } from '@/lib/hooks/usePolarisId' 

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

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `about ${diffInSeconds} seconds ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `about ${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `about ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `about ${days} ${days === 1 ? 'day' : 'days'} ago`
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `about ${months} ${months === 1 ? 'month' : 'months'} ago`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `about ${years} ${years === 1 ? 'year' : 'years'} ago`
  }
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
  const { polarisId: currentPolarisId, setPolarisId } = usePolarisId(); 
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const following = JSON.parse(localStorage.getItem('following') || '[]')
    setIsFollowing(following.includes(polarisId))
  }, [polarisId])

  const isProfile = currentPolarisId === polarisId 

  const handleProfileToggle = () => {
    if (isProfile) {
      setPolarisId(null)
    } else {
      setPolarisId(polarisId)
    }
  }

  // eslint-disable-next-line
  const handleFollowToggle = () => {
    let following = JSON.parse(localStorage.getItem('following') || '[]')
    if (following.includes(polarisId)) {
      following = following.filter((id: string) => id !== polarisId)
    } else {
      following.push(polarisId)
    }
    localStorage.setItem('following', JSON.stringify(following))
    setIsFollowing(!isFollowing)
  }

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
                <AvatarFallback className="flex justify-center items-center">
                  {username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <Image
                  src={rankIconMap[mainCharacterAndRank.danRank]}
                  alt={`${mainCharacterAndRank.danRank} rank icon`}
                  width={80}
                  height={80}
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{username}</h2>
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
              </div>

          <div className=" gap-2 flex">
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
            {/* <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleFollowToggle}
                  className="border-2 border-blue-500 px-4 py-2 rounded-lg text-muted-foreground"
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFollowing ? 'Unfollow this user' : 'Follow this user to easily access their page'}</p>
              </TooltipContent>
            </Tooltip> */}
          </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
