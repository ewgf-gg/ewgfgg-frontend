'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '../ui/card'
import { rankIconMap } from '../../app/state/types/tekkenTypes'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface FollowedUser {
  polarisId: string
  username: string
  rank: string
  characterImage: string
}

export const FollowedUserTiles: React.FC = () => {
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([])
  const router = useRouter()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('following') || '[]')
    setFollowedUsers(stored)
  }, [])

  if (followedUsers.length === 0) return null

  return (
    <div className="space-y-2 h-full">
      <h2 className="text-base font-semibold mb-2">Followed Players</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-[3px] p-1">
        {followedUsers.map((user) => {

          return (
            <motion.div
              key={user.polarisId}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={`transition-all rounded-md`}
            >
              <Card
                className={`cursor-pointer border-transparent border hover:border-primary/50 hover:shadow-md max-w-[220px] h-auto`}
                onClick={() => router.push(`/player/${user.polarisId}`)}
              >
                <CardContent className="py-1 px-2">
                  <div className="flex items-center justify-between space-x-2">
                    <Image
                      src={user.characterImage}
                      alt={user.username}
                      width={76}
                      height={76}
                      className="object-contain rounded-full w-[76px] h-[76px]"
                      unoptimized
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm truncate">{user.username}</h3>
                      <Image
                        src={rankIconMap[user.rank]}
                        alt={user.rank}
                        width={70}
                        height={31}
                        className="w-[70px] h-[31px] mt-1"
                        unoptimized
                      />
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}