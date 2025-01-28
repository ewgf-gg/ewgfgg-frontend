import { Metadata } from 'next'
import { characterIconMap, rankIconMap, Regions } from '@/app/state/types/tekkenTypes'

type Props = {
  params: { polarisId: string }
  children: React.ReactNode
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Fetch player data
  const response = await fetch(`${process.env.API_URL}/player-stats/${params.polarisId}`)
  const playerData = await response.json()

  if (!playerData) {
    return {
      title: 'Player Not Found',
      description: 'The requested player profile could not be found.'
    }
  }

  const mainChar = playerData.mainCharacterAndRank?.characterName || 'Unknown Character'
  const rank = playerData.mainCharacterAndRank?.danRank || 'Unknown Rank'
  const region = playerData.regionId !== undefined ? Regions[playerData.regionId] : 'Unknown Region'
  const area = playerData.areaId ? ` Area ${playerData.areaId}` : ''
  
  const characterIcon = characterIconMap[mainChar] || ''
  const rankIcon = rankIconMap[rank] || ''
  
  const title = `${playerData.name}'s Tekken 8 Profile - ${mainChar} | ${rank}`
  const description = `🎮 ${playerData.name}'s Tekken 8 Stats\n🥋 Main: ${mainChar}\n👑 Rank: ${rank}\n🌎 Region: ${region}${area}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [characterIcon, rankIcon],
      siteName: 'EWGF.GG',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [characterIcon],
    }
  }
}

export default function PlayerLayout({ children }: Props) {
  return children
}
